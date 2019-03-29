const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, { description: 'Check your current level.' });
    }

    run(message) {
        let percent = (0.1 * Math.sqrt(message.author.settings.experience + 1)).toString()
        return message.send(`You are currently **level ${message.author.settings.level}** *(${percent.slice(2, 4)}.${percent.slice(4, 6)}% before lvl${message.author.settings.level + 1})* !`);
    }

};