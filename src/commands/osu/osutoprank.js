/* eslint-disable no-console */
const { Command } = require('klasa')
const osu = require('node-osu')
const { MessageEmbed } = require('discord.js')
const randomColor = require('randomcolor') 

const osuApi = new osu.Api(process.env.TOKEN_OSU, {
    // baseUrl: sets the base api url (default: https://osu.ppy.sh/api)
    notFoundAsError: true, // Reject on not found instead of returning nothing. (default: true)
    completeScores: false // When fetching scores also return the beatmap (default: false)
})

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
            aliases: ['tr'],
            autoAliases: true,
            bucket: 1,
            cooldown: 0,
            promptLimit: 0,
            promptTime: 30000,
            deletable: false,
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            description: 'Return the toprank of osu player',
            extendedHelp: 'Simply write `!toprank username`, if you are registered (via the command !osu) you can only write `!toprank` to show everyone your personal toprank',
            usage: '',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        })
    }

    async run(message, [args]) {
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
        console.log(usernameUser)

        osuApi.getUserBest({ u: usernameUser  }).then((scores) => {
          osuApi.getBeatmaps({ b: scores[0]["beatmapId"] }).then(beatmaps => {
                    
            //ACCURACY ( pls ppy give the acc property)
            let acc1 = ((scores[0]['counts']['300']) * 300) + ((scores[0]['counts']['100']) * 100) + ((scores[0]['counts']['50']) * 50) + ((scores[0]['counts']['miss']) * 0)
            let acc2 = ((scores[0]['counts']['300'] * 1) + (scores[0]['counts']['100'] * 1) + (scores[0]['counts']['50'] * 1) + (scores[0]['counts']['miss'] * 1))
            let AccCalcul = ((acc1 / (acc2 * 300)) * 100)
            let AccCaculFixed = parseFloat(AccCalcul).toFixed(2)

            //OJSAMA package used to calculate Star ratings with mods & PP
            let execOJSAMA = require('child_process').exec
            execOJSAMA(`curl https://osu.ppy.sh/osu/${scores[0].beatmapId} | node ojsama.js +${scores[0]['mods'].filter(e => e !== 'FreeModAllowed')} ${beatmaps[0]['maxCombo']}x ${AccCaculFixed}%` ,  function (error, stdout, stderr) {
            let output = stdout.split('\n')
						let starRatingmods = output[7]
						
						//Generate random hex code color for embed
						let color = randomColor(); 


            //EMBED
            let embed = new MessageEmbed()
              .setAuthor(`${beatmaps[0].title}[${beatmaps[0].version}]+${scores[0]['mods'].filter(e => e !== 'FreeModAllowed')} `, `https://s.ppy.sh/images/${scores[0]['rank']}.png`)
              .setThumbnail(`https://b.ppy.sh/thumb/${beatmaps[0].beatmapSetId}l.jpg`)
              .setFooter(`Beatmap by ${beatmaps[0]['creator']}`)
              .setColor(color)
              .addField(`**❯ Difficulty**`, `${beatmaps[0]['difficulty']['rating'].slice(0,4)}☆`, true)
              .addField(`**❯ Map stats**`, `AR${beatmaps[0]['difficulty']['approach']} OD${beatmaps[0]['difficulty']['overall']} CS${beatmaps[0]['difficulty']['size']} HP${beatmaps[0]['difficulty']['drain']}`, true)
              .addField(`**❯ Max combo**`,`${scores[0]['maxCombo']}x/${beatmaps[0]['maxCombo']}x`, true)
              .addField(`**❯ Accuracy**`,`${AccCaculFixed}%`, true)
              .addField(`**❯ PP**`,`${scores[0]['pp']}PP`,true)
              .addField(`**❯ Map Links**`,`[Website](https://osu.ppy.sh/b/${scores[0].beatmapId}) - [DL](https://osu.ppy.sh/d/${scores[0].beatmapId})([No vid](https://osu.ppy.sh/d/${scores[0].beatmapId}n))`, true)
							
							//mods fields var
							let modslist = scores[0]['mods'].filter(e => e !== 'FreeModAllowed') 
							let callAR = beatmaps[0]['difficulty']['approach'] 
							let callOD = beatmaps[0]['difficulty']['overall']
							let callCS = beatmaps[0]['difficulty']['size'] 
							let callHP = beatmaps[0]['difficulty']['drain']  
							//mods conditions  
							//TODO: DT Stats / DT+HR Stats / osu!direct link[?](Pretty sure it's impossible outsibe web nav)           
              if(modslist[0] !== undefined && modslist !== 'HD'){
                embed.addField(`**❯Difficulty with mods**`,`${starRatingmods.slice(0,4)}☆`, true)
                if(modslist.includes('DT') && modslist.includes('HR') === false){
                  let callAR = beatmaps[0]['difficulty']['approach']
                  let ar = (((parseFloat(callAR)*2)+13)/3)
                    embed.addField(`**❯Map Stats with mods**`,`AR${ar.toFixed(2)}`,true)
                } else if(modslist.includes('HR') && modslist.includes('DT') === false){
									callAR *=1.4
									callOD *=1.4
									callCS *=1.3
									callHP *=1.4
                  if(callAR>10){callAR = 10}
                  if(callOD>10){callOD = 10}
                  embed.addField(`**❯ Map stats with mods**`, `AR${callAR} OD${callOD} CS${callCS.toFixed(1)} HP${callHP}`, true)
                } else if(modslist.includes('EZ') && modslist.includes('DT') === false) {
                  embed.addField(`**❯ Map stats with mods**`, `AR${callAR * 0.5} OD${callOD*0.5} CS${callCS.toFixed(1) *0.5} HP${callHP*0.5}`, true)
                } else if(modslist.includes('DT') && modslist.includes('HR')){
                  callAR *=1.4
									callOD *=1.4
									callCS *=1.3
                  callHP *=1.4
                  if(callAR>10){callAR = 10}
                  if(callOD>10){callOD = 10}
                  embed.addField(`**❯ Map stats with mods**`, `AR${(((callAR)*2)+13)/3} OD${callOD} CS${callCS.toFixed(1)} HP${callHP}`, true)
                }
              }
                    message.channel.send({embed})
            })
        })
    })     
  } // run close
}
