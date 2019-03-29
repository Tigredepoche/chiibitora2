const { Monitor } = require('klasa');

module.exports = class extends Monitor {

    constructor(...args) {
        /**
         * Any default options can be omitted completely.
         * if all options are default, you can omit the constructor completely
         */
        super(...args, {
            enabled: true,
            enabled: true,
            ignoreBots: true,
            ignoreSelf: true,
            ignoreOthers: false
        });
    }

    async run(msg) {
        // 165503887103623168 
        // 107118288592449536
     //   if(msg.content.includes('f')){
     //// }
          if(msg.content === "f" && msg.author.id != '165503887103623168'){
           msg.channel.send("FUN")
        } else           if(msg.content === "f" && msg.author.id === '165503887103623168'){
         msg.channel.send("Non tg Luxior")
        }
    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};
