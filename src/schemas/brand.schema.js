const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(1);
const logoUrl = Joi.string().uri();

const createBrandSchema = Joi.object({
	name: name.required(),
	logoUrl: logoUrl.required(),
});

const updateBrandSchema = Joi.object({
	id: id.required(),
	name,
	logoUrl,
});

const getBrandSchema = Joi.object({
	id: id.required(),
});

module.exports = {
	createBrandSchema,
	updateBrandSchema,
	getBrandSchema,
}
