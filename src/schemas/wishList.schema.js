const Joi = require('joi');

const wishListId = Joi.number().integer();


const getWishListSchema = Joi.object({
	wishListId: wishListId.required(),
});

module.exports = {
	getWishListSchema,
}
