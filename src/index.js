const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const {logErrors, errorHandler, boomErrorHandler} = require('./middlewares/error.handler');

const app = express();

//Middlewares
app.use(express.json());

//Execution mode
const mode = process.env.MODE;

if(mode === 'DEVELOPMENT' || mode === 'TEST') {
	app.use(morgan('tiny'));
}

//REST API Routes
routes(app);

//Error handlers
if(mode === 'DEVELOPMENT' || mode === 'TEST') {
	app.use(logErrors)
};
app.use(boomErrorHandler);
app.use(errorHandler);

//Server config
const {PROTOCOL, HOST, PORT} = process.env;
app.listen(PORT, (err) => {
    if (err) console.error(err);
    console.log(`Listening on ${PROTOCOL}://${HOST}:${PORT}`);
});

