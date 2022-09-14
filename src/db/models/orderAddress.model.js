const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Custom Validations
const {isString, isAlphaVerbose, isNumericString} = require('../../utils/customValidations');

const OrderAddress = conn.define( 'orderAddress', {

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
}, {
	timestamps: false,
});


module.exports = OrderAddress;
