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
const { categoriesData } = require('../testData');

//Services
const CategoryService = require(path.resolve(process.cwd(), 'src', 'services', 'category.service.js'));

describe('Categories Endpoints', () => {

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
				.post("/api/v1/categories")
				.send(categoriesData[0])
				.expect(201)
		);
		it('Responds with the category data', () =>
			agent
				.post("/api/v1/categories")
				.send(categoriesData[0])
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const category =  res.body.body;
					expect(category).toEqual(expect.any(Object));
					expect(Object.keys(category).sort()).toEqual(['id', 'name'].sort());
					expect(category.id).toEqual(expect.any(Number));
					expect(category.name).toEqual(expect.any(String));
				})
		);
		it('If parameters are missing, responds with Error 400', () =>
			agent
				.post("/api/v1/categories")
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
			await CategoryService.bulkAdd(categoriesData);
		});

		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/categories")
				.expect(200)
		);
		it('Responds with all categories data', () =>
			agent
				.get("/api/v1/categories")
				.then( res => {

					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(Array.isArray(res.body.body)).toBeTruthy();

					res.body.body.forEach( (category) => {
						expect(category).toEqual(expect.any(Object));
						expect(Object.keys(category).sort()).toEqual(['id', 'name'].sort());
						expect(category.id).toEqual(expect.any(Number));
						expect(category.name).toEqual(expect.any(String));
					});
				})
		);
	});

	describe('GET /:id', () => {
		beforeEach( async () => {
			await CategoryService.add(...Object.values(categoriesData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/categories/1")
				.expect(200)
		);
		it('Responds with the category data that corresponds to the id', () =>
			agent
				.get("/api/v1/categories/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const category =  res.body.body;
					expect(category).toEqual(expect.any(Object));
					expect(Object.keys(category).sort()).toEqual(['id', 'name'].sort());
					expect(category.id).toEqual(expect.any(Number));
					expect(category.name).toEqual(expect.any(String));
				})
		);

		it('If the id does not correspond to any category, responds with Error 404', () =>
			agent
				.get("/api/v1/categories/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.get("/api/v1/categories/test")
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
			await CategoryService.add(...Object.values(categoriesData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.patch("/api/v1/categories/1")
				.send({
					name: "New name",
				})
				.expect(200)
		);
		it('Update the category that correspond the id indicated and responds with the category data', () =>
			agent
				.patch("/api/v1/categories/1")
				.send({
					name: "New name",
				})
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const category =  res.body.body;
					expect(category).toEqual(expect.any(Object));
					expect(Object.keys(category).sort()).toEqual(['id', 'name'].sort());
					expect(category.id).toEqual(expect.any(Number));
					expect(category.name).toBe('New name');
				})
		);

		it('If the id does not correspond to any category, responds with Error 404', () =>
			agent
				.patch("/api/v1/categories/62")
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
				.patch("/api/v1/categories/test")
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
			await CategoryService.add(...Object.values(categoriesData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.delete("/api/v1/categories/1")
				.expect(200)
		);
		it('Responds with 1', () =>
			agent
				.delete("/api/v1/categories/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(res.body.body).toBe(1);
				})
		);

		it('If the id does not correspond to any category, responds with Error 404', () =>
			agent
				.delete("/api/v1/categories/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.delete("/api/v1/categories/test")
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);
	});
});
