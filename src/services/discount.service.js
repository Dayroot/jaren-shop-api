//models
const Discount = require('../db/models/discount.model');

class DiscountService {
	static add = async ( value, startDate, finishDate, isEnabled ) => {
		const discount = await Discount.create({value, startDate, finishDate, isEnabled});
		return discount.toJSON();
	}

	static bulkAdd = async (discountsArray) => {
		const discounts = await Discount.bulkCreate(discountsArray);
		return discounts.map( discount => discount.toJSON());
	}

	static find = async (params) => {
		let searchRequest = {};
		if(typeof params === 'object' && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const discounts = await Discount.findAll(searchRequest);
		if(!Array.isArray(discounts)) return [];
		return discounts.map( discount => discount.toJSON());
	}

	static findOne = async (id) => {
		const discount = await Discount.findOne({where: {id}});
		return discount.toJSON();
	}

	static update = async (id, newData) => {
		await Discount.update({...newData}, {
			where: {id}
		});
		return await this.findOne(id);
	}

	static delete = async (id) => {
		return await Discount.destroy({where: {id}});
	}

}
module.exports = DiscountService;
