const Joi = require('joi');

const id = Joi.number().integer();
const userId = Joi.number().integer();
const state = Joi.string();
const city = Joi.string();
const streetAddress = Joi.string();
const postalCode = Joi.string();
const propertyType = Joi.string().valid('apartment', 'house');
const phoneNumber = Joi.string().pattern(/^[0-9]+$/);
const fullname = Joi.string();

const objectCreate = {
	state: state.required(),
	city: city.required(),
	streetAddress: streetAddress.required(),
	postalCode: postalCode.required(),
	propertyType: propertyType.required(),
	phoneNumber: phoneNumber.required(),
	fullname: fullname.required(),
}

const createAddressSchema = Joi.object({
	userId: userId.required(),
	...objectCreate,
});

const createOrderAddressSchema = Joi.object({
	...objectCreate,
});

const updateAddressSchema = Joi.object({
	id: id.required(),
	userId: userId.forbidden(),
	state: state,
	city: city,
	streetAddress: streetAddress,
	postalCode: postalCode,
	propertyType: propertyType,
	phoneNumber: phoneNumber,
	fullname: fullname,
});


const getAddressSchema = Joi.object({
	id: id.required(),
});

const getAddressByUserSchema = Joi.object({
	userId: userId.required(),
});

module.exports = {
	createAddressSchema,
	createOrderAddressSchema,
	updateAddressSchema,
	getAddressSchema,
	getAddressByUserSchema,
}
