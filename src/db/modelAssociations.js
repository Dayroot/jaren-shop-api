//Database Connection
const conn = require('./connectionDB');

//Models
const Product = require('./models/product.model');
const Perfume = require('./models/perfume.model');
const PerfumePrice = require('./models/perfumePrice.model');
const Brand = require('./models/brand.model');
const Discount = require('./models/discount.model');
const ProductImage = require('./models/productImage.model');
const User = require('./models/user.model');
const WishList = require('./models/wishList.model');
const ShoppingCart = require('./models/shoppingCart.model');
const Review = require('./models/review.model');
const Purchase = require('./models/purchase.model');
const Address = require('./models/address.model');

const associations = async () => {
	try {

		if(Object.values(Product.associations).length === 0) {
			Perfume.hasMany(PerfumePrice, {
				onDelete: 'CASCADE',
			});
			PerfumePrice.belongsTo(Perfume);


			Product.hasOne(Perfume);
			Perfume.belongsTo(Product);

			Brand.hasMany(Product, {
				onDelete: 'CASCADE',
			});
			Product.belongsTo(Brand);

			Discount.hasMany(Product);
			Product.belongsTo(Discount);

			Product.hasMany(ProductImage, {
				as: 'images',
				onDelete: 'CASCADE',
			});
			ProductImage.belongsTo(Product);
		}

		//Sync changes
		await conn.sync({force: true,});


	} catch (error) {
		console.error(error);
	}
}


module.exports = associations;
