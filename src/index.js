const { Client } = require('klasa');
const { config } = require('./config');
require('dotenv').config();

Client.use(require('klasa-dashboard-hooks'));
class MyKlasaClient extends Client {

    constructor(...args) {
        super(...args);

        // Add any properties to your Klasa Client
    }

    // Add any methods to your Klasa Client

}

// eslint-disable-next-line no-undef
new MyKlasaClient(config).login(process.env.BOT_TOKEN);

Client.defaultUserSchema
.add('experience', 'integer', {
    default: 0,
    configurable: false
}).add('gamemode', 'Integer', {
    default: 1,
    configurable: true
}).add('usernameOsu', 'string', {
    default: 'allo',
    configurable: false
}).add('level', 'Integer', {
    default: 0,
    configurable: false
});

Client.defaultGuildSchema
    .add('osu', folder => folder
        .add('lastMap', 'string', {
            default: ''
        }))