const Joi = require('joi');

const ref = Joi.number().integer();
const shoppingCartId = Joi.number().integer();
const productId = Joi.number().integer();
const SKU = Joi.string();
const quantity = Joi.number().integer();


const createSPSchema = Joi.object({
	shoppingCartId: shoppingCartId.required(),
	productId: productId.required(),
	SKU: SKU.required(),
	quantity: quantity.required(),
});

const updateSPSchema = Joi.object({
	shoppingCartId: shoppingCartId.required(),
	ref: ref.required(),
	productId,
	SKU,
	quantity,
});

const deleteSPSchema = Joi.object({
	shoppingCartId: shoppingCartId.required(),
	ref: ref.required(),
});

module.exports = {
	createSPSchema,
	updateSPSchema,
	deleteSPSchema,
};
