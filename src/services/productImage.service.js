//Models
const ProductImage = require('../db/models/productImage.model');

class ProductImageService {

	static add = async ( url ) => {
		const image = await ProductImage.create({url});
		return image.toJSON();
	}

	static bulkAdd = async (ProductImagesArray) => {
		const images = await ProductImage.bulkCreate(ProductImagesArray);
		return images.map(image => image.toJSON());
	}

	static find = async () => {
		const images = await ProductImage.findAll();
		if(!Array.isArray(images)) return [];
		return images.map(image => image.toJSON());
	}

	static findOne = async (id) => {
		const image = await ProductImage.findOne({where: {id}});
		return image.toJSON();
	}

	static update = async (id, newData) => {
		await ProductImage.update({...newData}, {
			where: {id}
		});
		return await this.findOne(id);
	}

	static delete = async (id) => {
		return await ProductImage.destroy({where: {id}});
	}
}

module.exports = ProductImageService;
