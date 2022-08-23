const routes = (app) => {
	app.use('/', (req, res) => {
		res.send('test');
	})
}

module.exports = routes;
