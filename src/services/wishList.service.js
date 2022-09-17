const boom = require('@hapi/boom');

//Models
const WishList = require('../db/models/wishList.model');
const WishList_Product = require('../db/models/wishList_product.model');

class wishListService {

	static findOne = async (id) => {
		const wishList = await WishList.scope('products').findOne({where:{id}});
		if( wishList === null ) throw boom.notFound('Wish List not found');
		return wishList.toJSON();
	}

	static addProduct = async (wishListId, productId, SKU) => {
		const isNewProduct = await WishList_Product.findOne({where: {wishListId, productId, SKU}});

		if(isNewProduct !== null) throw boom.conflict('the product had already been added');
		const wishListProduct = await WishList_Product.create({wishListId, productId, SKU});
		if(!(wishListProduct instanceof WishList_Product)) throw boom.badImplementation('Unexpected error');
		return await this.findOne(wishListId);
	}

	static deleteProduct = async (wishListId, ref) => {
		const res = await WishList_Product.destroy({where: {ref}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(res === 0) throw boom.badRequest("The ref is not valid");
		return await this.findOne(wishListId);
	}

}

module.exports = wishListService;
