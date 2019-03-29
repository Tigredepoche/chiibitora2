/* eslint-disable no-console */
const { Command } = require('klasa');
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
            aliases: ['osu'],
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
            usage: '<info|usernameOsu|gamemode>',
            usageDelim: '-',
            quotedStringSupport: false,
            subcommands: true
        });
    }


   async gamemode(message){
        let utilisateur = message.member.id
        let utlisateurstring = parseInt(utilisateur)
        console.log(utilisateur)
        console.log(utlisateurstring)
        console.log('gamemode')
        let gamemodeinfo = await message.prompt('Choix du gamemode -> 1 = STD / 2 = Tambour / 3 = Fruit / 4 = Piano')
        await message.author.settings.update('gamemode', message.author.settings.gamemode = gamemodeinfo.content);
        switch(gamemodeinfo.content){
            case '1':
                message.channel.send('Your gamemode is now set to STD')
                console.log(message.author.username + ' changed his gamemode to : ' + message.author.settings.gamemode)
                break;
            case '2':
                message.channel.send('Your gamemode is now set to Taiko')
                console.log(message.author.username + ' changed his gamemode to : ' + message.author.settings.gamemode)
                break;
            case '3':
                message.channel.send('Your gamemode is now set to CTB')
                console.log(message.author.username + ' changed his gamemode to : ' + message.author.settings.gamemode)
                break;
            case '4':
                message.channel.send('Your gamemode is now set to Mania')
                console.log(message.author.username + ' changed his gamemode to : ' + message.author.settings.gamemode)
                break;
        }

    }

    info(message, [member = message.member]){
        let GameModeSTR;
        switch(message.author.settings.gamemode){
            case 1:
                GameModeSTR = 'STD'
                break;
            case 2:
                GameModeSTR = 'Taiko'
                break;
            case 3:
                GameModeSTR = 'CTB'
                break;
            case 4:
                GameModeSTR = 'Mania'
                break;
        }
        console.log(message.author)
        return message.sendEmbed(new MessageEmbed()
        .setTitle(`Configuration de ${message.author.username}`)
        .setThumbnail(member.user.displayAvatarURL())
        .addField('❯ Osu', message.author.settings.usernameOsu, true)
        .addField('❯ Game mode', GameModeSTR, true)
        )}

    async usernameOsu(message){
        let info = await message.prompt('Quel est votre pseudo ?'); 
        await  message.author.settings.update('usernameOsu', info.content);
        console.log(message.author.username + ' changed his Osu username to : ' + message.author.settings.usernameOsu)
        message.channel.send(message.author.username + ' changed his osu username to : ' + message.author.settings.usernameOsu)
    }

}