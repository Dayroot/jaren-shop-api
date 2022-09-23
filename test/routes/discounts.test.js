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

//Test data
const { discountsData } = require('../testData');

//Services
const DiscountService = require(path.resolve(process.cwd(), 'src', 'services', 'discount.service.js'));

describe('Discounts Endpoints', () => {

	beforeEach( async () => {
		await migration();
	});

	afterAll( async () => {
		await migration();
		conn.close();
	});

	describe('POST /', () => {
		it('Respond with a status code of 201', () =>
			agent
				.post("/api/v1/discounts")
				.send(discountsData[0])
				.expect(201)
		);
		it('Responds with the discount data', () =>
			agent
				.post("/api/v1/discounts")
				.send(discountsData[0])
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const discount =  res.body.body;
					expect(discount).toEqual(expect.any(Object));
					expect(Object.keys(discount).sort()).toEqual(['id', 'value', 'startDate', 'finishDate', 'isEnabled'].sort());
					expect(discount.id).toEqual(expect.any(Number));
					expect(discount.startDate).toEqual(expect.any(String));
					expect(discount.finishDate).toEqual(expect.any(String));
					expect(discount.isEnabled).toEqual(expect.any(Boolean));
				})
		);
		it('If parameters are missing, responds with Error 400', () =>
			agent
				.post("/api/v1/discounts")
				.send({})
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);
	});

	describe('GET /', () => {

		beforeEach( async () => {
			await DiscountService.bulkAdd(discountsData);
		});

		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/discounts")
				.expect(200)
		);
		it('Responds with all discounts data', () =>
			agent
				.get("/api/v1/discounts")
				.then( res => {

					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(Array.isArray(res.body.body)).toBeTruthy();

					res.body.body.forEach( (discount) => {
						expect(discount).toEqual(expect.any(Object));
						expect(Object.keys(discount).sort()).toEqual(['id', 'value', 'startDate', 'finishDate', 'isEnabled'].sort());
						expect(discount.id).toEqual(expect.any(Number));
						expect(discount.startDate).toEqual(expect.any(String));
						expect(discount.finishDate).toEqual(expect.any(String));
						expect(discount.isEnabled).toEqual(expect.any(Boolean));
					});
				})
		);
	});

	describe('GET /:id', () => {
		beforeEach( async () => {
			await DiscountService.add(...Object.values(discountsData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/discounts/1")
				.expect(200)
		);
		it('Responds with the discount data that corresponds to the id', () =>
			agent
				.get("/api/v1/discounts/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const discount =  res.body.body;
					expect(discount).toEqual(expect.any(Object));
					expect(Object.keys(discount).sort()).toEqual(['id', 'value', 'startDate', 'finishDate', 'isEnabled'].sort());
					expect(discount.id).toEqual(expect.any(Number));
					expect(discount.startDate).toEqual(expect.any(String));
					expect(discount.finishDate).toEqual(expect.any(String));
					expect(discount.isEnabled).toEqual(expect.any(Boolean));
				})
		);

		it('If the id does not correspond to any discount, responds with Error 404', () =>
			agent
				.get("/api/v1/discounts/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.get("/api/v1/discounts/test")
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
			await DiscountService.add(...Object.values(discountsData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.patch("/api/v1/discounts/1")
				.send({
					value: 85,
				})
				.expect(200)
		);
		it('Update the discount that correspond the id indicated and responds with the discount data', () =>
			agent
				.patch("/api/v1/discounts/1")
				.send({
					value: 85,
				})
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const discount =  res.body.body;
					expect(discount).toEqual(expect.any(Object));
					expect(Object.keys(discount).sort()).toEqual(['id', 'value', 'startDate', 'finishDate', 'isEnabled'].sort());
					expect(discount.value).toEqual(85);
				})
		);

		it('If the id does not correspond to any discount, responds with Error 404', () =>
			agent
				.patch("/api/v1/discounts/62")
				.send({
					value: 85,
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
				.patch("/api/v1/discounts/test")
				.send({
					value: 85,
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
			await DiscountService.add(...Object.values(discountsData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.delete("/api/v1/discounts/1")
				.expect(200)
		);
		it('Responds with 1', () =>
			agent
				.delete("/api/v1/discounts/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(res.body.body).toBe(1);
				})
		);

		it('If the id does not correspond to any discount, responds with Error 404', () =>
			agent
				.delete("/api/v1/discounts/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.delete("/api/v1/discounts/test")
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);
	});
});
