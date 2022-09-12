//Models
const Purchase = require('../db/models/purchase.model');
const Purchase_Product = require('../db/models/purchase_product.model');

class PurchaseService {

	static findOne = async (id) => {
		const purchase = await Purchase.scope('products').findByPk(id);
		return purchase.toJSON();
	}

	static add = async (userId, status, purchase_products) => {
		const purchase = await Purchase.create( {
			userId,
			status,
			purchase_products,
		}, {
			include: Purchase_Product,
		});
		return await this.findOne(purchase.id);
	}

	static bulkAdd = async (purchasesData) => {
		const purchases = await Purchase.bulkCreate(purchasesData, {
			include: Purchase_Product,
		});

		const purchasesId = purchases.map(purchase => purchase.id);
		return await this.find({id: purchasesId});
	}


	static find = async (params) => {
		let searchRequest = {};
		if(typeof params === 'object' && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const purchases = await Purchase.scope('products').findAll(searchRequest);
		if(!Array.isArray(purchases)) return [];
		return purchases.map( purchase => purchase.toJSON());
	}


	static update = async (id, newData) => {
		await Purchase.update(newData, {where: {id}});
		return await this.findOne(id);
	}

	static delete = async (id) => {
		return await Purchase.destroy({where: {id}});
	}

}

module.exports = PurchaseService;
