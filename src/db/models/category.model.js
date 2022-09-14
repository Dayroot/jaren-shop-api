const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');

//Custom Validations
const {isString} = require('../../utils/customValidations');

const Category = conn.define('category', {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isString,
		}
	}
}, {
	timestamps: false,
});

module.exports = Category;
