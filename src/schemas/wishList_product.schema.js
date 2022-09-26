const Joi = require('joi');

const ref = Joi.number().integer();
const wishListId = Joi.number().integer();
const productId = Joi.number().integer();
const SKU = Joi.string();


const createWLPSchema = Joi.object({
	wishListId: wishListId.required(),
	productId: productId.required(),
	SKU: SKU.required(),
});

const deleteWLPSchema = Joi.object({
	wishListId: wishListId.required(),
	ref: ref.required(),
});

module.exports = {
	createWLPSchema,
	deleteWLPSchema,
};
