//Models
const Brand = require('../db/models/brand.model');

class BrandService {

	static add = async (name, logoUrl) => {
		const brand = await Brand.create({name, logoUrl});
		return brand.toJSON();
	}

	static bulkAdd = async (dataArray) => {
		const brands = await Brand.bulkCreate(dataArray);
		return brands.map( brand => brand.toJSON());
	}

	static find = async () => {
		const brands = await Brand.findAll();
		if(!Array.isArray(brands)) return [];
		return brands.map( brand => brand.toJSON());
	}

	static findOrCreate = async (name, logoUrl) => {
		const result =  await Brand.findOrCreate({
			where: {name},
			defaults: {
				logoUrl,
			}
		});
		return result[0].toJSON();
	}

	static findOne = async (id) => {
		const brand = await Brand.findByPk(id);
		return brand.toJSON();
	}

	static update = async (id, newData) => {
		await Brand.update({...newData}, {
			where: {id}
		});
		return await this.findOne(id);
	}

	static delete = async (id) => {
		return await Brand.destroy({where: {id}});
	}

}

module.exports = BrandService;
