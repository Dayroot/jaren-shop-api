const conn = require('../connectionDB');

//Utils
const overviewCreator = require('../../utils/overviewCreator');

//Models
const Product = require('./product.model');
const ShoppingCart_Product = require('./shoppingCart_product.model');
const Brand = require('./brand.model');
const ProductImage = require('./productImage.model');
const Category = require('./category.model');
const ProductVariant = require('./productVariant.model');

const ShoppingCart = conn.define('shoppingCart', {}, {
	timestamps: false,
	scopes: {
		products: {
			include: {
				model: ShoppingCart_Product,
				as: 'items',
				attributes: {
					exclude: ['shoppingCartId'],
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
							model: ProductVariant,
							as: 'variants',
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
	},
	hooks: {
		afterFind: async (instances) => {
			if(!instances) return;
			if(!Array.isArray(instances)) {
				instances = [instances];
			}

			instances.forEach( cart => {
				cart.dataValues.items?.forEach( itemData => {
					const item = itemData.dataValues;
					const product = item.product.dataValues;
					const category = product.category.dataValues.name;
					const brand = product.brand.dataValues.name;
					const {size, price} = product.variants.find(variant => variant.SKU === item.SKU) || {};
					const overview = overviewCreator({category, brand, productName: product.name, size, gender: product.gender });
					item.overview = overview;
					item.price = price;
					item.image = product.images[0].dataValues.url;
					delete item.product;
				});
			});

		}
	}
}, {
	timestamps: false,
});

module.exports = ShoppingCart;
