const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

//DATABASE CONNECTION
const db = require( path.resolve(process.cwd(), 'src','db', 'connectionDB.js'));

//Models
const PerfumeModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'perfume.model.js'));

describe( 'Perfume model', () => {

	beforeEach( async () => {
		await PerfumeModel.sync({force: true});
	});

	afterAll( async () => {
		await db.sync({force: true});
	});

	describe( 'Validations', () => {
		it("If the gender property is null, the record is not created", (done) => {
			PerfumeModel.create({})
				.then( () => done("The record should not have been created"))
				.catch( () => done() );
		});

		it("If the value of gender property is not men or women, the record will not be created", (done) => {
			PerfumeModel.create({gender: 'Other value'})
				.then( () => done("The record should not have been created"))
				.catch( () => done());
		});
	});
});
