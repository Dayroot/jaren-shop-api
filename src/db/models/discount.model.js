const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

const Discount = conn.define('Discount', {
	value: {
		type: DataTypes.FLOAT,
		allowNull: false,
		validate : {
			isNumeric: true,
		}
	}
});


module.exports = Discount;
