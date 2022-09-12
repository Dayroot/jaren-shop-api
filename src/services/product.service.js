const boom = require('@hapi/boom');

//Models
const Product = require('../db/models/product.model');
const ProductImage = require('../db/models/productImage.model');

class ProductService {

	static add = async (brandId, name, description, stock, images) => {
		const productInstance = await Product.create({
			brandId,
			name,
			description,
			stock,
			images
		}, {
			include: {
				model: ProductImage,
				as: 'images',
			},
		});
		if(!(productInstance instanceof Product)) throw boom.badImplementation('Unexpected error');
		return await this.findOne(productInstance.id);
	}

	static bulkAdd = async (productsData) => {
		const productInstances = await Product.bulkCreate(productsData, {
			include: {
				model: ProductImage,
				as: 'images',
			},
		});
		if(!Array.isArray(productInstances)) throw boom.badImplementation('Unexpected error');
		const productIds = productInstances.map(product => product.id);
		return await this.find({id: productIds});
	}

	static find = async(params) => {
		let searchRequest = {};
		if(params && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const products = await Product.scope('format').findAll(searchRequest);
		if(!Array.isArray(products)) throw boom.badImplementation('Unexpected error');
		return products.map( product => product.toJSON() );
	}


	static findOne = async (id) => {
		const product = await Product.scope('format').findByPk(id);
		if( product === null ) throw boom.notFound('Product not found');
		return product.toJSON();
	}

	static update = async (id, newData) => {
		const res = await Product.update(newData, {where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(Array.isArray(res) && res[0] === 0) throw boom.badRequest("The id or data is not valid");
		return await this.findOne(id);
	}

	static delete = async (id) => {
		const res = await Product.destroy({where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(Array.isArray(res) && res[0] === 0) throw boom.badRequest("The id is not valid");
		return res;
	}

}

module.exports = ProductService;
