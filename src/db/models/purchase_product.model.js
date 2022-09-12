const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Custom validations
const {isString} = require('../../utils/customValidations');

const Purchase_Product = conn.define('purchase_product', {
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

module.exports = Purchase_Product;