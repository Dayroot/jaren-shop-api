const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

//DATABASE CONNECTION
const db = require( path.resolve(process.cwd(), 'src','db', 'connectionDB.js'));

//Models
const PriceModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'price.model.js'));

describe( 'Price model', () => {

	beforeEach( async () => {
		await PriceModel.sync({force: true});
	});

	afterAll( async () => {
		await db.sync({force: true});
	});
	describe( 'Validations', () => {
		it("If the size property is null, the record will not be created", (done) => {
			PriceModel.create({value: 120.09})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the size property is not an string value, the record will not be created", (done) => {
			PriceModel.create({size: 6, value: 120.09})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the value property is null, the record will not be created", (done) => {
			PriceModel.create({size: "100ml"})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the value property is not an integer value, the record will not be created", (done) => {
			PriceModel.create({value: "test", size: "100ml"})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});
	});
});
