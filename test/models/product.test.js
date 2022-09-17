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
		db.close();
	});

	describe('Validations', () => {
		it("If the name property is null, the record is not created", (done) => {
			ProductModel.create({description:"Any text", gender:"men"})
				.then(() => done("The record should not have been created"))
				.catch(() => done());
		});

		it("If the gender property is null, the record is not created", (done) => {
			ProductModel.create({name:"Any name", description:"Any text"})
				.then(() => done("The record should not have been created"))
				.catch(() => done());
		});

		it("If the gender property value is diferent a string type, the record is not created", (done) => {
			ProductModel.create({name: "Any name", description:"Any text", gender: 6})
				.then(() => done("The record should not have been created"))
				.catch(() => done());
		});

		it("If the description property is null, the record is not created", (done) => {
			ProductModel.create({name: "Any name", gender:"men"})
				.then(() => done("The record should not have been created"))
				.catch( () => done() );
		});

		it("If the description property is not string type, the record is not created", (done) => {
			ProductModel.create({name: "Any name", description: 8, gender:"men"})
				.then(() => done("The record should not have been created"))
				.catch( () => done());
		});

		it("If the name property is not string type, the record is not created", (done) => {
			ProductModel.create({name: 8, description: "Any description", gender:"men"})
				.then(() => done("The record should not have been created"))
				.catch( () => done());
		});

		it("If the name property is not alphanumeric, the record is not created", (done) => {
			ProductModel.create({name: "@-/", description: "Any description", gender:"men"})
				.then(() => done("The record should not have been created"))
				.catch( () => done());
		});

		it("If the parameters are correct, the record is created", (done) => {
			ProductModel.create({name: "Any name", description: "Any description", gender:"men"})
				.then(() => done())
				.catch( () => done("The record should have been created"));
		});
	});

});
