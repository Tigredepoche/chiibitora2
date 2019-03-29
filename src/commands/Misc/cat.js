const { Command } = require('klasa');
const fetch = require('node-fetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['randomcat', 'cat'],
			description: 'Recupère une image sur random.cat ! (Commande instable atm)'
		});
	}

	async run(msg) {
		const file = await fetch('http://aws.random.cat/meow')
			.then(response => response.json())
			.then(body => body.file);
		return msg.channel.sendFile(file, `cat.${file.slice(file.lastIndexOf('.'), file.length)}`);
	}

};
