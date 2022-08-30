const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

//DATABASE CONNECTION
const db = require( path.resolve(process.cwd(), 'src','db', 'connectionDB.js'));

//Models
const BrandModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'brand.model.js'));
const DiscountModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'discount.model.js'));
const PerfumeModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'perfume.model.js'));
const ProductModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'product.model.js'));
const ProductImageModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'productImage.model.js'));
const PerfumeSizeModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'perfumeSize.model.js'));
const ReviewModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'review.model.js'));
const UserModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'user.model.js'));
const AddressModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'address.model.js'));
const PurchaseModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'purchase.model.js'));

describe('Model testing', () => {

	afterAll( async () => {
		await db.sync({force: true});
		db.close();
	});

	describe('Product model', () => {

		beforeEach( async () => {
			await ProductModel.sync({force: true});
		});

		describe('Validations', () => {
			it("If the name property is null, the record is not created", (done) => {
				ProductModel.create({description:"Any text"})
					.then(() => done("The record should not have been created"))
					.catch(() => done());
			});

			it("If the description property is null, the record is not created", (done) => {
				ProductModel.create({name: "Any name"})
					.then(() => done("The record should not have been created"))
					.catch( () => done() );
			});

			it("If the description property is not string type, the record is not created", (done) => {
				ProductModel.create({name: "Any name", description: 8})
					.then(() => done("The record should not have been created"))
					.catch( () => done());
			});

			it("If the name property is not string type, the record is not created", (done) => {
				ProductModel.create({name: 8, description: "Any description"})
					.then(() => done("The record should not have been created"))
					.catch( () => done());
			});

			it("If the name property is not alphanumeric, the record is not created", (done) => {
				ProductModel.create({name: "@-/", description: "Any description"})
					.then(() => done("The record should not have been created"))
					.catch( () => done());
			});
		});

	});

	describe('Brand model', () => {
		beforeEach( async () => {
			await BrandModel.sync({force: true});
		});

		describe('Validations', () => {
			it("If the name property is null, the record is not created", (done) => {
				BrandModel.create({ logoUrl: "http://image.png" })
					.then( () => done("The record should not have been created"))
					.catch( () => done());
			});

			it("If the name property is not a string, the record is not created", (done) => {
				BrandModel.create({ name: 8, logoUrl: "http://image.png" })
					.then( () => done("The record should not have been created"))
					.catch( () => done());
			});

			it("If the name value is not an unique, the record is not created", (done) => {
				BrandModel.create({ name: "Any name", logoUrl: "http://image.png" })
					.then( () => {
						return BrandModel.create({ name: "Any name", logoUrl: "http://image.png" });
					})
					.then( () => done("The record should not have been created"))
					.catch( () => done());
			});

			it("If the logoUrl property is null, the record is not created", (done) => {
				BrandModel.create({ name: "Any name" })
					.then( () => done("The record should be created"))
					.catch( () => done());
			});

			it("If the logoUrl property is not an image url, the record should not be created", (done) => {
				BrandModel.create({ logoUrl: "http://image" })
					.then( () => done("The record should not have been created"))
					.catch( () => done());
			});

			it("If the logoUrl property is not an image url, the record should not be created", (done) => {
				BrandModel.create({ logoUrl: "image.png" })
					.then( () => done("The record should not have been created"))
					.catch( () => done());
			});

		});
	});

	describe( 'Discount model', () => {

		beforeEach( async () => {
			await DiscountModel.sync({force: true});
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
		});
	});

	describe( 'Perfume model', () => {

		beforeEach( async () => {
			await PerfumeModel.sync({force: true});
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

	describe( 'ProductImage model', () => {
		beforeEach( async () => {
			await ProductImageModel.sync({force: true});
		});

		describe( 'Validations', () => {
			it("If the url property is null, the record will not be created", (done) => {
				ProductImageModel.create({})
				.then( () => done("The record should not have been created"))
				.catch( () => done());
			});

			it("If the url property is not a valid image url, the record will not be created", (done) => {
				ProductImageModel.create({url: "Any value"})
				.then( () => done("The record should not have been created"))
				.catch( () => done());
			});

			it("If the url property is not a valid image url, the record will not be created", (done) => {
				ProductImageModel.create({url: 86})
				.then( () => done("The record should not have been created"))
				.catch( () => done());
			});
		});
	});


	describe( 'PerfumeSize model', () => {
		beforeEach( async () => {
			await PerfumeSizeModel.sync({force: true});
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

	describe( 'Review model', () => {
		beforeEach( async () => {
			await ReviewModel.sync({force: true});
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

		});
	});

	describe('User model', () => {

		beforeEach(async () => {
			await UserModel.sync({force: true});
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
		});
	});

	describe('Address model', () => {
		beforeEach(async () => {
			await AddressModel.sync({force: true});
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
		});
	});

	describe('Purchase model', () => {

		beforeEach(async () => {
			await PurchaseModel.sync({force: true});
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

});
