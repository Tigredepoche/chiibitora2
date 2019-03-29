const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, { description: 'Check how many points you have.' });
    }

    run(message) {
        console.log(message.author.settings)
        return message.send(`You have a total of ${message.author.settings.experience} experience points!`)
    }

};