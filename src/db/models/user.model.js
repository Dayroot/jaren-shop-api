const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Custom Validations
const {isString, isAlphaVerbose} = require('../../utils/customValidations');

const User = conn.define( 'user', {
	firstName: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isAlphaVerbose,
		}
	},
	lastName: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isAlphaVerbose,
		}
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isEmail: true,
		}
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isString,
		}
	}
}, {
	timestamps: false,
});


module.exports = User;
