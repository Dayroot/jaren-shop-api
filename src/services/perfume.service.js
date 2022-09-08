const boom = require('@hapi/boom');
const { QueryTypes } = require('sequelize');

//Database connection
const conn = require('../db/connectionDB');

//Models
const Perfume = require('../db/models/perfume.model');
const Product = require('../db/models/product.model');
const PerfumePrice = require('../db/models/perfumePrice.model');
const ProductImage = require('../db/models/productImage.model');

//Service
const ProductService = require('./product.service');

class PerfumeService {

	static add = async (brand, name, description, stock, images, gender, perfumePrices) => {

		const request = this._setRequestAdd({brand, name, description, stock, images, gender, perfumePrices});
		const perfumeInstance =  await Perfume.create(
			request,
			{
				include: [
					{
						model: PerfumePrice
					},
					{
						model: Product,
						include: {
							model: ProductImage,
							as: 'images',
						},
					}
				]
			}
		);

		return await this.findOne(perfumeInstance.id);
	}

	static bulkAdd = async (perfumesData) => {

		const requestArray = perfumesData.map( data => this._setRequestAdd(data));
		const perfumeInstances = await Perfume.scope('format').bulkCreate(
			requestArray,
			{
				include: [
					{
						model: PerfumePrice
					},
					{
						model: Product,
						include: {
							model: ProductImage,
							as: 'images',
						},
					}
				]
			}
		);
		const productIds = perfumeInstances.map(perfume => perfume.product.id);
		return await this.find({productId: productIds});
	}

	static findOne = async (id) => {
		const perfume = await Perfume.scope('format').findOne({where: {productId: id}});
		return this._formatData(perfume);
	}

	static find = async (params) => {
		let searchRequest = {};
		if(params && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const perfumes = await Perfume.scope('format').findAll(searchRequest);
		if(!Array.isArray(perfumes)) return [];
		return perfumes.map( perfume => this._formatData(perfume));
	}

	static delete = async (id) => {
		return await Product.destroy({where: {id}});
	}

	static update = async (id, newData) => {

		const [productParams, perfumeParams] = this._getParams(newData);

		await conn.transaction( async (t) => {

			if(Object.keys(productParams).length > 0) {
				await Product.update(productParams, {
					where: {id},
					transaction: t,
				});
			}

			if(Object.keys(perfumeParams).length > 0) {
				await Perfume.update( perfumeParams, {
					where: { productId: id},
					transaction: t,
				});
			}
		});
		const result = await Perfume.scope('format').findOne ({
			where: {productId: id},
		});

		return this._formatData(result);
	}

	static _getParams = (params) => {
		const PRODUCT_KEYS = ['brand', 'name', 'description', 'stock', 'images'];
		const PERFUME_KEYS = ['gender', 'perfumePrices'];

		const entries = Object.entries(params);
		const productParams = entries.filter( entry => PRODUCT_KEYS.includes(entry[0]));
		const perfumeParams = entries.filter( entry => PERFUME_KEYS.includes(entry[0]));

		return [Object.fromEntries(productParams), Object.fromEntries(perfumeParams)];

	}

	static _setRequestAdd = ({brand, name, description, stock, images, gender, perfumePrices}) => (
		{
			gender,
			perfumePrices,
			product: {
				name,
				description,
				stock,
				images,
				brandId: brand.id,
			}
		}
	);

	static _formatData = (perfume) => {
		let data = perfume;
		if(perfume instanceof Perfume) {
			data = perfume.toJSON();
		}
		const formattedData = {...data, ...data.product};
		delete formattedData.product;
		return formattedData;
	}

}

module.exports = PerfumeService;
