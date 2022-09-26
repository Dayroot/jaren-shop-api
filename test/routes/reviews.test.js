const path = require('path');
const dotenv = require('dotenv');

dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));
const conn = require(path.resolve(process.cwd(), 'src', 'db', 'connectionDB.js'));

const session = require('supertest-session');
const app = require('./testServer');

const agent = session(app);

// Testing data
const { usersData, productsData, brandsData, reviewsData, ordersData } = require('../testData');

//Services
const UserService = require(path.resolve(process.cwd(), 'src', 'services', 'user.service.js'));
const BrandService = require(path.resolve(process.cwd(), 'src', 'services', 'brand.service.js'));
const ProductService = require(path.resolve(process.cwd(), 'src', 'services', 'product.service.js'));
const ReviewService = require(path.resolve(process.cwd(), 'src', 'services', 'review.service.js'));
const CategoryService = require(path.resolve(process.cwd(), 'src', 'services', 'category.service.js'));
const OrderService = require(path.resolve(process.cwd(), 'src', 'services', 'order.service.js'));


describe('Reviews Endpoints', () => {

	beforeEach( async () => {
		await migration();
		await UserService.bulkAdd(usersData);
		await BrandService.bulkAdd(brandsData);
		await CategoryService.add("perfumes");
		await ProductService.bulkAdd(productsData);
		await OrderService.bulkAdd(ordersData);
	});

	afterAll( async () => {
		await migration();
		conn.close();
	});

	describe('POST /', () => {
		it('Respond with a status code of 201', () =>
			agent
				.post("/api/v1/reviews")
				.send(reviewsData[0])
				.expect(201)
		);

		it('Responds with the review data', () =>
			agent
				.post("/api/v1/reviews")
				.send(reviewsData[0])
				.expect(201)
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const review =  res.body.body;
					expect(review).toBeTruthy();
					expect(Object.keys(review).sort()).toEqual(['id', 'productId', 'user', 'ref', 'rating', 'text', 'createdAt', 'updatedAt'].sort());
				})
		);
		it('If there is already a review for the indicated reference, it responds with an Error', async () => {

			const res1 = await agent.post("/api/v1/reviews").send(reviewsData[0]);
			expect(res1.statusCode).toBe(201);
			expect(res1.body.error).toBeNull();

			const res2 = await agent.post("/api/v1/reviews").send(reviewsData[0]);
			expect(res2.statusCode).toBe(500);
			expect(res2.body.error).toBeTruthy();

		});

		it('If parameters are missing, responds with Error 400', () =>
			agent
				.post("/api/v1/reviews")
				.send({})
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);
	});

	describe('GET /user/:userId', () => {

		beforeEach( async () => {
			await ReviewService.bulkAdd(reviewsData);
		});

		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/reviews/user/1")
				.expect(200)
		);
		it('Responds with all user 1 reviews data', () =>
			agent
				.get("/api/v1/reviews/user/1")
				.then( res => {

					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(Array.isArray(res.body.body)).toBeTruthy();
					expect(res.body.body.length).toBe(3);

					res.body.body.forEach( (review) => {
						expect(review).toBeTruthy();
						expect(Object.keys(review).sort()).toEqual(['id', 'productId', 'user', 'ref', 'rating', 'text', 'createdAt', 'updatedAt'].sort());
					});
				})
		);

		it('If the user id not exists, returns an empty array', () =>
			agent
				.get("/api/v1/reviews/user/8")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(res.body.error).toBeNull();
					expect(Array.isArray(res.body.body)).toBeTruthy();
					expect(res.body.body.length).toBe(0);
				})
		);
	});

	describe('GET /:id', () => {
		beforeEach( async () => {
			await ReviewService.add(...Object.values(reviewsData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/reviews/1")
				.expect(200)
		);
		it('Responds with the review data that corresponds to the id', () =>
			agent
				.get("/api/v1/reviews/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const review =  res.body.body;
					expect(review).toBeTruthy();
					expect(Object.keys(review).sort()).toEqual(['id', 'productId', 'user', 'ref', 'rating', 'text', 'createdAt', 'updatedAt'].sort());
				})
		);

		it('If the id does not correspond to any review, responds with Error 404', () =>
			agent
				.get("/api/v1/reviews/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.get("/api/v1/reviews/test")
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);
	});

	describe('PATCH /:id', () => {
		beforeEach( async () => {
			await ReviewService.add(...Object.values(reviewsData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.patch("/api/v1/reviews/1")
				.send({
					text: "updated text",
				})
				.expect(200)
		);
		it('Update the review that correspond the id indicated and responds with the review data', () =>
			agent
				.patch("/api/v1/reviews/1")
				.send({
					text: "updated text",
				})
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const review =  res.body.body;
					expect(review).toBeTruthy();
					expect(Object.keys(review).sort()).toEqual(['id', 'productId', 'user', 'ref', 'rating', 'text', 'createdAt', 'updatedAt'].sort());
					expect(review.text).toBe('updated text');
				})
		);

		it('If the id does not correspond to any review, responds with Error 404', () =>
			agent
				.patch("/api/v1/reviews/62")
				.send({
					text: "updated text",
				})
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.patch("/api/v1/reviews/test")
				.send({
					text: "updated text",
				})
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);
	});

	describe('DELETE /:id', () => {
		beforeEach( async () => {
			await ReviewService.add(...Object.values(reviewsData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.delete("/api/v1/reviews/1")
				.expect(200)
		);
		it('Responds with 1', () =>
			agent
				.delete("/api/v1/reviews/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(res.body.body).toBe(1);
				})
		);

		it('If the id does not correspond to any review, responds with Error 404', () =>
			agent
				.delete("/api/v1/reviews/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.delete("/api/v1/reviews/test")
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);
	});
});
