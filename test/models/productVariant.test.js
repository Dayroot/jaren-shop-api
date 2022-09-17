const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

//DATABASE CONNECTION
const db = require( path.resolve(process.cwd(), 'src','db', 'connectionDB.js'));

//Models
const ProductVariantModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'productVariant.model.js'));

describe( 'Product Variant model', () => {

	beforeEach( async () => {
		await ProductVariantModel.sync({force: true});
	});

	afterAll( async () => {
		await db.sync({force: true});
		db.close();
	});
	describe( 'Validations', () => {
		it("If the size property is null, the record will not be created", (done) => {
			ProductVariantModel.create({
				price: 120.09,
				SKU: "123456789101",
				UPC: "123456789101",
				stock: 45
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the size property is not an string type, the record will not be created", (done) => {
			ProductVariantModel.create({
				size: 6,
				price: 120.09,
				SKU: "123456789101",
				UPC: "123456789101",
				stock: 45
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the price property is null, the record will not be created", (done) => {
			ProductVariantModel.create({
				size: "100ml",
				SKU: "123456789101",
				UPC: "123456789101",
				stock: 45
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the SKU property is null, the record will not be created", (done) => {
			ProductVariantModel.create({
				size: "100ml",
				price: 50.00,
				UPC: "123456789101",
				stock: 45
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the UPC property is null, the record will not be created", (done) => {
			ProductVariantModel.create({
				size: "100ml",
				SKU: "123456789101",
				price: 50.00,
				stock: 45
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the SKU property is not an string, the record will not be created", (done) => {
			ProductVariantModel.create({
				price: 50.00,
				size: "100ml",
				SKU: 124564,
				UPC: "123456789101",
				stock: 45
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the UPC property is not an string, the record will not be created", (done) => {
			ProductVariantModel.create({
				price: 50.00,
				size: "100ml",
				SKU: "123456789101",
				UPC: 1245,
				stock: 45
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the price property is not an integer type, the record will not be created", (done) => {
			ProductVariantModel.create({
				price: "test",
				size: "100ml",
				SKU: "123456789101",
				UPC: "123456789101",
				stock: 45
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the stock property is not an integer, the record will not be created", (done) => {
			ProductVariantModel.create({
				price: 50.00,
				size: "100ml",
				SKU: "123456789101",
				UPC: "123456789101",
				stock: "test"
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the parameters are correct, the record will be created", (done) => {
			ProductVariantModel.create({
				size: "100ml",
				price: 50.00,
				SKU: "123456789101",
				UPC: "123456789101",
				stock: 45
			})
			.then( () => done())
			.catch( () => done("The record should have been created"));
		});
	});
});
