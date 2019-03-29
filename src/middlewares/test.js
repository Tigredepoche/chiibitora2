const { Middleware } = require('klasa-dashboard-hooks');

module.exports = class extends Middleware {

	run(request, response) {
		response.setHeader('Content-Type', 'application/json');
	}

};