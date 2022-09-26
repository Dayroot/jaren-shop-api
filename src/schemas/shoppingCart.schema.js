const Joi = require('joi');

const shoppingCartId = Joi.number().integer();


const getCartSchema = Joi.object({
	shoppingCartId: shoppingCartId.required(),
});

module.exports = {
	getCartSchema,
}
