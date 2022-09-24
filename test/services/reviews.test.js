const path = require('path');
const dotenv = require('dotenv');


dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));
const conn = require(path.resolve(process.cwd(), 'src', 'db', 'connectionDB.js'));

//Service
const UserService = require(path.resolve(process.cwd(), 'src', 'services', 'user.service.js'));
const BrandService = require(path.resolve(process.cwd(), 'src', 'services', 'brand.service.js'));
const ProductService = require(path.resolve(process.cwd(), 'src', 'services', 'product.service.js'));
const ReviewService = require(path.resolve(process.cwd(), 'src', 'services', 'review.service.js'));
const CategoryService = require(path.resolve(process.cwd(), 'src', 'services', 'category.service.js'));
const OderService = require(path.resolve(process.cwd(), 'src', 'services', 'order.service.js'));

// Testing data
const { usersData, productsData, brandsData, reviewsData, ordersData } = require('../testData');

describe('Review service', () => {

	beforeEach( async () => {
		await migration();
		await UserService.bulkAdd(usersData);
		await BrandService.bulkAdd(brandsData);
		await CategoryService.add("perfumes");
		await ProductService.bulkAdd(productsData);
		await OderService.bulkAdd(ordersData);
	});

	afterAll( async () => {
		await migration();
		conn.close();
	});

	it('The "add" method registered a new review in the database', async () => {
		const review = await ReviewService.add(...Object.values(reviewsData[0]));

		expect(typeof review).toBe('object');
		expect(Object.keys(review).sort()).toEqual(['id', 'productId', 'user', 'ref', 'rating', 'text', 'createdAt', 'updatedAt'].sort());
		expect(review.productId).toBe(reviewsData[0].productId);
		expect(review.user.id).toBe(reviewsData[0].userId);
		expect(review.rating).toBe(reviewsData[0].rating);
		expect(review.text).toBe(reviewsData[0].text);
	});

	it('If you try to add a review to a ref that already has it, an error will be thrown', async () => {
		expect.assertions(1);
		try {
			await ReviewService.add(...Object.values(reviewsData[0]));
			await ReviewService.add(...Object.values(reviewsData[0]));
		} catch (error) {
			expect(error instanceof Error).toBeTruthy();
		}
	});

	it('The "bulkAdd" method registered multiple reviews in the database', async () => {
		const reviews = await ReviewService.bulkAdd(reviewsData.slice(0, 2));

		expect(Array.isArray(reviews)).toBeTruthy();
		reviews.forEach( (review, i) => {
			expect(typeof review).toBe('object');
			expect(Object.keys(review).sort()).toEqual(['id', 'productId', 'user', 'ref', 'rating', 'text', 'createdAt', 'updatedAt'].sort());
			expect(review.productId).toBe(reviewsData[i].productId);
			expect(review.user.id).toBe(reviewsData[i].userId);
			expect(review.rating).toEqual(expect.any(Number));
			expect(review.text).toEqual(expect.any(String));
		});
	});

	it('The "findOne" method return the review that corresponds to the id', async () => {
		const reviewCreated = await ReviewService.add(...Object.values(reviewsData[0]));
		const review = await ReviewService.findOne(reviewCreated.id);

		expect(typeof review).toBe('object');
		expect(Object.keys(review).sort()).toEqual(['id', 'productId', 'user', 'ref', 'rating', 'text', 'createdAt', 'updatedAt'].sort());
		expect(review.productId).toBe(reviewsData[0].productId);
		expect(review.user.id).toBe(reviewsData[0].userId);
		expect(review.rating).toBe(reviewsData[0].rating);
		expect(review.text).toBe(reviewsData[0].text);
	});

	it('The "find" method returns the records of all reviews in the database', async () => {
		await ReviewService.bulkAdd(reviewsData.slice(0, 2));
		const reviews = await ReviewService.find();

		expect(Array.isArray(reviews)).toBeTruthy();
		reviews.forEach( (review, i) => {
			expect(typeof review).toBe('object');
			expect(Object.keys(review).sort()).toEqual(['id', 'productId', 'user', 'ref', 'rating', 'text', 'createdAt', 'updatedAt'].sort());
			expect(review.productId).toBe(reviewsData[i].productId);
			expect(review.user.id).toBe(reviewsData[i].userId);
			expect(review.rating).toBe(reviewsData[i].rating);
			expect(review.text).toBe(reviewsData[i].text);
		});
	});

	it('The "update" method update the review data in the database', async () => {
		const reviewCreated = await ReviewService.add(...Object.values(reviewsData[0]));
		const review = await ReviewService.update(reviewCreated.id, {
			rating: 2,
			text: 'text updated',
		})

		expect(typeof review).toBe('object');
		expect(Object.keys(review).sort()).toEqual(['id', 'productId', 'user', 'ref', 'rating', 'text', 'createdAt', 'updatedAt'].sort());
		expect(review.rating).toBe(2);
		expect(review.text).toBe('text updated');
	});

	it('The "delete" method delete the review data in the database', async () => {
		const reviewCreated = await ReviewService.add(...Object.values(reviewsData[0]));
		const result = await ReviewService.delete(reviewCreated.id);

		expect(result).toBe(1);
	});

});
