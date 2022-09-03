const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Custom Validations
const {isString, isImageUrl} = require('../../utils/customValidations');

const Brand = conn.define('Brand', {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isString,
		}
	},
	logoUrl: {
		type: DataTypes.STRING,
		allowNull: false,
		validate : {
			isImageUrl,
		}
	}
}, {
	timestamps: false,
});

module.exports = Brand;
