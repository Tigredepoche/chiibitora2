const { Command } = require('klasa');
const osu = require('node-osu');
const { MessageEmbed } = require('discord.js');
let randomColor = require('randomcolor'); // import the script

let osuApi = new osu.Api(process.env.TOKEN_OSU, {
    // baseUrl: sets the base api url (default: https://osu.ppy.sh/api)
    notFoundAsError: true, // Reject on not found instead of returning nothing. (default: true)
    completeScores: false // When fetching scores also return the beatmap (default: false)
});

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
            aliases: ['compare'],
            autoAliases: true,
            bucket: 1,
            cooldown: 0,
            promptLimit: 0,
            promptTime: 30000,
            deletable: false,
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            description: '',
            extendedHelp: 'No extended help available.',
            usage: '',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(message, [...params]) {
        let settingsUser = message.author.settings
        let usernameUser
        if(!message.args[0]){
          if(settingsUser.usernameOsu === undefined){
            console.log('No score or Wrong username !')
            } else {
              usernameUser = settingsUser.usernameOsu
            }
          } else {
            usernameUser = message.args
          }

          osuApi.getScores({b: message.guildSettings.osu.lastMap, u: usernameUser}).catch(e => {
              message.reply(`${e}`)
          }).then(scores => {
              osuApi.getBeatmaps({b: message.guildSettings.osu.lastMap}).then(beatmaps => {
                //ACCURACY ( pls ppy give the acc property)
                let acc1 = ((scores[0]['counts']['300']) * 300) + ((scores[0]['counts']['100']) * 100) + ((scores[0]['counts']['50']) * 50) + ((scores[0]['counts']['miss']) * 0)
                let acc2 = ((scores[0]['counts']['300'] * 1) + (scores[0]['counts']['100'] * 1) + (scores[0]['counts']['50'] * 1) + (scores[0]['counts']['miss'] * 1))
                let AccCalcul = ((acc1 / (acc2 * 300)) * 100)
                let AccCaculFixed = parseFloat(AccCalcul).toFixed(2)
                
                // F RANK OR SS S A B C D RANK
                if (scores[0]['rank'] === 'F') {
                var imagerank = `https://cdn.discordapp.com/attachments/209061742691483648/560100965362040832/error.png`
                } else {
                imagerank =`https://s.ppy.sh/images/${scores[0]['rank']}.png`
                }

                var embed = new MessageEmbed()
                    .setAuthor(`${beatmaps[0].title}[${beatmaps[0].version}]+${scores[0]['mods'].filter(e => e !== 'FreeModAllowed')} `, `${imagerank}`)
                    .setThumbnail(`https://b.ppy.sh/thumb/${beatmaps[0].beatmapSetId}l.jpg`)
                    .addField(`**❯ PP**`, `${scores[0]['pp'].slice(0,5)}PP`)
                    .addField(`**❯ Map stats**`, `AR${beatmaps[0]['difficulty']['approach']} OD${beatmaps[0]['difficulty']['overall']} CS${beatmaps[0]['difficulty']['size']} HP${beatmaps[0]['difficulty']['drain']}`, true)
                    .addField(`**❯ 300/100/50/MISS**`, `${scores[0]['counts']['300']}/${scores[0]['counts']['100']}/${scores[0]['counts']['50']}/${scores[0]['counts']['miss']}`, true)
                    .addField(`**❯ Max combo**`,`${scores[0]['maxCombo']}x/${beatmaps[0]['maxCombo']}x`, true)
                    .addField(`**❯ Difficulty**`, `${beatmaps[0]['difficulty']['rating'].slice(0,4)}☆`, true)
                    .setColor(randomColor())
                    .setFooter(`Beatmap by ${beatmaps[0]['creator']}`)

                    message.channel.send({embed})

              })
          })
    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};
