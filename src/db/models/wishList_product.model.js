const conn = require('../connectionDB');
const {DataTypes} = require('sequelize');

//Custom validations
const {isString} = require('../../utils/customValidations');

const WishList_Product = conn.define('wishList_product', {
	ref: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	overview: {
		type: DataTypes.TEXT,
		allowNull: false,
		validate: {
			isString,
		}
	}
}, {
	timestamps: false,
});

module.exports = WishList_Product;
