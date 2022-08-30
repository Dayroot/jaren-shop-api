//Models
const Brand = require('../db/models/brand.model');

class BrandService {

	add = async (name, logoUrl) => {
		return await Brand.create({name, logoUrl});
	}

	bulkAdd = async (dataArray) => {
		return await Brand.bulkCreate(dataArray);
	}

	find = async () => {
		return await Brand.findAll();
	}

	findOrCreate = async (name, logoUrl) => {
		return await Brand.findOrCreate({
			where: {name},
			defaults: {
				logoUrl,
			}
		});
	}

	findOne = async (name) => {
		return await Brand.findOne({where: {name}});
	}

	update = async (id, newData) => {
		return await Brand.update({...newData}, {
			where: {id}
		});
	}

	delete = async (id) => {
		return await Brand.destroy({where: {id}});
	}

}

module.exports = BrandService;
