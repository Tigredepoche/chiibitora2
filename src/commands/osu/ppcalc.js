const { Command } = require('klasa');

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
            aliases: ['owo'],
            autoAliases: true,
            bucket: 1,
            cooldown: 0,
            promptLimit: 0,
            promptTime: 30000,
            deletable: false,
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            description: 'check !help ppcalc',
            extendedHelp: '"!owo URLBEATMAP, +MODS ACC% COMBOx MISSm" ( exemple !owo  https://osu.ppy.sh/beatmapsets/781509#osu/1642274, +HDDT 99.50% 430x 1m )  ',
            usage: '',
            usageDelim: ',',
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(msg, [...params]) {
        var execOJSAMA = require('child_process').exec;
        var idmessage = msg.args[0]
        var IDbeatmap = idmessage.split('/').pop()
        console.log(msg.args)
        var secondARGS = msg.args[1];
        if(secondARGS==='undefined'){
            secondARGS = ' '
        }
        else{
            secondARGS = msg.args[1]
        }
        
        execOJSAMA('curl https://osu.ppy.sh/osu/' + IDbeatmap + ' | node 2ojsama.js ' + secondARGS ,  function (error, stdout, stderr) {
             //console.log('stdout: ' + stdout);
             msg.channel.send('```'+ stdout + '\n' +'```')
            // console.log('stdout split : ' + out)
            // console.log(Array.from(out)) 
            // console.log('stderr: ' + stderr);
            if (error !== null) {
              console.log('exec error: ' + error);
            }
        })
    }
}
