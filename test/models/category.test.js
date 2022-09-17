const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

//DATABASE CONNECTION
const db = require( path.resolve(process.cwd(), 'src','db', 'connectionDB.js'));

//Models
const CategoryModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'category.model.js'));

describe( 'Category model', () => {

	beforeEach( async () => {
		await CategoryModel.sync({force: true});
	});

	afterAll( async () => {
		await db.sync({force: true});
		db.close();
	});
	describe( 'Validations', () => {
		it("If the name property is null, the record will not be created", (done) => {
			CategoryModel.create({})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the name property is not an string value, the record will not be created", (done) => {
			CategoryModel.create({name: 6})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the parameters are correct, the record will be created", (done) => {
			CategoryModel.create({name: "any name"})
			.then( () => done())
			.catch( () => done("The record should have been created"));
		});
	});
});
