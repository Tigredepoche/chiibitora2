const { Command } = require('klasa');
var search = require('youtube-search');
const { MessageEmbed, Discord } = require('discord.js');


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
            aliases: ['youtube', 'yt'],
            autoAliases: true,
            bucket: 1,
            cooldown: 0,
            promptLimit: 0,
            promptTime: 30000,
            deletable: false,
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            description: 'Trouve une vidéo youtube',
            extendedHelp: 'No extended help available.',
            usage: '',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(message, [...params]) {
        var opts = {
            maxResults: 1,
            key: 'AIzaSyAM4O52Rr70WjCRA3_ObK77gADyGE9vk_U',
            type: 'video'
        }

        search(message.args, opts, function(err, results) {
            if(err) return console.log(err);
            const embed = new MessageEmbed()
            .setTitle("Youtube Videos and more")
            .setDescription("Results for : " + message.args)
            .setColor(0x00AE86)
            .setAuthor(message.author.username, message.member.user.displayAvatarURL())
            .setTimestamp()
            
          for(const data of results) {
           // console.log(message.guild.members.get(data.userId).user.tag);
           console.log('DATA :' + data.title)
        //    embed.addBlankField()
            embed.addField(data.title,'Channel: ' + data.channelTitle + ' | Type : ' + data.kind + '| [Link](' + data.link + ')');
            embed.setThumbnail(data.thumbnails.high.url)

            
          }
          return message.channel.send({embed});
        })

}

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};
