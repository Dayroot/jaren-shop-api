const boom = require('@hapi/boom');

//Models
const ProductImage = require('../db/models/productImage.model');

class ProductImageService {

	static add = async ( url ) => {
		const image = await ProductImage.create({url});
		if(!(image instanceof ProductImage)) throw boom.badImplementation('Unexpected error');
		return image.toJSON();
	}

	static bulkAdd = async (ProductImagesArray) => {
		const images = await ProductImage.bulkCreate(ProductImagesArray);
		if(!Array.isArray(images)) throw boom.badImplementation('Unexpected error');
		return images.map(image => image.toJSON());
	}

	static find = async (params = null) => {
		let searchRequest = {};
		if(params && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const images = await ProductImage.findAll(searchRequest);
		if(!Array.isArray(images)) throw boom.badImplementation('Unexpected error');
		return images.map(image => image.toJSON());
	}

	static findOne = async (id) => {
		const image = await ProductImage.findOne({where: {id}});
		if( image === null ) throw boom.notFound('Image not found');
		return image.toJSON();
	}

	static update = async (id, newData) => {
		const res = await ProductImage.update({...newData}, {
			where: {id}
		});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(Array.isArray(res) && res[0] === 0) throw boom.badRequest("The id or data is not valid");
		return await this.findOne(id);
	}

	static delete = async (id) => {
		const res = await ProductImage.destroy({where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(res === 0) throw boom.badRequest("The id is not valid");
		return res;
	}
}

module.exports = ProductImageService;
