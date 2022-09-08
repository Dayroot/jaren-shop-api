const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Custom Validations
const {isImageUrl} = require('../../utils/customValidations');

const ProductImage = conn.define( 'productImage', {
	url: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isImageUrl,
		}
	}
}, {
	timestamps: false,
});

module.exports = ProductImage;
