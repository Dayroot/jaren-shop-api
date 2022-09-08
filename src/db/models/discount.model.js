const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

const Discount = conn.define('discount', {
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
		defaultValue: DataTypes.NOW,
		validate: {
			isDate: true,
		}
	},
	isEnabled: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	}
}, {
	timestamps: false,
});


module.exports = Discount;
