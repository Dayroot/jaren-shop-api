//models
const Discount = require('../db/models/discount.model');

class DiscountService {
	static add = async ( value, finishDate, isEnabled ) => {
		return await Discount.create({value, finishDate, isEnabled});
	}

	static bulkAdd = async (discountsArray) => {
		return await Discount.bulkCreate(discountsArray);
	}

	static find = async () => {
		return await Discount.findAll();
	}

	static findOne = async (id) => {
		return await Discount.findOne({where: {id}});
	}

	static update = async (id, newData) => {
		return await Discount.update({...newData}, {
			where: {id}
		});
	}

	static delete = async (id) => {
		return await Discount.destroy({where: {id}});
	}

}
module.exports = DiscountService;
