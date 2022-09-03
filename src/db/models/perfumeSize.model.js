const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

const PerfumeSize = conn.define( 'PerfumeSize', {
	size: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			isInt: true,
		}
	}
}, {
	timestamps: false,
});

module.exports = PerfumeSize;
