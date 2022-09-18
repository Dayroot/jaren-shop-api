const Joi = require('joi');

const { createVariantSchema, updateVariantSchema } = require('./productVariant.schema');
const { createImageSchema } = require('./productImage.schema');

const id = Joi.number().integer();
const brandId = Joi.number().integer();
const name = Joi.string().min(1);
const description = Joi.string();
const gender = Joi.string().valid('men', 'woman', 'unisex', 'none');
const categoryId = Joi.number().integer();
const discountId = Joi.number().integer();

const createProductSchema = Joi.object({
	brandId: brandId.required(),
	name: name.required(),
	description: description.required(),
	images: Joi.array().items( createImageSchema ).required(),
	gender: gender.required(),
	variants: Joi.array().items( createVariantSchema ).required(),
	categoryId: categoryId.required(),
});

const updateProductSchema = Joi.object({
	id: id.required(),
	brandId,
	name,
	description: description,
	images: Joi.array().forbidden(),
	gender,
	variants: Joi.array().items( updateVariantSchema ),
	categoryId,
	discountId,
});

const getProductSchema = Joi.object({
	id: id.required(),
});

module.exports = {
	createProductSchema,
	updateProductSchema,
	getProductSchema,
}
