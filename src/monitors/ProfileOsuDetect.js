const { Monitor } = require('klasa');
const { MessageEmbed } = require('discord.js');
var randomColor = require('randomcolor'); // import the script

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            name: 'profileosu',
            enabled: true,
            ignoreBots: true,
            ignoreSelf: true,
            ignoreOthers: false
        });
    }

    async run(msg) {
        var color = randomColor(); // a hex code for an attractive color
        // return message.channel.send();
 
        if(msg.content.startsWith('https://osu.ppy.sh/u/')){
        // console.log('/u/')
        var embed = new MessageEmbed() 
        .setTitle('❯ Lien vers le profil' )
        .setURL(msg.content)
        .setImage('http://lemmmy.pw/osusig/sig.php?colour=hex8866ee&uname='+ (msg.content).slice(21, 29) + '&pp=2&removeavmargin&onlineindicator=undefined')
        .setColor(color)
 
        msg.channel.send({ embed });
     }
      }
    }

