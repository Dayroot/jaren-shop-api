const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

//DATABASE CONNECTION
const db = require( path.resolve(process.cwd(), 'src','db', 'connectionDB.js'));

//Models
const UserModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'user.model.js'));

describe('User model', () => {

	beforeEach(async () => {
		await UserModel.sync({force: true});
	});

	afterAll( async () => {
		await db.sync({force: true});
		db.close();
	});
	describe('Validations', () => {

		it("If the firstName property is null, the record will not be created", (done) => {
			UserModel.create({
				lastName:"lastname",
				email: "test@test.com",
				password: "password",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the lastName property is null, the record will not be created", (done) => {
			UserModel.create({
				firstName:"firstname",
				email: "test@test.com",
				password: "password",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the email property is null, the record will not be created", (done) => {
			UserModel.create({
				firstName:"firstname",
				lastName:"lastname",
				password: "password",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the password property is null, the record will not be created", (done) => {
			UserModel.create({
				firstName:"firstname",
				lastname:"lastname",
				email: "test@test.com",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the firstName property is not an alphabetic value (including spaces), the record will not be created", (done) => {
			UserModel.create({
				firstName: "_first_ n@me",
				lastName:"lastname",
				email: "test@test.com",
				password: "password",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the lastName property is not an alphabetic value (including spaces), the record will not be created", (done) => {
			UserModel.create({
				firstName: "firstname",
				lastName:"_last _n@me",
				email: "test@test.com",
				password: "password",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the email property is not an email valid, the record will not be created", (done) => {
			UserModel.create({
				firstName: "firstname",
				lastName: "lastname",
				email: "test",
				password: "password",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the password property is not a string, the record will not be created", (done) => {
			UserModel.create({
				firstName: "firstname",
				lastName: "lastname",
				email: "test@test.com",
				password: 85,
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it("If the parameters are correct, the record will be created", (done) => {
			UserModel.create({
				firstName: "firstname",
				lastName: "lastname",
				email: "test@test.com",
				password: "12345",
			})
			.then( () => done())
			.catch( () => done("The record should have been created"));
		});
	});
});
