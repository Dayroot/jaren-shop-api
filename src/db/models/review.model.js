const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Custom Validations
const {isString} = require('../../utils/customValidations');

//Models
const User = require('./user.model');

const Review = conn.define( 'review', {
	rating: {
		type: DataTypes.SMALLINT,
		allowNull: false,
		validate: {
			isInt: true,
		}
	},
	text: {
		type: DataTypes.TEXT,
		validate: {
			isString,
		}
	}
}, {
	timestamps: true,
	scopes: {
		format: {
			attributes: {
				exclude: [ "orderDetailRef", "userId" ],
			},
			include: [
				{
					model: User,
					attributes: {
						exclude: ['email', 'password', 'registrationDate'],
					}
				}
			]
		}
	}
});

module.exports = Review;
