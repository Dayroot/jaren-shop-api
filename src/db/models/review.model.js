const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Custom Validations
const {isString} = require('../../utils/customValidations');

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
});

module.exports = Review;
