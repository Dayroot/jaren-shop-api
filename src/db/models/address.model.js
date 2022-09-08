const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Custom Validations
const {isString, isAlphaVerbose, isNumericString} = require('../../utils/customValidations');

const Address = conn.define( 'address', {

	state: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isString,
		}
	},
	city: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isString,
		}
	},
	streetAddress: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isString,
		}
	},
	postalCode: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isString,
		}
	},
	propertyType: {
		type: DataTypes.ENUM('apartment', 'house'),
		allowNull: false,
	},

	phoneNumber: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isNumericString,
		}
	},
	fullname: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isAlphaVerbose,
		}
	},

});


module.exports = Address;
