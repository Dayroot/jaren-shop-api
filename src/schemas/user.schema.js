const Joi = require('joi');

const id = Joi.number().integer();
const firstName = Joi.string().pattern(/^[a-z ]+$/i);
const lastName = Joi.string().pattern(/^[a-z ]+$/i);
const email = Joi.string().email();
const password = Joi.string();

const createUserSchema = Joi.object({
	firstName: firstName.required(),
	lastName: lastName.required(),
	email: email.required(),
	password: password.required(),
});

const updateUserSchema = Joi.object({
	id: id.required(),
	firstName: firstName,
	lastName: lastName,
	email: email,
	password: password,
});

const getUserSchema = Joi.object({
	id: id.required(),
});

module.exports = {
	createUserSchema,
	updateUserSchema,
	getUserSchema,
};
