const {DataTypes, Op} = require('sequelize');
const conn = require('../connectionDB');

//Models
const Product = require('./product.model');
const ProductImage = require('./productImage.model');
const OrderDetail = require('./orderDetail.model');
const OrderAddress = require('./OrderAddress.model');

const Order = conn.define( 'order', {
	status: {
		type: DataTypes.ENUM('pending', 'dispatched', 'delivered'),
		defaultValue: 'pending',
	}
}, {
	timestamps: true,
	updatedAt: 'statusChangeDate',
	createdAt: 'orderDate',
	scopes: {
		products: {
			include: [
				{
					model: OrderAddress,
					as: 'address',
					attributes: {
						exclude: ['orderId', 'id'],
					}
				},
				{
					model: OrderDetail,
					as: 'details',
					attributes: {
						exclude: ['orderId']
					},
					include: {
						model: Product,
						include: [
							{
								model: ProductImage,
								as: 'images',
								attributes: {
									exclude: ['productId']
								},
								//order: [[{model: ProductImage, as: 'images'}, 'id', 'DESC']],
							},
						],
					},
				}
			],
			order: [
				[{model: OrderDetail, as: 'details'}, 'ref', 'ASC'],
			],
		}
	},
	hooks: {
		afterFind: async (instances) => {
			if(!Array.isArray(instances)){
				instances = [instances];
			}
			instances.forEach( instance => {
				instance.dataValues.details.forEach( detail => {
					detail.dataValues.image = detail.dataValues.product.dataValues.images[0].dataValues.url;
					delete detail.dataValues.product;
				})
			});
		}
	}
});

module.exports = Order;
