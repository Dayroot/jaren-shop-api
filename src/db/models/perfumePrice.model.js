const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

const PerfumePrice = conn.define('PerfumePrice', {
	price: {
		type: DataTypes.FLOAT,
		allowNull: false,
	}
});


module.exports = PerfumePrice;