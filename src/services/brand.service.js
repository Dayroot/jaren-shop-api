const boom = require('@hapi/boom');

//Models
const Brand = require('../db/models/brand.model');

class BrandService {

	static add = async (name, logoUrl) => {
		const brand = await Brand.create({name, logoUrl});
		if(!(brand instanceof Brand)) throw boom.badImplementation('Unexpected error');
		return brand.toJSON();
	}

	static bulkAdd = async (dataArray) => {
		const brands = await Brand.bulkCreate(dataArray);
		if(!Array.isArray(brands)) throw boom.badImplementation('Unexpected error');
		return brands.map( brand => brand.toJSON());
	}

	static find = async (params = null) => {
		let searchRequest = {};
		if(params && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const brands = await Brand.findAll(searchRequest);
		if(!Array.isArray(brands)) throw boom.badImplementation('Unexpected error');
		return brands.map( brand => brand.toJSON());
	}

	static findOrCreate = async (name, logoUrl) => {
		const brand =  await Brand.findOrCreate({
			where: {name},
			defaults: {
				logoUrl,
			}
		});
		if(!(brand[0] instanceof Brand)) throw boom.badImplementation('Unexpected error');
		return brand[0].toJSON();
	}

	static findOne = async (id) => {
		const brand = await Brand.findByPk(id);
		if( brand === null ) throw boom.notFound('Brand not found');
		return brand.toJSON();
	}

	static update = async (id, newData) => {
		const res = await Brand.update({...newData}, {
			where: {id}
		});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(Array.isArray(res) && res[0] === 0) throw boom.notFound('Brand not found');
		return await this.findOne(id);
	}

	static delete = async (id) => {
		const res = await Brand.destroy({where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(res === 0) throw boom.notFound('Brand not found');
		return res;
	}

}

module.exports = BrandService;
