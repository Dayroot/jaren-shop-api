const conn = require('../connectionDB');

//Models
const Product = require('./product.model');
const ShoppingCart_Product = require('./shoppingCart_product.model');
const Brand = require('./brand.model');
const ProductImage = require('./productImage.model');
const Category = require('./category.model');
const Price = require('./price.model');

const ShoppingCart = conn.define('shoppingCart', {}, {
	timestamps: false,
	scopes: {
		products: {
			include: {
				model: ShoppingCart_Product,
				attributes: {
					exclude: ['shoppingCartId', 'productId'],
				},
				include: {
					model: Product,
					include: [
						{
							model: Brand,
						},
						{
							model: ProductImage,
							as: 'images',
							attributes: {
								exclude: ['productId']
							},
						},
						{
							model: Price,
							attributes: {
								exclude: ['productId']
							}
						},
						{
							model: Category,
						}
					],
					attributes: {
						exclude: ['brandId', 'categoryId']
					},
				}
			},
		}
	}
}, {
	timestamps: false,
});

module.exports = ShoppingCart;
