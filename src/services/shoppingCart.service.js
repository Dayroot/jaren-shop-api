const boom = require('@hapi/boom');

//Models
const ShoppingCart = require('../db/models/shoppingCart.model');
const ShoppingCart_Product = require('../db/models/shoppingCart_product.model');

class ShoppingCartService {

	static findOne = async (id) => {
		const shoppingCart = await ShoppingCart.scope('products').findOne({where:{id}});
		if( shoppingCart === null ) throw boom.notFound('Shopping Cart not found');
		return shoppingCart.toJSON();
	}

	static addProduct = async (shoppingCartId, productId, quantity, overview) => {

		const currentProduct = await ShoppingCart_Product.findOne({where: {shoppingCartId, productId, overview}});

		if(currentProduct === null) {
			const shoppingProduct = await ShoppingCart_Product.create({shoppingCartId, productId, quantity, overview});
			if(!(shoppingProduct instanceof ShoppingCart_Product)) throw boom.badImplementation('Unexpected error');
		} else {
			const res = await ShoppingCart_Product.update({
				quantity: currentProduct.quantity + 1,
			}, {
				where: {ref: currentProduct.ref}
			});
			if(res === null) throw boom.badImplementation('Unexpected error');
			if(Array.isArray(res) && res[0] === 0) throw boom.badRequest("The ref is not valid");
		}
		return await this.findOne(shoppingCartId);
	}

	static updateProduct = async (shoppingCartId, ref, newData) => {
		const res = await ShoppingCart_Product.update(newData, {
			where: {ref}
		});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(Array.isArray(res) && res[0] === 0) throw boom.badRequest("The ref or data is not valid");
		return await this.findOne(shoppingCartId);
	}

	static deleteProduct = async (shoppingCartId, ref) => {
		const res = await ShoppingCart_Product.destroy({where: {ref}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(Array.isArray(res) && res[0] === 0) throw boom.badRequest("The ref is not valid");
		return await this.findOne(shoppingCartId);
	}

}

module.exports = ShoppingCartService;
