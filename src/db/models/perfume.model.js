const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Model
const Product = require('./product.model');
const PerfumePrice = require('./perfumePrice.model');
const Brand = require('./brand.model');
const ProductImage = require('./productImage.model');

class Perfume extends Product {}

Perfume.init({
	gender: {
		type: DataTypes.ENUM('men', 'woman'),
		allowNull: false,
	},
}, {
	sequelize: conn,
	modelName: 'perfume',
	timestamps: false,
	scopes: {
		format: {
			attributes: {
				exclude: ['productId', 'id'],
			},
			include: [
				{
					model: PerfumePrice,
					attributes: {
						exclude: ['perfumeId'],
					}
				},
				{
					model: Product,
					include: [
						Brand,
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
				},
			],
		}
	}
});

module.exports = Perfume;
