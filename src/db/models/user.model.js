const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Custom Validations
const {isString, isAlphaVerbose} = require('../../utils/customValidations');

//Models
const WishList = require('./wishList.model');
const ShoppingCart = require('./shoppingCart.model');

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
	timestamps: true,
	updatedAt: false,
	createdAt: 'registrationDate',
	scopes: {
		format: {
			include: [
				{
					model: WishList,
					attributes: {
						exclude: ['userId'],
					}
				},
				{
					model: ShoppingCart,
					attributes: {
						exclude: ['userId'],
					}
				},
			]
		}
	}
});


module.exports = User;
