const Joi = require('joi');

const ref = Joi.number().integer();
const productId = Joi.number().integer();
const SKU = Joi.string().max(12);
const price = Joi.number();
const quantity = Joi.number().integer();
const overview = Joi.string();

const createDetailSchema = Joi.object({
	productId: productId.required(),
	SKU: SKU.required(),
	price: price.required(),
	quantity: quantity.required(),
});

const updateDetailSchema = Joi.object({
	ref: ref.required(),
	productId,
	SKU,
	price,
	quantity,
});

const getDetailSchema = Joi.object({
	ref: ref.required(),
});

module.exports = {
	createDetailSchema,
	updateDetailSchema,
	getDetailSchema,
}
