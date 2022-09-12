//Models
const Brand = require('../db/models/brand.model');
const Product = require('../db/models/product.model');
const ProductImage = require('../db/models/productImage.model');

//Services
const BrandService = require('./brand.service');


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

		return await this.findOne(productInstance.id);
	}

	static bulkAdd = async (productsData) => {
		const productInstances = await Product.bulkCreate(productsData, {
			include: {
				model: ProductImage,
				as: 'images',
			},
		});
		if(!Array.isArray(productInstances)) return [];
		const productIds = productInstances.map(product => product.id);
		return await this.find({id: productIds});
	}

	static find = async(params) => {
		let searchRequest = {};
		if(params && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const products = await Product.scope('format').findAll(searchRequest);
		if(!Array.isArray(products)) return [];
		return products.map( product => product.toJSON() );
	}


	static findOne = async (id) => {
		const product = await Product.scope('format').findByPk(id);
		return product.toJSON();
	}

	static update = async (id, newData) => {
		await Product.update(newData, {where: {id}});
		return await this.findOne(id);
	}

	static delete = async (id) => {
		return await Product.destroy({where: {id}});
	}

}

module.exports = ProductService;
