const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

const {isString} = require('../../utils/customValidations');

const ProductVariant = conn.define('productVariant', {
	price: {
		type: DataTypes.FLOAT,
		allowNull: false,
		validate: {
			isNumeric: true,
		}
	},
	size: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isString
		}
	},

	stock: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
		validate: {
			isInt: true,
		}
	},
	SKU: {
		type: DataTypes.STRING(12),
		allowNull: false,
		unique: true,
		validate: {
			isString
		}
	},
	UPC: {
		type: DataTypes.STRING(12),
		allowNull: false,
		unique: true,
		validate: {
			isString
		}
	}
}, {
	timestamps: false,
});


module.exports = ProductVariant;
