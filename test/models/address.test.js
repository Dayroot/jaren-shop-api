const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

//DATABASE CONNECTION
const db = require( path.resolve(process.cwd(), 'src','db', 'connectionDB.js'));

//Models
const AddressModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'address.model.js'));

describe('Address model', () => {

	beforeEach(async () => {
		await AddressModel.sync({force: true});
	});

	afterAll( async () => {
		await db.sync({force: true});
		db.close();
	});
	describe('Validations', () => {

		it('If the state property is null, the record will not be created', (done) => {
			AddressModel.create({
				city: "Any city",
				streetAddress: "av 5a #87 center",
				postalCode: "515005",
				propertyType: "house",
				phoneNumber: "3104895230",
				fullname: "pepito perez",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If the city property is null, the record will not be created', (done) => {
			AddressModel.create({
				state: "Any state",
				streetAddress: "av 5a #87 center",
				postalCode: "515005",
				propertyType: "house",
				phoneNumber: "3104895230",
				fullname: "pepito perez",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If the streetAddress property is null, the record will not be created', (done) => {
			AddressModel.create({
				city: "Any city",
				state: "Any state",
				postalCode: "515005",
				propertyType: "house",
				phoneNumber: "3104895230",
				fullname: "pepito perez",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});
		it('If the postalCode property is null, the record will not be created', (done) => {
			AddressModel.create({
				city: "Any city",
				state: "Any state",
				streetAddress: "av 5a #87 center",
				propertyType: "house",
				phoneNumber: "3104895230",
				fullname: "pepito perez",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If the propertyType property is null, the record will not be created', (done) => {
			AddressModel.create({
				city: "Any city",
				state: "Any state",
				streetAddress: "av 5a #87 center",
				postalCode: "515005",
				phoneNumber: "3104895230",
				fullname: "pepito perez",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If the phoneNumber property is null, the record will not be created', (done) => {
			AddressModel.create({
				city: "Any city",
				state: "Any state",
				streetAddress: "av 5a #87 center",
				postalCode: "515005",
				propertyType: "house",
				fullname: "pepito perez",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If the fullname property is null, the record will not be created', (done) => {
			AddressModel.create({
				city: "Any city",
				state: "Any state",
				streetAddress: "av 5a #87 center",
				postalCode: "515005",
				propertyType: "house",
				phoneNumber: "3104895230",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If the state property is not a string value, the record will not be created', (done) => {
			AddressModel.create({
				city: "Any city",
				state: 86,
				streetAddress: "av 5a #87 center",
				postalCode: "515005",
				propertyType: "house",
				phoneNumber: "3104895230",
				fullname: "pepito perez",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If the city property is not a string value, the record will not be created', (done) => {
			AddressModel.create({
				city: 86,
				state: "Any state",
				streetAddress: "av 5a #87 center",
				postalCode: "515005",
				propertyType: "house",
				phoneNumber: "3104895230",
				fullname: "pepito perez",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If the streetAddress property is not a string value, the record will not be created', (done) => {
			AddressModel.create({
				city: "Any city",
				state: "Any state",
				streetAddress: 86,
				postalCode: "515005",
				propertyType: "house",
				phoneNumber: "3104895230",
				fullname: "pepito perez",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If the propertyType property is not a valid value, the record will not be created', (done) => {
			AddressModel.create({
				city: "Any city",
				state: "Any state",
				streetAddress: "av 5a #87 center",
				postalCode: "515005",
				propertyType: 86,
				phoneNumber: "3104895230",
				fullname: "pepito perez",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If the propertyType property is not a valid value, the record will not be created', (done) => {
			AddressModel.create({
				city: "Any city",
				state: "Any state",
				streetAddress: "av 5a #87 center",
				postalCode: "515005",
				propertyType: "Any",
				phoneNumber: "3104895230",
				fullname: "pepito perez",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If the postalCode property is not a string, the record will not be created', (done) => {
			AddressModel.create({
				city: "Any city",
				state: "Any state",
				streetAddress: "av 5a #87 center",
				postalCode: 515005,
				propertyType: "Any",
				phoneNumber: "3104895230",
				fullname: "pepito perez",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If the phoneNumber property is not a string with numeric content, the record will not be created', (done) => {
			AddressModel.create({
				city: "Any city",
				state: "Any state",
				streetAddress: "av 5a #87 center",
				postalCode: 515005,
				propertyType: "Any",
				phoneNumber: "Any213548",
				fullname: "pepito perez",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If the fullname property is not an alphabetic value (including spaces), the record will not be created', (done) => {
			AddressModel.create({
				city: "Any city",
				state: "Any state",
				streetAddress: "av 5a #87 center",
				postalCode: "515005",
				propertyType: "house",
				phoneNumber: "3104895230",
				fullname: 86,
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If the fullname property is not an alphabetic value (including spaces), the record will not be created', (done) => {
			AddressModel.create({
				city: "Any city",
				state: "Any state",
				streetAddress: "av 5a #87 center",
				postalCode: "515005",
				propertyType: "house",
				phoneNumber: "3104895230",
				fullname: "@ - /",
			})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If the parameters is correct, the record will be created', (done) => {
			AddressModel.create({
				city: "Any city",
				state: "Any state",
				streetAddress: "av 5a #87 center",
				postalCode: "515005",
				propertyType: "house",
				phoneNumber: "3104895230",
				fullname: "Helena Black",
			})
			.then( () => done())
			.catch( () => done("The record should have been created"));
		});
	});
});
