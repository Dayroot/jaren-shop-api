const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Custom Validations
const {isString, isAlphaVerbose} = require('../../utils/customValidations');

const User = conn.define( 'User', {
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
});


// User.beforeCreate((use, options) => {

// });


module.exports = User;
