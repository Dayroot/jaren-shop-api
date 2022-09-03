const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

//DATABASE CONNECTION
const db = require( path.resolve(process.cwd(), 'src','db', 'connectionDB.js'));

//Models
const PurchaseModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'purchase.model.js'));

describe('Purchase model', () => {

	beforeEach(async () => {
		await PurchaseModel.sync({force: true});
	});

	afterAll( async () => {
		await db.sync({force: true});
	});
	describe('Validations', () => {

		it('If status property is null, the record will be created and the status value must be pending', () =>
			PurchaseModel.create({})
				.then( (purchase) => {
					expect(purchase.status).toEqual('pending');
				})
		);

		it('If status property value is diferent to (pending, dispatched or delivered), the record will not be created', (done) => {
			PurchaseModel.create({status: 'Any'})
			.then( () => done("The record should not have been created"))
			.catch( () => done());
		});

		it('If date property is null, the record will be created and the status value must be the current date', () =>
			PurchaseModel.create({status: 'pending'})
			.then( (purchase) => {
				const currentDate = (new Date()).toLocaleDateString();
				const purchaseDate = (new Date(purchase.date)).toLocaleDateString();
				expect(purchaseDate).toEqual(currentDate);
			})
		);

	});

});