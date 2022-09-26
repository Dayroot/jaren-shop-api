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

	static addProduct = async (shoppingCartId, productId, SKU, quantity) => {


		const currentProductPromise =  ShoppingCart_Product.findOne({where: {shoppingCartId, productId, SKU}});
		const cartPromise = ShoppingCart.findByPk(shoppingCartId);

		const [currentProduct, cart] = await Promise.all([currentProductPromise, cartPromise]);

		if(!cart) throw boom.notFound('Shopping cart not found');

		if(currentProduct === null) {
			const shoppingProduct = await ShoppingCart_Product.create({shoppingCartId, productId, quantity, SKU});
			if(!(shoppingProduct instanceof ShoppingCart_Product)) throw boom.badImplementation('Unexpected error');
		}
		else {
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

		const cart = await ShoppingCart.findByPk(shoppingCartId);
		if(!cart) throw boom.notFound('Shopping cart not found');

		const res = await ShoppingCart_Product.update(newData, {
			where: {ref}
		});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(Array.isArray(res) && res[0] === 0) throw boom.notFound('Item not found');

		return await this.findOne(shoppingCartId);
	}

	static deleteProduct = async (shoppingCartId, ref) => {
		const cart = await ShoppingCart.findByPk(shoppingCartId);
		if(!cart) throw boom.notFound('Shopping cart not found');

		const res = await ShoppingCart_Product.destroy({where: {ref}});

		if(res === null) throw boom.badImplementation('Unexpected error');
		if(res === 0) throw boom.notFound('Item not found');

		return await this.findOne(shoppingCartId);
	}

}

module.exports = ShoppingCartService;
