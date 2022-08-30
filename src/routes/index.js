const apiV1Router = require('./apiV1.router');

const routes = (app) => {
	app.use('/api/v1', apiV1Router);
}

module.exports = routes;
