const boom = require('@hapi/boom');
const conn = require('../db/connectionDB');

//Models
const Order = require('../db/models/order.model');
const OrderDetail = require('../db/models/orderDetail.model');
const OrderAddress = require('../db/models/orderAddress.model');


class OrderService {

	static findOne = async (id) => {
		const order = await Order.scope('products').findByPk(id);
		if( order === null ) throw boom.notFound('Order not found');
		return order.toJSON();
	}

	static add = async (userId, address, status, details) => {
		const order = await Order.create( {
			userId,
			address,
			status,
			details,
		}, {
			include: [
				{
					model: OrderDetail,
					as: 'details',
				},
				{
					model: OrderAddress,
					as: 'address',
				}
			],
		});
		if(!(order instanceof Order)) throw boom.badImplementation('Unexpected error');
		return await this.findOne(order.id);
	}

	static bulkAdd = async (ordersData) => {
		const orders = await Order.bulkCreate(ordersData, {
			include: [
				{
					model: OrderDetail,
					as: 'details',
				},
				{
					model: OrderAddress,
					as: 'address',
				}
			],
		});
		if(!Array.isArray(orders)) throw boom.badImplementation('Unexpected error');
		const ordersId = orders.map(order => order.id);
		return await this.find({id: ordersId});
	}


	static find = async (params = null) => {
		let searchRequest = {};
		if(params && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const orders = await Order.scope('products').findAll(searchRequest);
		if(!Array.isArray(orders)) throw boom.badImplementation('Unexpected error');
		return orders.map( order => order.toJSON());
	}


	static update = async (id, newData) => {

		const newDetailsData = newData.details;

		await conn.transaction( async (t) => {

			let detailsPromises = [];
			let orderPromise;

			if(newDetailsData && Array.isArray(newDetailsData)){
				delete newData.details;
				detailsPromises = newDetailsData.map( async (detailData) => {
					const {ref} = detailData;
					if(!ref) throw boom.badRequest('Invalid data');
					await OrderDetail.update(detailData, {
						where: {ref},
						transaction: t,
					});
				});
			}

			if(Object.keys(newData).length !== 0){

				orderPromise = await Order.update(newData, {
					where: {id},
					transaction: t,
				});
			}

			await Promise.all([orderPromise, ...detailsPromises]);
		});
		return await this.findOne(id);
	}

	static delete = async (id) => {
		const res = await Order.destroy({where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(res === 0) throw boom.badRequest("The id is not valid");
		return res;
	}

}

module.exports = OrderService;
