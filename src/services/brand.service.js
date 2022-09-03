//Models
const Brand = require('../db/models/brand.model');

class BrandService {

	static add = async (name, logoUrl) => {
		return await Brand.create({name, logoUrl});
	}

	static bulkAdd = async (dataArray) => {
		return await Brand.bulkCreate(dataArray);
	}

	static find = async () => {
		return await Brand.findAll();
	}

	static findOrCreate = async (name, logoUrl) => {
		const result =  await Brand.findOrCreate({
			where: {name},
			defaults: {
				logoUrl,
			}
		});
		return result[0];
	}

	static findOne = async (id) => {
		return await Brand.findOne({where: {id}});
	}

	static update = async (id, newData) => {
		return await Brand.update({...newData}, {
			where: {id}
		});
	}

	static delete = async (id) => {
		return await Brand.destroy({where: {id}});
	}

}

module.exports = BrandService;
