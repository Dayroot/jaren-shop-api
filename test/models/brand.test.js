const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

//DATABASE CONNECTION
const db = require( path.resolve(process.cwd(), 'src','db', 'connectionDB.js'));

//Models
const BrandModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'brand.model.js'));

describe('Brand model', () => {

	beforeEach( async () => {
		await BrandModel.sync({force: true});
	});

	afterAll( async () => {
		await db.sync({force: true});
	});

	describe('Validations', () => {
		it("If the name property is null, the record is not created", (done) => {
			BrandModel.create({ logoUrl: "http://image.png" })
				.then( () => done("The record should not have been created"))
				.catch( () => done());
		});

		it("If the name property is not a string, the record is not created", (done) => {
			BrandModel.create({ name: 8, logoUrl: "http://image.png" })
				.then( () => done("The record should not have been created"))
				.catch( () => done());
		});

		it("If the name value is not an unique, the record is not created", (done) => {
			BrandModel.create({ name: "Any name", logoUrl: "http://image.png" })
				.then( () => {
					return BrandModel.create({ name: "Any name", logoUrl: "http://image.png" });
				})
				.then( () => done("The record should not have been created"))
				.catch( () => done());
		});

		it("If the logoUrl property is null, the record is not created", (done) => {
			BrandModel.create({ name: "Any name" })
				.then( () => done("The record should be created"))
				.catch( () => done());
		});

		it("If the logoUrl property is not an image url, the record should not be created", (done) => {
			BrandModel.create({ logoUrl: "http://image" })
				.then( () => done("The record should not have been created"))
				.catch( () => done());
		});

		it("If the logoUrl property is not an image url, the record should not be created", (done) => {
			BrandModel.create({ logoUrl: "image.png" })
				.then( () => done("The record should not have been created"))
				.catch( () => done());
		});

	});
});
