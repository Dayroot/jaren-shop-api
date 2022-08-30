const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

const PerfumeSize = conn.define( 'PerfumeSize', {
	size: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isAlphanumeric: true,
		}
	}
});

module.exports = PerfumeSize;
