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
	startDate: {
		type: DataTypes.DATE,
		defaultValue: Date.now,
		allowNull: true,
	},
	isEnabled: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	}
}, {
	timestamps: false,
});


module.exports = Discount;
