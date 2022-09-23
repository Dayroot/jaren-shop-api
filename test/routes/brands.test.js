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
const { brandsData } = require('../testData');

//Services
const BrandService = require(path.resolve(process.cwd(), 'src', 'services', 'brand.service.js'));

describe('Brands Endpoints', () => {

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
				.post("/api/v1/brands")
				.send(brandsData[0])
				.expect(201)
		);
		it('Responds with the brand data', () =>
			agent
				.post("/api/v1/brands")
				.send(brandsData[0])
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const brand =  res.body.body;
					expect(brand).toEqual(expect.any(Object));
					expect(Object.keys(brand).sort()).toEqual(['id', 'name', 'logoUrl'].sort());
					expect(brand.id).toEqual(expect.any(Number));
					expect(brand.name).toEqual(expect.any(String));
					expect(brand.logoUrl).toEqual(expect.any(String));
				})
		);
		it('If parameters are missing, responds with Error 400', () =>
			agent
				.post("/api/v1/brands")
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
			await BrandService.bulkAdd(brandsData);
		});

		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/brands")
				.expect(200)
		);
		it('Responds with all categories data', () =>
			agent
				.get("/api/v1/brands")
				.then( res => {

					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(Array.isArray(res.body.body)).toBeTruthy();

					res.body.body.forEach( (brand) => {
						expect(brand).toEqual(expect.any(Object));
						expect(Object.keys(brand).sort()).toEqual(['id', 'name', 'logoUrl'].sort());
						expect(brand.id).toEqual(expect.any(Number));
						expect(brand.name).toEqual(expect.any(String));
						expect(brand.logoUrl).toEqual(expect.any(String));
					});
				})
		);
	});

	describe('GET /:id', () => {
		beforeEach( async () => {
			await BrandService.add(...Object.values(brandsData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/brands/1")
				.expect(200)
		);
		it('Responds with the brand data that corresponds to the id', () =>
			agent
				.get("/api/v1/brands/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const brand =  res.body.body;
					expect(brand).toEqual(expect.any(Object));
					expect(Object.keys(brand).sort()).toEqual(['id', 'name', 'logoUrl'].sort());
					expect(brand.id).toEqual(expect.any(Number));
					expect(brand.name).toEqual(expect.any(String));
					expect(brand.logoUrl).toEqual(expect.any(String));
				})
		);

		it('If the id does not correspond to any brand, responds with Error 404', () =>
			agent
				.get("/api/v1/brands/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.get("/api/v1/brands/test")
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
			await BrandService.add(...Object.values(brandsData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.patch("/api/v1/brands/1")
				.send({
					name: "New name",
					logoUrl: "http://newlogo.png"
				})
				.expect(200)
		);
		it('Update the brand that correspond the id indicated and responds with the product data', () =>
			agent
				.patch("/api/v1/brands/1")
				.send({
					name: "New name",
					logoUrl: "http://newlogo.png"
				})
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const brand =  res.body.body;
					expect(brand).toEqual(expect.any(Object));
					expect(Object.keys(brand).sort()).toEqual(['id', 'name', 'logoUrl'].sort());
					expect(brand.id).toEqual(expect.any(Number));
					expect(brand.name).toBe('New name');
					expect(brand.logoUrl).toBe('http://newlogo.png');
				})
		);

		it('If the id does not correspond to any product, responds with Error 404', () =>
			agent
				.patch("/api/v1/brands/62")
				.send({
					name: "New name",
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
				.patch("/api/v1/brands/test")
				.send({
					name: "New name",
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
			await BrandService.add(...Object.values(brandsData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.delete("/api/v1/brands/1")
				.expect(200)
		);
		it('Responds with 1', () =>
			agent
				.delete("/api/v1/brands/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(res.body.body).toBe(1);
				})
		);

		it('If the id does not correspond to any brand, responds with Error 404', () =>
			agent
				.delete("/api/v1/brands/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.delete("/api/v1/brands/test")
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);
	});
});
