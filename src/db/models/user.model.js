const {DataTypes} = require('sequelize');
const conn = require('../connectionDB');
const bcrypjs = require('bcryptjs');

//Custom Validations
const {isString, isAlphaVerbose} = require('../../utils/customValidations');

//Models
const WishList = require('./wishList.model');
const ShoppingCart = require('./shoppingCart.model');

const encryptPassword = async (instances) => {

	if(!instances) return;
	if(!Array.isArray(instances)) {
		instances = [instances];
	}

	const promises = instances.map( async (user )=> {
		const {password} = user.dataValues;
		const passwordHash = await bcrypjs.hash( password, 8 );
		user.dataValues.password = passwordHash;
	});

	await Promise.all(promises);
}

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
	},
	hooks: {
		beforeCreate: async (instance) => {
			await encryptPassword(instance);
		},
		beforeBulkCreate: async (instances) => {
			await encryptPassword(instances);
		},
	}
});

module.exports = User;
