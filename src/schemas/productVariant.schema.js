const Joi = require('joi');

const id = Joi.number().integer();
const size = Joi.string();
const price = Joi.number();
const SKU = Joi.string().max(12);
const UPC = Joi.string().max(12);
const stock = Joi.number().integer();


const createVariantSchema = Joi.object({
	size: size.required(),
	price: price.required(),
	SKU: SKU.required(),
	UPC: UPC.required(),
	stock: stock.required(),
});

const updateVariantSchema = Joi.object({
	id: id.required(),
	size: size,
	price: price,
	SKU: SKU,
	UPC: UPC,
	stock: stock,
});



module.exports = {
	createVariantSchema,
	updateVariantSchema,
}
