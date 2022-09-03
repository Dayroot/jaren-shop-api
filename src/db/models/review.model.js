const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Custom Validations
const {isString} = require('../../utils/customValidations');

const Review = conn.define( 'Review', {
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
	timestamps: false,
});

module.exports = Review;
