const Joi = require('joi');

const id = Joi.number().integer();
const url = Joi.string().uri();

const createImageSchema = Joi.object({
	url: url.required(),
});

const updateImageSchema = Joi.object({
	id: id.required(),
	url: url,
});

const getImageSchema = Joi.object({
	id: id.required(),
});


module.exports = {
	createImageSchema,
	updateImageSchema,
	getImageSchema,
}
