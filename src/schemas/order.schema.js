const Joi = require('joi');
const { createOrderAddressSchema, updateAddressSchema } = require('./address.schema');
const { createDetailSchema, updateDetailSchema } = require('./orderDetail.schema');

const id = Joi.number().integer();
const userId = Joi.number().integer();
const status = Joi.string().valid('pending', 'dispatched', 'delivered');

const createOrderSchema = Joi.object({
	userId: userId.required(),
	address: createOrderAddressSchema.required(),
	status: status.required(),
	details: Joi.array().items( createDetailSchema ).required(),
});

const updateOrderSchema = Joi.object({
	id: id.required(),
	userId,
	address: updateAddressSchema.forbidden(),
	status,
	details: Joi.array().items( updateDetailSchema ),
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
