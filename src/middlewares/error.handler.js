const {errorResponse} = require('../utils/responses');

const logErrors = (err, req, res, next) => {
	console.error(err);
	next(err);
};

const errorHandler = (err, req, res, next) => {
	errorResponse(res, 500, 'Unexpected error');
};


module.exports = {
	logErrors,
	errorHandler,
};
