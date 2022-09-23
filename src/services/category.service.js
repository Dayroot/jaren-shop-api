const boom = require('@hapi/boom');

//models
const Category = require('../db/models/category.model');

class CategoryService {
	static add = async ( name ) => {
		const category = await Category.create({name});
		if(!(category instanceof Category)) throw boom.badImplementation('Unexpected error');
		return category.toJSON();
	}

	static bulkAdd = async (categoriesArray) => {
		const categories = await Category.bulkCreate(categoriesArray);
		if(!Array.isArray(categories)) throw boom.badImplementation('Unexpected error');
		return categories.map( category => category.toJSON());
	}

	static find = async (params = null) => {
		let searchRequest = {};
		if(params && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const categories = await Category.findAll(searchRequest);
		if(!Array.isArray(categories)) throw boom.badImplementation('Unexpected error');
		return categories.map( category => category.toJSON());
	}

	static findOne = async (id) => {
		const category = await Category.findOne({where: {id}});
		if( category === null ) throw boom.notFound('Category not found');
		return category.toJSON();
	}

	static update = async (id, newData) => {
		const res = await Category.update({...newData}, {
			where: {id}
		});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(Array.isArray(res) && res[0] === 0) throw boom.notFound('Product not found');
		return await this.findOne(id);
	}

	static delete = async (id) => {
		const res = await Category.destroy({where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(res === 0) throw boom.notFound("Category not found");
		return res;
	}

}
module.exports = CategoryService;
