//Models
const ProductModel = require('../db/models/product.model');
const BrandModel = require('../db/models/brand.model');
const ProductImageModel = require('../db/models/productImage.model');
const PerfumeModel = require('../db/models/perfume.model');
const PerfumeSizeModel= require('../db/models/perfumeSize.model');

//Services
const BrandService = require('./brand.service');
const ProductImageService = require('./productImage.service');


class ProductService {

	static add = async (brand, name, description, stock, images, type = null) => {

		const brandInstance = await BrandService.add(brand.name, brand.logoUrl);
		const productInstance = await ProductModel.create({
			name,
			description,
			stock,
			ProductImages: images
		}, {
			include: ProductImageModel
		});

		await brandInstance.addProduct(productInstance);

		if(type !== null) {
			const ChildService = require(`./${type.name.toLowerCase()}.service.js`);
			const childProductInstance = await ChildService.add(type.data);
			const childName = `${type.name[0].toUpperCase()}${type.name.slice(1,)}`;
			await productInstance[`set${childName}`](childProductInstance);
		}

		return await this.findOne(productInstance.id);
	}

	static find = () => {

	}

	static findOrCreate = () => {

	}

	static findOne = async (id) => {
		return await ProductModel.findByPk(id);

	}

	static update = () => {

	}

	static delete = () => {

	}

}

module.exports = ProductService;
