const {DataTypes, Model} = require('sequelize');
const conn = require('../connectionDB');

//Custom Validations
const {isString} = require('../../utils/customValidations');

class Product extends Model {}

Product.init({
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isAlphanumeric: true,
			isString,
		}

	},

	description: {
		type: DataTypes.TEXT,
		allowNull: false,
		validate: {
			isString(value) {
				if(typeof value !== 'string') {
					throw new Error('The value must be of type string');
				}
			}
		}
	},

	stock: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		validate: {
			isInt: true,
		}
	}
}, {
	sequelize: conn,
	modelName: 'Product',
	timestamps: false,
});


module.exports = Product;
