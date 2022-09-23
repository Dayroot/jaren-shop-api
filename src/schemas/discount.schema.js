const Joi = require('joi');

const id = Joi.number().integer();
const value = Joi.number();
const finishDate = Joi.date();
const startDate = Joi.date();
const isEnabled = Joi.boolean();

const createDiscountSchema = Joi.object({
	value: value.required(),
	finishDate: finishDate.required(),
	startDate: startDate.required(),
	isEnabled: isEnabled.required(),
});

const updateDiscountSchema = Joi.object({
	id: id.required(),
	value,
	finishDate,
	startDate,
	isEnabled,
});

const getDiscountSchema = Joi.object({
	id: id.required(),
});

module.exports = {
	createDiscountSchema,
	updateDiscountSchema,
	getDiscountSchema,
};
