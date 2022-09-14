const {errorResponse} = require('../utils/responses');

const logErrors = (err, req, res, next) => {
	console.error(err);
	next(err);
};

const errorHandler = (err, req, res, next) => {
	errorResponse(res, 500, 'Unexpected error');
};

const boomErrorHandler = (err, req, res, next) => {
	if(!err.isBoom) {
		next(err);
	}
	const {output} = err;
	errorResponse(res, output.statusCode, output.payload.message);
};

module.exports = {
	logErrors,
	errorHandler,
	boomErrorHandler
};
