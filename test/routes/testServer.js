const express = require('express');
const routes = require('../../src/routes');
const {errorHandler, boomErrorHandler, logErrors} = require('../../src/middlewares/error.handler');

const app = express();

//Middlewares
app.use(express.json());

//REST API Routes
routes(app);

//Execution mode
const mode = process.env.MODE;

//Error handlers
// if(mode === 'DEVELOPMENT' || mode === 'TEST') {
// 	app.use(logErrors)
// };
app.use(boomErrorHandler);
app.use(errorHandler);

module.exports = app;
