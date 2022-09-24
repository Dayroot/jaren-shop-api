const {DataTypes, Op, Model} = require('sequelize');
const conn = require('../connectionDB');
const boom = require('@hapi/boom');

//Models
const Product = require('./product.model');
const ProductImage = require('./productImage.model');
const OrderDetail = require('./orderDetail.model');
const OrderAddress = require('./OrderAddress.model');

//Utils
const overviewCreator = require('../../utils/overviewCreator');

//Service
const ProductService = require('../../services/product.service');

const setOverview = async ( data ) => {
	const {details} = data.dataValues
	let productsId = details.map( detail => detail.dataValues.productId );
	productsId = Array.from(new Set(productsId));
	const products = await ProductService.find({id: productsId});
	details.forEach(detail => {
		products.forEach( product => {
			const variant = product.variants.find( variant => variant.SKU === detail.dataValues.SKU);
			if(!variant) return;
			const {category: {name: category}, brand:{name:brand}, name: productName, gender } = product;
			const { size } = variant;
			detail.dataValues.overview = overviewCreator({category, brand, productName, size, gender});
		})
	});
};

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
			if(!instances) return;
			if(!Array.isArray(instances)){
				instances = [instances];
			}
			instances.forEach( instance => {
				instance.dataValues.details.forEach( detail => {
					detail.dataValues.image = detail.dataValues.product.dataValues.images[0].dataValues.url;
					delete detail.dataValues.product;
				})
			});
		},
		beforeCreate: async(data) => {
			if(!data.dataValues.details) return;
			await setOverview(data);
		},
		beforeBulkCreate: async (dataArray) => {
			const includeDetails = dataArray.every(data => !!data.dataValues.details);
			if(!includeDetails) return;
			const promises = dataArray.map( async (data) => {
				return await setOverview(data);
			});
			await Promise.all(promises);
		},
	}
});

module.exports = Order;
