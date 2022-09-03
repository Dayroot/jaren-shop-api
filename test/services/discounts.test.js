const path = require('path');
const dotenv = require('dotenv');

//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));

//Models
const DiscountModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'discount.model.js'));

//Services
const DiscountService = require(path.resolve(process.cwd(), 'src', 'services', 'discount.service.js'));

// Testing data
const discountsData = [
	{
		value: 30,
		finishDate: "2022-09-02T16:17:01.559Z",
		isEnabled: true,
	},
	{
		value: 40,
		finishDate: "2022-09-02T16:17:01.559Z",
		isEnabled: true,
	},
	{
		value: 60,
		finishDate: "2022-09-02T16:17:01.559Z",
		isEnabled: true,
	}
];


describe('Discount service', () => {

	beforeEach( async () => {
		await migration();
	});

	afterAll( async () => {
		await migration();
	});

	it('The add method should add a new record in the Discounts table of the database', async () => {
		const discount = await DiscountService.add(...Object.values(discountsData[0]));
		expect( discount instanceof DiscountModel).toBeTruthy();
		expect( discount.value ).toBe(discountsData[0].value);
	});

	it('The bulkAdd method should add multiple Discounts records to the database', async () => {
		const discounts = await DiscountService.bulkAdd(discountsData);
		expect(Array.isArray(discounts)).toBeTruthy();
		discounts.forEach( (discount, i) => {
			expect( discount instanceof DiscountModel).toBeTruthy();
			expect( discount.value ).toBe(discountsData[i].value);
		});
	});

	it('The find method must return all discounts registered in the database',
		async () => {

			const allDiscountsCreated = await DiscountService.bulkAdd(discountsData);
			const discountsFinded = await DiscountService.find();
			discountsFinded.forEach( (discount, i) => {
				expect( discount instanceof DiscountModel).toBeTruthy();
				expect(discount.value).toBe(allDiscountsCreated[i].value);
			});
		}
	);

	it('The findOne method must return the discount with the indicated id',
		async () => {
			const discountCreated = await DiscountService.add(...Object.values(discountsData[0]));
			const discountFinded = await DiscountService.findOne(discountCreated.id);
			expect( discountFinded instanceof DiscountModel).toBeTruthy();
			expect(discountFinded.id).toEqual(discountCreated.id);
			expect(discountFinded.value).toEqual(discountCreated.value);
		}
	);

	it('The update method should return an array with a value of 1 if the discount has been updated',
		async () => {
			const discount = await DiscountService.add(...Object.values(discountsData[0]));
			const numberDiscountsUpdated = await DiscountService.update(discount.id, {value:96, isEnabled: false});
			const discountUpdated = await DiscountService.findOne(discount.id);

			expect(numberDiscountsUpdated).toEqual([1]);
			expect(discountUpdated.value).toBe(96);
			expect(discountUpdated.isEnabled).toBeFalsy();
		}
	);

	it('The delete method should return a value of 1 if the discount has been deleted',
		async () => {
			const discount = await DiscountService.add(...Object.values(discountsData[0]));
			const numberDiscountsDelete = await DiscountService.delete(discount.id);
			const discountFinded = await DiscountService.findOne(discount.id);

			expect(numberDiscountsDelete).toBe(1);
			expect(discountFinded).toBeNull();
		}
	);
});
