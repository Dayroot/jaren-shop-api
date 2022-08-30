const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

const Purchase = conn.define( 'Purchase', {
	date: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
		validate: {
			isDate: true,
		}
	},
	status: {
		type: DataTypes.ENUM('pending', 'dispatched', 'delivered'),
		defaultValue: 'pending',
	}
});

module.exports = Purchase;
