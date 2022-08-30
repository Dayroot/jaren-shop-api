//Database Connection
const conn = require('./connectionDB');

//Models
const Perfume = require('./models/perfume.model');
const PerfumeSize = require('./models/perfumeSize.model');
const PerfumePrice = require('./models/perfumePrice.model');
const Product = require('./models/product.model');
const Brand = require('./models/brand.model');
const Discount = require('./models/discount.model');
const ProductImage = require('./models/productImage.model');

try {
	Perfume.belongsToMany(PerfumeSize, {through: PerfumePrice});
	PerfumeSize.belongsToMany(Perfume, {through: PerfumePrice});

	Product.hasOne(Perfume);
	Perfume.belongsTo(Product);

	Brand.hasMany(Product, {
		onDelete: 'CASCADE',
	});
	Product.belongsTo(Brand);

	Discount.hasMany(Product);
	Product.belongsTo(Discount);

	Product.hasMany(ProductImage);
	ProductImage.belongsTo(Product);


	//Sync changes
	conn.sync({force: true});

} catch (error) {
	console.error(error);
}

