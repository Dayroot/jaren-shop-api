//models
const Discount = require('../db/models/discount.model');

class DiscountService {
	add = async ( value, finishDate, isEnabled ) => {
		return await Discount.create({value, finishDate, isEnabled});
	}

	bulkAdd = async (discountsArray) => {
		return await Discount.bulkCreate(discountsArray);
	}

	find = async () => {
		return await Discount.findAll();
	}

	findOne = async (id) => {
		return await Discount.findOne({where: {id}});
	}

	update = async (id, newData) => {
		return await Discount.update({...newData}, {
			where: {id}
		});
	}

	delete = async (id) => {
		return await Discount.destroy({where: {id}});
	}

}
module.exports = DiscountService;
