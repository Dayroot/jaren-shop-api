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
const ShoppingCart_Product = require('./models/shoppingCart_product.model');
const Purchase_Product = require('./models/purchase_product.model');
const WishList_Product = require('./models/wishList_product.model');

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

			User.hasMany(Address, {
				onDelete: 'CASCADE',
			});
			Address.belongsTo(User);

			User.hasMany(Review, {
				onDelete: 'CASCADE',
			});
			Review.belongsTo(User);

			Product.hasMany(Review, {
				onDelete: 'CASCADE',
			});
			Review.belongsTo(Product);

			User.hasOne(ShoppingCart, {
				onDelete: 'CASCADE',
			});
			ShoppingCart.belongsTo(User);

			User.hasOne(WishList, {
				onDelete: 'CASCADE',
			});
			WishList.belongsTo(User);

			User.hasMany(Purchase, {
				onDelete: 'CASCADE',
			});
			Purchase.belongsTo(User);

			ShoppingCart.hasMany(ShoppingCart_Product);
			ShoppingCart_Product.belongsTo(ShoppingCart);

			Product.hasMany(ShoppingCart_Product);
			ShoppingCart_Product.belongsTo(Product);

			Purchase.hasMany(Purchase_Product);
			Purchase_Product.belongsTo(Purchase);

			Product.hasMany(Purchase_Product);
			Purchase_Product.belongsTo(Product);

			WishList.hasMany(WishList_Product);
			WishList_Product.belongsTo(WishList);

			Product.hasMany(WishList_Product);
			WishList_Product.belongsTo(Product);
		}

		//Sync changes
		await conn.sync({force: true,});


	} catch (error) {
		console.error(error);
	}
}


module.exports = associations;
