const { Monitor } = require('klasa');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, { ignoreOthers: false });
    }

    async run(message) {
        // If the message was not sent in a TextChannel, ignore it.
        if (!message.guild) return;

        // Update the user's configuration entry by adding 1 to it.
        await message.author.settings.update('experience', message.author.settings.experience + 1);
        let curLevel = Math.floor(0.1 * Math.sqrt(message.author.settings.experience + 1))
        let lvlATM = message.author.settings.level
        // in case i need to check the exact value :
        // console.log((0.1 * Math.sqrt(message.author.settings.experience + 1)))
        if (curLevel > lvlATM){
            message.author.settings.update('level', curLevel)
            message.reply(`You've leveled up to level **${curLevel}**! uwu`)
        }
    }

};