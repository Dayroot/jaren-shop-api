const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

//DATABASE CONNECTION
const db = require( path.resolve(process.cwd(), 'src','db', 'connectionDB.js'));

//Models
const PerfumeSizeModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'perfumeSize.model.js'));

describe( 'PerfumeSize model', () => {

	beforeEach( async () => {
		await PerfumeSizeModel.sync({force: true});
	});

	afterAll( async () => {
		await db.sync({force: true});
	});
	describe( 'Validations', () => {
		it("If the size property is null, the record will not be created", (done) => {
			PerfumeSizeModel.create({})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the size property is not an alphanumeric value, the record will not be created", (done) => {
			PerfumeSizeModel.create({size: "@ - /"})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});
	});
});
