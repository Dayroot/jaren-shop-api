const boom = require('@hapi/boom');

//models
const Discount = require('../db/models/discount.model');

class DiscountService {
	static add = async ( value, startDate, finishDate, isEnabled ) => {
		const discount = await Discount.create({value, startDate, finishDate, isEnabled});
		if(!(discount instanceof Discount)) throw boom.badImplementation('Unexpected error');
		return discount.toJSON();
	}

	static bulkAdd = async (discountsArray) => {
		const discounts = await Discount.bulkCreate(discountsArray);
		if(!Array.isArray(discounts)) throw boom.badImplementation('Unexpected error');
		return discounts.map( discount => discount.toJSON());
	}

	static find = async (params = null) => {
		let searchRequest = {};
		if(params && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const discounts = await Discount.findAll(searchRequest);
		if(!Array.isArray(discounts)) throw boom.badImplementation('Unexpected error');
		return discounts.map( discount => discount.toJSON());
	}

	static findOne = async (id) => {
		const discount = await Discount.findOne({where: {id}});
		if( discount === null ) throw boom.notFound('Discount not found');
		return discount.toJSON();
	}

	static update = async (id, newData) => {
		const res = await Discount.update({...newData}, {
			where: {id}
		});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(Array.isArray(res) && res[0] === 0) throw boom.notFound('Discount not found');
		return await this.findOne(id);
	}

	static delete = async (id) => {
		const res = await Discount.destroy({where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(res === 0) throw boom.notFound('Discount not found');
		return res;
	}

}
module.exports = DiscountService;
