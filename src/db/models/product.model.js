const {DataTypes, Model} = require('sequelize');
const conn = require('../connectionDB');

//Models
const Brand = require('./brand.model');
const ProductImage = require('./productImage.model');


//Custom Validations
const {isString, isAlphaNumVerbose} = require('../../utils/customValidations');

class Product extends Model {}

Product.init({
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isString,
			isAlphaNumVerbose,
		}

	},

	description: {
		type: DataTypes.TEXT,
		allowNull: false,
		validate: {
			isString,
		}
	},

	stock: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		validate: {
			isInt: true,
		}
	},
}, {
	sequelize: conn,
	modelName: 'product',
	timestamps: false,
	scopes: {
		format: {
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
});


module.exports = Product;
