const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

//DATABASE CONNECTION
const db = require( path.resolve(process.cwd(), 'src','db', 'connectionDB.js'));

//Models
const DiscountModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'discount.model.js'));

describe( 'Discount model', () => {

	beforeEach( async () => {
		await DiscountModel.sync({force: true});
	});

	afterAll( async () => {
		await db.sync({force: true});
		db.close();
	});

	describe( 'Validations', () => {
		it("If the value property is null, the record is not created", (done) => {

			let finishDate = new Date();
			finishDate.setDate(finishDate.getDate() + 3);

			DiscountModel.create({ finishDate, isEnabled: true})
				.then( () => done("The record should not have been created"))
				.catch( () => done());
		});

		it("If the value property is not numeric type, the record is not created", (done) => {
			let finishDate = new Date();
			finishDate.setDate(finishDate.getDate() + 3);

			DiscountModel.create({ value: "test", isEnabled: true })
				.then( () => done("The record should not have been created"))
				.catch( () => done() );
		});

		it("If the finishDate property is null, the record is not created", (done) => {

			DiscountModel.create({ value: 30, isEnabled: true })
				.then( () => done("The record should not have been created"))
				.catch( () => done() );
		});

		it("If the isEnabled property is not specified, the record is created and the isEnabled takes value of true", async () => {
			let finishDate = new Date();
			finishDate.setDate(finishDate.getDate() + 3);

			const discount = await DiscountModel.create({ value: 30, finishDate });
			expect(discount instanceof DiscountModel).toBeTruthy();
			expect(discount.isEnabled).toBeTruthy();
		});

		it("If the parameters are correct, the record is created", (done) => {
			const finishDate = (new Date()).toISOString();
			DiscountModel.create({ value: 30, isEnabled: true, finishDate })
				.then( () => done())
				.catch( () => done("The record should have been created") );
		});
	});
});
