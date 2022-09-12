const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Custom validations
const {isString} = require('../../utils/customValidations');

const ShoppingCart_Product = conn.define('shoppingCart_product', {
	ref: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	quantity: {
		type: DataTypes.INTEGER,
		validate: {
			isInt: true,
		},
	},
	overview: {
		type: DataTypes.TEXT,
		allowNull: false,
		validate: {
			isString,
		}
	},
}, {
	timestamps: false,
});

module.exports = ShoppingCart_Product;
