const Joi = require('joi');

const id = Joi.number().integer();
const productId = Joi.number().integer();
const userId = Joi.number().integer();
const ref = Joi.number().integer();
const rating = Joi.number().integer().min(1).max(5);
const text = Joi.string();

const createReviewSchema = Joi.object({
	productId: productId.required(),
	userId: userId.required(),
	ref: ref.required(),
	rating: rating.required(),
	text: text.required(),
});

const updateReviewSchema = Joi.object({
	id: id.required(),
	productId: productId.forbidden(),
	userId: userId.forbidden(),
	ref: ref.forbidden(),
	rating,
	text,
});

const getReviewSchema = Joi.object({
	id: id.required(),
});

module.exports = {
	createReviewSchema,
	updateReviewSchema,
	getReviewSchema,
};
