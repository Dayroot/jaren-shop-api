const boom = require('@hapi/boom');

//Models
const Purchase = require('../db/models/purchase.model');
const Purchase_Product = require('../db/models/purchase_product.model');
const OrderAddress = require('../db/models/orderAddress.model');
class PurchaseService {

	static findOne = async (id) => {
		const purchase = await Purchase.scope('products').findByPk(id);
		if( purchase === null ) throw boom.notFound('Purchase not found');
		return purchase.toJSON();
	}

	static add = async (userId, address, status, purchase_products) => {
		const purchase = await Purchase.create( {
			userId,
			address,
			status,
			purchase_products,
		}, {
			include: [
				{
					model: Purchase_Product
				},
				{
					model: OrderAddress,
					as: 'address',
				}
			],
		});
		if(!(purchase instanceof Purchase)) throw boom.badImplementation('Unexpected error');
		return await this.findOne(purchase.id);
	}

	static bulkAdd = async (purchasesData) => {
		const purchases = await Purchase.bulkCreate(purchasesData, {
			include: [
				{
					model: Purchase_Product
				},
				{
					model: OrderAddress,
					as: 'address',
				}
			],
		});
		if(!Array.isArray(purchases)) throw boom.badImplementation('Unexpected error');
		const purchasesId = purchases.map(purchase => purchase.id);
		return await this.find({id: purchasesId});
	}


	static find = async (params = null) => {
		let searchRequest = {};
		if(params && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const purchases = await Purchase.scope('products').findAll(searchRequest);
		if(!Array.isArray(purchases)) throw boom.badImplementation('Unexpected error');
		return purchases.map( purchase => purchase.toJSON());
	}


	static update = async (id, newData) => {
		const res = await Purchase.update(newData, {where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(Array.isArray(res) && res[0] === 0) throw boom.badRequest("The id or data is not valid");
		return await this.findOne(id);
	}

	static delete = async (id) => {
		const res = await Purchase.destroy({where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(res === 0) throw boom.badRequest("The id is not valid");
		return res;
	}

}

module.exports = PurchaseService;
