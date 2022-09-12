const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Models
const Product = require('./product.model');
const Brand = require('./brand.model');
const ProductImage = require('./productImage.model');
const Purchase_Product = require('./purchase_product.model');

const Purchase = conn.define( 'purchase', {
	status: {
		type: DataTypes.ENUM('pending', 'dispatched', 'delivered'),
		defaultValue: 'pending',
	}
}, {
	timestamps: true,
	updatedAt: 'statusChangeDate',
	createdAt: 'purchaseDate',
	scopes: {
		products: {
			include: {
				model: Purchase_Product,
				attributes: {
					exclude: ['purchaseId', 'productId']
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
						}
					],
					attributes: {
						exclude: ['brandId']
					},
				}
			}
		}
	}
});

module.exports = Purchase;
