//Models
const ProductImage = require('../db/models/productImage.model');

class ProductImageService {
	add = async ( url ) => {
		return await ProductImage.create({url});
	}

	bulkAdd = async (ProductImagesArray) => {
		return await ProductImage.bulkCreate(ProductImagesArray);
	}

	find = async () => {
		return await ProductImage.findAll();
	}

	findOne = async (id) => {
		return await ProductImage.findOne({where: {id}});
	}

	update = async (id, newData) => {
		return await ProductImage.update({...newData}, {
			where: {id}
		});
	}

	delete = async (id) => {
		return await ProductImage.destroy({where: {id}});
	}
}

module.exports = ProductImageService;
