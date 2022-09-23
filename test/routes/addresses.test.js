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
const { addressesData, usersData } = require('../testData');

//Services
const AddressService = require(path.resolve(process.cwd(), 'src', 'services', 'address.service.js'));
const UserService = require(path.resolve(process.cwd(), 'src', 'services', 'user.service.js'));

describe('Addresses Endpoints', () => {

	beforeEach( async () => {
		await migration();
		await UserService.add(...Object.values(usersData[0]));
	});

	afterAll( async () => {
		await migration();
		conn.close();
	});

	describe('POST /', () => {
		it('Respond with a status code of 201', () =>
			agent
				.post("/api/v1/addresses")
				.send(addressesData[0])
				.expect(201)
		);
		it('Responds with the address data', () =>
			agent
				.post("/api/v1/addresses")
				.send(addressesData[0])
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const address =  res.body.body;
					expect(address).toEqual(expect.any(Object));
					expect(Object.keys(address).sort()).toEqual(['id', 'userId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
					expect(address.id).toEqual(expect.any(Number));
					expect(address.userId).toEqual(expect.any(Number));
					expect(address.state).toEqual(expect.any(String));
					expect(address.city).toEqual(expect.any(String));
					expect(address.streetAddress).toEqual(expect.any(String));
					expect(address.postalCode).toEqual(expect.any(String));
					expect(address.propertyType).toEqual(expect.any(String));
					expect(address.phoneNumber).toEqual(expect.any(String));
					expect(address.fullname).toEqual(expect.any(String));
				})
		);
		it('If parameters are missing, responds with Error 400', () =>
			agent
				.post("/api/v1/addresses")
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
			await AddressService.bulkAdd(addressesData);
		});

		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/addresses/user/1")
				.expect(200)
		);
		it('Responds with all addresses data', () =>
			agent
				.get("/api/v1/addresses/user/1")
				.then( res => {

					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(Array.isArray(res.body.body)).toBeTruthy();
					expect(res.body.body.length).toBe(2);

					res.body.body.forEach( (address) => {
						expect(address).toEqual(expect.any(Object));
						expect(Object.keys(address).sort()).toEqual(['id', 'userId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
						expect(address.id).toEqual(expect.any(Number));
						expect(address.userId).toEqual(expect.any(Number));
						expect(address.state).toEqual(expect.any(String));
						expect(address.city).toEqual(expect.any(String));
						expect(address.streetAddress).toEqual(expect.any(String));
						expect(address.postalCode).toEqual(expect.any(String));
						expect(address.propertyType).toEqual(expect.any(String));
						expect(address.phoneNumber).toEqual(expect.any(String));
						expect(address.fullname).toEqual(expect.any(String));
					});
				})
		);

		it('If the user id not exists, returns an empty array', () =>
			agent
				.get("/api/v1/addresses/user/8")
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
			await AddressService.add(...Object.values(addressesData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/addresses/1")
				.expect(200)
		);
		it('Responds with the address data that corresponds to the id', () =>
			agent
				.get("/api/v1/addresses/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const address =  res.body.body;
					expect(address).toEqual(expect.any(Object));
					expect(Object.keys(address).sort()).toEqual(['id', 'userId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
					expect(address.id).toEqual(expect.any(Number));
					expect(address.userId).toEqual(expect.any(Number));
					expect(address.state).toEqual(expect.any(String));
					expect(address.city).toEqual(expect.any(String));
					expect(address.streetAddress).toEqual(expect.any(String));
					expect(address.postalCode).toEqual(expect.any(String));
					expect(address.propertyType).toEqual(expect.any(String));
					expect(address.phoneNumber).toEqual(expect.any(String));
					expect(address.fullname).toEqual(expect.any(String));
				})
		);

		it('If the id does not correspond to any address, responds with Error 404', () =>
			agent
				.get("/api/v1/addresses/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.get("/api/v1/addresses/test")
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
			await AddressService.add(...Object.values(addressesData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.patch("/api/v1/addresses/1")
				.send({
					state: "New state",
				})
				.expect(200)
		);
		it('Update the address that correspond the id indicated and responds with the address data', () =>
			agent
				.patch("/api/v1/addresses/1")
				.send({
					state: "New state",
				})
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const address =  res.body.body;
					expect(address).toEqual(expect.any(Object));
					expect(Object.keys(address).sort()).toEqual(['id', 'userId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
					expect(address.id).toEqual(expect.any(Number));
					expect(address.userId).toEqual(expect.any(Number));
					expect(address.state).toBe('New state');
					expect(address.city).toEqual(expect.any(String));
					expect(address.streetAddress).toEqual(expect.any(String));
					expect(address.postalCode).toEqual(expect.any(String));
					expect(address.propertyType).toEqual(expect.any(String));
					expect(address.phoneNumber).toEqual(expect.any(String));
					expect(address.fullname).toEqual(expect.any(String));
				})
		);

		it('If the id does not correspond to any address, responds with Error 404', () =>
			agent
				.patch("/api/v1/addresses/62")
				.send({
					state: "New state",
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
				.patch("/api/v1/addresses/test")
				.send({
					state: "New state",
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
			await AddressService.add(...Object.values(addressesData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.delete("/api/v1/addresses/1")
				.expect(200)
		);
		it('Responds with 1', () =>
			agent
				.delete("/api/v1/addresses/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(res.body.body).toBe(1);
				})
		);

		it('If the id does not correspond to any address, responds with Error 404', () =>
			agent
				.delete("/api/v1/addresses/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.delete("/api/v1/addresses/test")
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);
	});
});
