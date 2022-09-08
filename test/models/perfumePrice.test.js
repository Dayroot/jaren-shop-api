const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

//DATABASE CONNECTION
const db = require( path.resolve(process.cwd(), 'src','db', 'connectionDB.js'));

//Models
const PerfumePriceModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'perfumePrice.model.js'));

describe( 'PerfumePrice model', () => {

	beforeEach( async () => {
		await PerfumePriceModel.sync({force: true});
	});

	afterAll( async () => {
		await db.sync({force: true});
	});
	describe( 'Validations', () => {
		it("If the size property is null, the record will not be created", (done) => {
			PerfumePriceModel.create({price: 120.09})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the size property is not an integer value, the record will not be created", (done) => {
			PerfumePriceModel.create({size: "test", price: 120.09})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the price property is null, the record will not be created", (done) => {
			PerfumePriceModel.create({size: 124})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the price property is not an integer value, the record will not be created", (done) => {
			PerfumePriceModel.create({price: "test", size: 124})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});
	});
});
