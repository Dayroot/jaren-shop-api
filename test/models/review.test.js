const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

//DATABASE CONNECTION
const db = require( path.resolve(process.cwd(), 'src','db', 'connectionDB.js'));

//Models
const ReviewModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'review.model.js'));

describe( 'Review model', () => {

	beforeEach( async () => {
		await ReviewModel.sync({force: true});
	});

	afterAll( async () => {
		await db.sync({force: true});
	});
	describe( 'Validations', () => {
		it("If the rating property is null, the record will not be created", (done) => {
			ReviewModel.create({text: "Any text", rating:null})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the rating property value is not an integer, the record will not be created", (done) => {
			ReviewModel.create({rating: "Any rating", text: "Any text"})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the rating property value is not an integer, the record will not be created", (done) => {
			ReviewModel.create({rating: 3.6, text: "Any text"})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the text property is null, the record will be created", (done) => {
			ReviewModel.create({rating: 2, text: null})
			.then( () => done())
			.catch( () => done("The record should have been created"));
		});

		it("if the value of the text property is different from null or string, the record will not be created",
		(done) => {
			ReviewModel.create({rating: 2, text: 8})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("if the parameters are correct, the record will be created",
		(done) => {
			ReviewModel.create({rating: 2, text: "any text"})
			.then( () => done())
			.catch( () => done("The record should have been created"));
		});

	});
});
