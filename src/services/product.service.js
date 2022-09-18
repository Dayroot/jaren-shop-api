const boom = require('@hapi/boom');
const conn = require('../db/connectionDB');

//Models
const Product = require('../db/models/product.model');
const ProductImage = require('../db/models/productImage.model');
const ProductVariant = require('../db/models/productVariant.model');
class ProductService {

	static add = async (brandId, name, description, images, gender, variants, categoryId) => {

		const productInstance = await Product.create({
			brandId,
			name,
			description,
			images,
			gender,
			variants,
			categoryId,
		}, {
			include: [
				{
					model: ProductImage,
					as: 'images',
				},
				{
					model: ProductVariant,
					as: 'variants',
				}
			],
		});
		if(!(productInstance instanceof Product)) throw boom.badImplementation('Unexpected error');
		return await this.findOne(productInstance.id);

	}

	static bulkAdd = async (productsData) => {
		const productInstances = await Product.bulkCreate(productsData, {
			include: [
				{
					model: ProductImage,
					as: 'images',
				},
				{
					model: ProductVariant,
					as: 'variants',
				}
			],
		});
		if(!Array.isArray(productInstances)) throw boom.badImplementation('Unexpected error');
		const productIds = productInstances.map(product => product.id);
		return await this.find({id: productIds});
	}

	static find = async (params = null) => {
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
		const {variants} = newData;

		await conn.transaction( async (t) => {

			let promises = [];

			if(variants && Array.isArray(variants)) {
				delete newData.variants;
				const variantsPromises = variants.map( async (variantData) => {
					const id = variantData.id;
					if(!id) throw boom.badRequest('Invalid data');
					delete variantData.id;
					return await ProductVariant.update( variantData, {
						where: {id},
						transaction: t,
					});
				});
				variantsPromises.length > 0 && promises.push(...variantsPromises);
			}
			if(Object.keys(newData).length > 0) {
				const productPromise = Product.update(newData, {
					where: {id},
					transaction: t,
				});
				productPromise && promises.push(productPromise);
			}
			const responseArray = await Promise.all(promises);
			const isSuccess = responseArray.every( res => {
				return Array.isArray(res) && res[0] === 1;
			});
			if(!isSuccess) throw boom.notFound('Product not found');

		});

		return await this.findOne(id);
	}

	static delete = async (id) => {
		const res = await Product.destroy({where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(res === 0) throw boom.notFound("Product not found");
		return res;
	}

}

module.exports = ProductService;
