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
const { usersData } = require('../testData');

//Services
const UserService = require(path.resolve(process.cwd(), 'src', 'services', 'user.service.js'));

describe('Users Endpoints', () => {

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
				.post("/api/v1/users")
				.send(usersData[0])
				.expect(201)
		);
		it('Responds with the user data', () =>
			agent
				.post("/api/v1/users")
				.send(usersData[0])
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const user =  res.body.body;
					expect(user).toEqual(expect.any(Object));
					expect(Object.keys(user).sort()).toEqual(['id', 'firstName', 'lastName', 'email', 'password', 'wishList', 'shoppingCart', 'registrationDate'].sort());
					expect(user.id).toEqual(expect.any(Number));
					expect(user.firstName).toEqual(expect.any(String));
					expect(user.lastName).toEqual(expect.any(String));
					expect(user.email).toEqual(expect.any(String));
					expect(user.password).toEqual(expect.any(String));
					expect(user.registrationDate).toEqual(expect.any(String));
				})
		);
		it('If parameters are missing, responds with Error 400', () =>
			agent
				.post("/api/v1/users")
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
			await UserService.bulkAdd(usersData);
		});

		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/users")
				.expect(200)
		);
		it('Responds with all users data', () =>
			agent
				.get("/api/v1/users")
				.then( res => {

					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(Array.isArray(res.body.body)).toBeTruthy();

					res.body.body.forEach( (user) => {
						expect(user).toEqual(expect.any(Object));
						expect(Object.keys(user).sort()).toEqual(['id', 'firstName', 'lastName', 'email', 'password', 'wishList', 'shoppingCart', 'registrationDate'].sort());
						expect(user.id).toEqual(expect.any(Number));
						expect(user.firstName).toEqual(expect.any(String));
						expect(user.lastName).toEqual(expect.any(String));
						expect(user.email).toEqual(expect.any(String));
						expect(user.password).toEqual(expect.any(String));
						expect(user.registrationDate).toEqual(expect.any(String));
					});
				})
		);
	});

	describe('GET /:id', () => {
		beforeEach( async () => {
			await UserService.add(...Object.values(usersData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/users/1")
				.expect(200)
		);
		it('Responds with the user data that corresponds to the id', () =>
			agent
				.get("/api/v1/users/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const user =  res.body.body;
					expect(user).toEqual(expect.any(Object));
					expect(Object.keys(user).sort()).toEqual(['id', 'firstName', 'lastName', 'email', 'password', 'wishList', 'shoppingCart', 'registrationDate'].sort());
					expect(user.id).toEqual(expect.any(Number));
					expect(user.firstName).toEqual(expect.any(String));
					expect(user.lastName).toEqual(expect.any(String));
					expect(user.email).toEqual(expect.any(String));
					expect(user.password).toEqual(expect.any(String));
					expect(user.registrationDate).toEqual(expect.any(String));
				})
		);

		it('If the id does not correspond to any user, responds with Error 404', () =>
			agent
				.get("/api/v1/users/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.get("/api/v1/users/test")
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
			await UserService.add(...Object.values(usersData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.patch("/api/v1/users/1")
				.send({
					firstName: "New name",
				})
				.expect(200)
		);
		it('Update the user that correspond the id indicated and responds with the user data', () =>
			agent
				.patch("/api/v1/users/1")
				.send({
					firstName: "New name",
				})
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const user =  res.body.body;
					expect(user).toEqual(expect.any(Object));
					expect(Object.keys(user).sort()).toEqual(['id', 'firstName', 'lastName', 'email', 'password', 'wishList', 'shoppingCart', 'registrationDate'].sort());
					expect(user.id).toEqual(expect.any(Number));
					expect(user.firstName).toBe("New name");
					expect(user.lastName).toEqual(expect.any(String));
					expect(user.email).toEqual(expect.any(String));
					expect(user.password).toEqual(expect.any(String));
					expect(user.registrationDate).toEqual(expect.any(String));
				})
		);

		it('If the id does not correspond to any user, responds with Error 404', () =>
			agent
				.patch("/api/v1/users/62")
				.send({
					firstName: "New name",
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
				.patch("/api/v1/users/test")
				.send({
					firstName: "New name",
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
			await UserService.add(...Object.values(usersData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.delete("/api/v1/users/1")
				.expect(200)
		);
		it('Responds with 1', () =>
			agent
				.delete("/api/v1/users/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(res.body.body).toBe(1);
				})
		);

		it('If the id does not correspond to any user, responds with Error 404', () =>
			agent
				.delete("/api/v1/users/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.delete("/api/v1/users/test")
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);
	});
});
