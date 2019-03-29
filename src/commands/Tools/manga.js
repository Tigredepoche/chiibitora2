const { Command } = require('klasa');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        /**
         * Any default options can be omitted completely.
         * if all options are default, you can omit the constructor completely
         */
        super(...args, {
            enabled: true,
            runIn: ['text', 'dm', 'group'],
            requiredPermissions: [],
            requiredSettings: [],
            aliases: ['manga', 'mangainfo'],
            autoAliases: true,
            bucket: 1,
            cooldown: 0,
            promptLimit: 0,
            promptTime: 30000,
            deletable: false,
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            description: 'Donne les infos d\'un manga.',
            extendedHelp: 'No extended help available.',
            usage: '',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(msg, args) {
   
    var NomAnime = (' ' + msg.args)
           
        // Here we define our query as a multi-line string
// Storing it in a separate .graphql/.gql file is also possible
var query = `
query ($search: String) {
    Media(search: $search, format: MANGA, sort: POPULARITY_DESC) {
      description(asHtml: false)
      id
      status
      volumes
      chapters
      genres
      startDate {
          year
          month 
          day
      }
      endDate {
          year
          month
          day
      }
      averageScore
      coverImage { large }
      format
      title {
        romaji
        english
        native
      }
    }
  }
`;

// Define our query variables and values that will be used in the query request
var variables = {
    search: NomAnime
};

// Define the config we'll need for our Api request
var url = 'https://graphql.anilist.co',
    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

// Make the HTTP Api request
fetch(url, options).then(handleResponse)
                   .then(handleData)
                   .catch(handleError);

function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function formatString(str) {
    return str
    .replace(/(\B)[^ ]*/g,match =>(match.toLowerCase()))
    .replace(/^[^ ]/g,match=>(match.toUpperCase()));
  }

function handleData(owo) {
    // console.log(owo)
    console.dir(owo, {depth:null});
    //Raccourci pour les infos
    var info = owo.data.Media
    
    //Je recupere les genres dans une variables
    var listegenres = info.genres
    var toutlesgenres = listegenres.join()

    //Car tout est souvent ongoing :(
    if(info.endDate.day === null){
        var ENDDATE = 'Still releasing'
    }
    else {
        var ENDDATE = `${info.endDate.day}/${info.endDate.month}/${info.endDate.year}`
    }

    //Car la description est parfois beaucoup trop longue ( Merci Hajime no ippo d'avoir 1107 caractères alors que j'ai le droit à 1024 maximum)
    var text = info.description
    var striphere = 1021
    var shortText = text.substring(0, striphere) + '...'
    //Et parfois les balises html me tilt dans les descriptions z.z
    var descSTR = shortText
    var descSTRembed = descSTR.replace(/<br *\/?>/g, "\n").replace(/\n|&rsquo;/,'');

    var embed = new MessageEmbed()
        .setTitle(info.title.romaji)
        .setURL(`https://anilist.co/manga/${info.id}` )
        .setThumbnail(info.coverImage.large)
        .addField(`❯ Format`, formatString(info.format), true)
        .addField(`❯ Status`,formatString(info.status), true)
        .addField(`❯ Average Score`, `${((info.averageScore)/10)}/10`)
        .addField(`❯ Start Date`, `${info.startDate.day}/${info.startDate.month}/${info.startDate.year}`,true)
        .addField(`❯ End Date`, ENDDATE ,true)
        .addField(`❯ Genres`, toutlesgenres )
        .addField(`❯ Description`, descSTRembed,true)


    msg.channel.send(embed)
}

function handleError(error) {
    console.log('Error, check console');
    console.error(error);
    msg.channel.send('Not Found :/ ')
}

    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};
