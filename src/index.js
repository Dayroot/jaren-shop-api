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
	app.use(logErrors);
	app.use(morgan('tiny'));
}

app.use(boomErrorHandler);
app.use(errorHandler);

//REST API Routes
routes(app);

//Server config
const {PROTOCOL, HOST, PORT} = process.env;
app.listen(PORT, (err) => {
    if (err) console.error(err);
    console.log(`Listening on ${PROTOCOL}://${HOST}:${PORT}`);
});
