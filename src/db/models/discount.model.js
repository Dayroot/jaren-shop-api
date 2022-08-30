const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

const Discount = conn.define('Discount', {
	value: {
		type: DataTypes.FLOAT,
		allowNull: false,
		validate: {
			isNumeric: true,
		}
	},
	finishDate: {
		type: DataTypes.DATE,
		allowNull: false,
		validate: {
			isDate: true,
		}
	},
	isEnabled: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	}
});


module.exports = Discount;
