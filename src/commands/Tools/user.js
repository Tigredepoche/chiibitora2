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
            aliases: ['anime', 'animeinfo', 'anilist', 'a', 'ani'],
            autoAliases: true,
            bucket: 1,
            cooldown: 0,
            promptLimit: 0,
            promptTime: 30000,
            deletable: false,
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            description: 'Donne les infos d\'un anime.',
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
    User(name: $search) {
        id
        name
        siteUrl
        avatar {
            large
        }
        about (asHtml: true),
        stats {
            watchedTime
            chaptersRead
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
     console.log(owo)
     console.dir(owo, {depth:null});
    var info = owo.data.Media



    var embed = new MessageEmbed()
        .setTitle(info.title.romaji)
        .setURL('https://anilist.co/anime/' + info.id)
        .setThumbnail(info.coverImage.large)
        .addField('❯ Format', info.format, true)
        .addField('❯ Episodes',info.episodes + ' (' +  info.duration + 'min/ep)', true)
        .addField('❯ Status',formatString(info.status), true)
        .addField('❯ Season', formatString(info.season) + ' ' + info.startDate.year, true)
        .addField('❯ Average Score', ((info.averageScore)/10) + '/10')
        .addField('❯ Start Date', info.startDate.day + '/' + info.startDate.month + '/' + info.startDate.year,true)
        .addField('❯ End Date', info.endDate.day + '/' + info.endDate.month + '/' + info.endDate.year,true)
        .addField('❯ Genres', toutlesgenres )
        .addField('❯ Description', descSTRembed ,true)
        //.addField('❯ Streaming Ep', info.streamingEpisodes[0].title + ' [[Watch it on ' + info.streamingEpisodes[0].site + ']](' + info.streamingEpisodes[0].url + ')')
        .setFooter('❯ ID : ' + info.id)
    
//       console.log(info.streamingEpisodes[0].title)
    var titre = info.streamingEpisodes[0];
if(titre === undefined ){ 
} else {
  embed.addField('❯ Streaming Ep', info.streamingEpisodes[0].title + ' [[Watch it on ' + info.streamingEpisodes[0].site + ']](' + info.streamingEpisodes[0].url + ')')
}
    msg.channel.send(embed)
}

function handleError(error) {
    console.log('Error, check console');
    console.error(error);
    msg.channel.send('Not Found :/')
}

    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};
