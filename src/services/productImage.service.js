//Models
const ProductImage = require('../db/models/productImage.model');

class ProductImageService {

	static add = async ( url ) => {
		return await ProductImage.create({url});
	}

	static bulkAdd = async (ProductImagesArray) => {
		return await ProductImage.bulkCreate(ProductImagesArray);
	}

	static find = async () => {
		return await ProductImage.findAll();
	}

	static findOne = async (id) => {
		return await ProductImage.findOne({where: {id}});
	}

	static update = async (id, newData) => {
		return await ProductImage.update({...newData}, {
			where: {id}
		});
	}

	static delete = async (id) => {
		return await ProductImage.destroy({where: {id}});
	}
}

module.exports = ProductImageService;
