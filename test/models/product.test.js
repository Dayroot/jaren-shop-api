const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

//DATABASE CONNECTION
const db = require( path.resolve(process.cwd(), 'src','db', 'connectionDB.js'));

//Models
const ProductModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'product.model.js'));

describe('Product model', () => {

	beforeEach( async () => {
		await ProductModel.sync({force: true});
	});

	afterAll( async () => {
		await db.sync({force: true});
	});

	describe('Validations', () => {
		it("If the name property is null, the record is not created", (done) => {
			ProductModel.create({description:"Any text"})
				.then(() => done("The record should not have been created"))
				.catch(() => done());
		});

		it("If the stock property value is diferent a integer type, the record is not created", (done) => {
			ProductModel.create({name: "Any name", description:"Any text", stock: "test"})
				.then(() => done("The record should not have been created"))
				.catch(() => done());
		});

		it("If the description property is null, the record is not created", (done) => {
			ProductModel.create({name: "Any name"})
				.then(() => done("The record should not have been created"))
				.catch( () => done() );
		});

		it("If the description property is not string type, the record is not created", (done) => {
			ProductModel.create({name: "Any name", description: 8})
				.then(() => done("The record should not have been created"))
				.catch( () => done());
		});

		it("If the name property is not string type, the record is not created", (done) => {
			ProductModel.create({name: 8, description: "Any description"})
				.then(() => done("The record should not have been created"))
				.catch( () => done());
		});

		it("If the name property is not alphanumeric, the record is not created", (done) => {
			ProductModel.create({name: "@-/", description: "Any description"})
				.then(() => done("The record should not have been created"))
				.catch( () => done());
		});
	});

});