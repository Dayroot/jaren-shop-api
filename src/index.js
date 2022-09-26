const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');
const {logErrors, errorHandler, boomErrorHandler} = require('./middlewares/error.handler');

//Execution mode
const mode = process.env.MODE;

const app = express();

//Middlewares
app.use(express.json());

//Cors
const whiteList = ['http://localhost:8080'];
const options = {
	origin: (origin, callback) => {
		if(origin && !whiteList.includes(origin)){
			return callback(new Error('Access denied'));
		}
		callback(null, true);
	}
}
app.use(cors(options));

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

