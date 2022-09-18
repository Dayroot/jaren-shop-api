const boom = require('@hapi/boom');

const validatorHandler = (schema, ...propertys) => {
	return (req, res, next) => {
		let data = {};
		propertys.forEach( prop => {
			data = Object.assign(data, req[prop]);
		});
		const { error } = schema.validate(data, {abortEarly: false});
		if(error) {
			next( boom.badRequest(error) );
		}
		next();
	}
};


module.exports = validatorHandler;
