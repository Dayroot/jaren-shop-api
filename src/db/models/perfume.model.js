const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Model
const Product = require('./product.model');

class Perfume extends Product {}

Perfume.init({
	gender: {
		type: DataTypes.ENUM('men', 'woman'),
		allowNull: false,
	},
}, {
	sequelize: conn,
	modelName: 'Perfume',
	timestamps: false,
});



module.exports = Perfume;
