const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

const Perfume = conn.define('Perfume', {
	gender: {
		type: DataTypes.ENUM('men', 'women'),
		allowNull: false,
	},

});


module.exports = Perfume;
