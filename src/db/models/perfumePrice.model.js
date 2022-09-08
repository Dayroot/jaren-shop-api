const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

const PerfumePrice = conn.define('perfumePrice', {
	price: {
		type: DataTypes.FLOAT,
		allowNull: false,
		validate: {
			isNumeric: true,
		}
	},
	size: {
		type: DataTypes.FLOAT,
		allowNull: false,
		validate: {
			isNumeric: true,
		}
	},
}, {
	timestamps: false,
});


module.exports = PerfumePrice;
