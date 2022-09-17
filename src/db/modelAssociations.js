//Database Connection
const conn = require('./connectionDB');

//Models
const Product = require('./models/product.model');
const ProductVariant = require('./models/productVariant.model');
const Brand = require('./models/brand.model');
const Discount = require('./models/discount.model');
const ProductImage = require('./models/productImage.model');
const User = require('./models/user.model');
const WishList = require('./models/wishList.model');
const ShoppingCart = require('./models/shoppingCart.model');
const Review = require('./models/review.model');
const Order = require('./models/order.model');
const Address = require('./models/address.model');
const ShoppingCart_Product = require('./models/shoppingCart_product.model');
const OrderDetail = require('./models/orderDetail.model');
const WishList_Product = require('./models/wishList_product.model');
const Category = require('./models/category.model');
const OrderAddress = require('./models/orderAddress.model');

const associations = async () => {
	try {

		if(Object.values(Product.associations).length === 0) {

			Product.hasMany(ProductVariant, {
				onDelete: 'CASCADE',
				as: 'variants'
			});
			ProductVariant.belongsTo(Product);

			Category.hasMany(Product);
			Product.belongsTo(Category);

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

			OrderDetail.hasOne(Review, {
				foreignKey: {
					name: 'ref',
					unique: true,
					allowNull: false,
				}
			});
			Review.belongsTo(OrderDetail);

			User.hasOne(ShoppingCart, {
				onDelete: 'CASCADE',
			});
			ShoppingCart.belongsTo(User);

			User.hasOne(WishList, {
				onDelete: 'CASCADE',
			});
			WishList.belongsTo(User);

			User.hasMany(Order, {
				onDelete: 'CASCADE',
			});
			Order.belongsTo(User);

			Order.hasOne(OrderAddress, {as: 'address'});
			OrderAddress.belongsTo(Order);

			ShoppingCart.hasMany(ShoppingCart_Product, {as: 'items'});
			ShoppingCart_Product.belongsTo(ShoppingCart);

			Product.hasMany(ShoppingCart_Product);
			ShoppingCart_Product.belongsTo(Product);

			Order.hasMany(OrderDetail, {
				onDelete: 'CASCADE',
				as: 'details',
			});
			OrderDetail.belongsTo(Order);

			Product.hasMany(OrderDetail);
			OrderDetail.belongsTo(Product);

			WishList.hasMany(WishList_Product, {as: 'items'});
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
