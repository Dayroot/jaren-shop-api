const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

//DATABASE CONNECTION
const db = require( path.resolve(process.cwd(), 'src','db', 'connectionDB.js'));

//Models
const ProductImageModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'productImage.model.js'));

describe( 'ProductImage model', () => {

	beforeEach( async () => {
		await ProductImageModel.sync({force: true});
	});

	afterAll( async () => {
		await db.sync({force: true});
	});

	describe( 'Validations', () => {
		it("If the url property is null, the record will not be created", (done) => {
			ProductImageModel.create({})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the url property is not a valid image url, the record will not be created", (done) => {
			ProductImageModel.create({url: "Any value"})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the url property is not a valid image url, the record will not be created", (done) => {
			ProductImageModel.create({url: 86})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});
	});
});
