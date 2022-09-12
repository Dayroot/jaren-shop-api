//Models
const WishList = require('../db/models/wishList.model');
const WishList_Product = require('../db/models/wishList_product.model');

class wishListService {

	static findOne = async (id) => {
		const wishListInstance = await WishList.scope('products').findOne({where:{id}});
		return wishListInstance.toJSON();
	}

	static addProduct = async (wishListId, productId, overview) => {
		const isNewProduct = await WishList_Product.findOne({where: {wishListId, productId, overview}});

		if(isNewProduct !== null) throw new Error('the product had already been added');
		await WishList_Product.create({wishListId, productId, overview});
		return await this.findOne(wishListId);
	}

	static deleteProduct = async (wishListId, ref) => {
		await WishList_Product.destroy({where: {ref}});
		return await this.findOne(wishListId);
	}

}

module.exports = wishListService;
