const { Command, Klasa, RichDisplay } = require('klasa');
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
            aliases: ['vote'],
            autoAliases: true,
            bucket: 1,
            cooldown: 3,
            promptLimit: 0,
            promptTime: 30000,
            deletable: false,
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            description: 'Creer un vote.',
            extendedHelp: 'No extended help available.',
            usage: '',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(message, [args]) {
       
        if (!message.member.roles.find(r => r.name === 'Membre')) return message.channel.send('This require the role: Membre');


        //if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('This require the permissions: ADMINISTRATOR');
    
    
        if (!message.content[0]) return message.channel.send('Proper Usage: <prefix>poll questions');
    
        var msgdesc = message.content
        console.log('this is : ' + msgdesc)
        var embed = new MessageEmbed()
            .setColor(0xffffff)
            .setFooter('React to vote.')
            .setDescription(msgdesc.substring(5))
            .setTitle(`Poll Created By ${message.author.username}`);
         
            
        let msg = await message.channel.send(embed);
    
    
    
        await msg.react('✅');
        await msg.react('🚫');
    
    
        message.delete({timeout: 1000});
    
    
    
    }
    }
