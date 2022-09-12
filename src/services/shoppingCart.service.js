//Models
const ShoppingCart = require('../db/models/shoppingCart.model');
const ShoppingCart_Product = require('../db/models/shoppingCart_product.model');

class ShoppingCartService {

	static findOne = async (id) => {
		const shoppingCartInstance = await ShoppingCart.scope('products').findOne({where:{id}});
		return shoppingCartInstance.toJSON();
	}

	static addProduct = async (shoppingCartId, productId, quantity, overview) => {

		const currentProduct = await ShoppingCart_Product.findOne({where: {shoppingCartId, productId, overview}});

		if(currentProduct === null) {
			await ShoppingCart_Product.create({shoppingCartId, productId, quantity, overview});
		} else {
			await ShoppingCart_Product.update({
				quantity: currentProduct.quantity + 1,
			}, {
				where: {ref: currentProduct.ref}
			});
		}
		return await this.findOne(shoppingCartId);
	}

	static updateProduct = async (shoppingCartId, ref, newData) => {
		await ShoppingCart_Product.update(newData, {
			where: {ref}
		});

		return await this.findOne(shoppingCartId);
	}

	static deleteProduct = async (shoppingCartId, ref) => {
		await ShoppingCart_Product.destroy({where: {ref}});
		return await this.findOne(shoppingCartId);
	}

}

module.exports = ShoppingCartService;
