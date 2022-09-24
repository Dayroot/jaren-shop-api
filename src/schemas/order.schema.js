const Joi = require('joi');
const { createOrderAddressSchema } = require('./address.schema');
const { createDetailSchema } = require('./orderDetail.schema');

const id = Joi.number().integer();
const userId = Joi.number().integer();
const status = Joi.string().valid('pending', 'dispatched', 'delivered');
const details = Joi.array().items( createDetailSchema );

const createOrderSchema = Joi.object({
	userId: userId.required(),
	address: createOrderAddressSchema.required(),
	status: status.required(),
	details: details.required(),
});

const updateOrderSchema = Joi.object({
	id: id.required(),
	userId,
	address: createOrderAddressSchema.forbidden(),
	status,
	details,
});

const getOrderSchema = Joi.object({
	id: id.required(),
});

const getOrderByUserSchema = Joi.object({
	userId: userId.required(),
});

module.exports = {
	createOrderSchema,
	updateOrderSchema,
	getOrderSchema,
	getOrderByUserSchema,
};