const conn = require('../connectionDB');

//Models
const Product = require('./product.model');
const WishList_Product = require('./wishList_product.model');
const Brand = require('./brand.model');
const ProductImage = require('./productImage.model');
const Category = require('./category.model');
const Price = require('./price.model');

const WishList = conn.define('wishList', {}, {
	timestamps: false,
	scopes: {
		products: {
			include: {
				model: WishList_Product,
				attributes: {
					exclude: ['wishListId', 'productId'],
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
});

module.exports = WishList;
