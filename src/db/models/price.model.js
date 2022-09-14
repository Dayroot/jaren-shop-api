const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

const {isString} = require('../../utils/customValidations');

const Price = conn.define('price', {
	value: {
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
}, {
	timestamps: false,
});


module.exports = Price;
