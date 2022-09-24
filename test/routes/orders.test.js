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
const { ordersData, ordersData2, usersData, productsData, brandsData } = require('../testData');

//Services
const UserService = require(path.resolve(process.cwd(), 'src', 'services', 'user.service.js'));
const BrandService = require(path.resolve(process.cwd(), 'src', 'services', 'brand.service.js'));
const ProductService = require(path.resolve(process.cwd(), 'src', 'services', 'product.service.js'));
const OrderService = require(path.resolve(process.cwd(), 'src', 'services', 'order.service.js'));
const CategoryService = require(path.resolve(process.cwd(), 'src', 'services', 'category.service.js'));

describe('Orders Endpoints', () => {

	beforeEach( async () => {
		await migration();
		await UserService.add(...Object.values(usersData[0]));
		await BrandService.bulkAdd(brandsData);
		await CategoryService.add('perfumes');
		await ProductService.bulkAdd(productsData);
	});

	afterAll( async () => {
		await migration();
		conn.close();
	});

	describe('POST /', () => {
		it('Respond with a status code of 201', () =>
			agent
				.post("/api/v1/orders")
				.send(ordersData2[0])
				.expect(201)
		);
		it('Responds with the order data', () =>
			agent
				.post("/api/v1/orders")
				.send(ordersData2[0])
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const order =  res.body.body;

					expect(order).toBeTruthy();
					expect(Object.keys(order).sort()).toEqual(['id', 'userId','orderDate', 'statusChangeDate', 'status', 'details', 'address'].sort());
					expect(order.id).toEqual(expect.any(Number));
					expect(order.userId).toEqual(expect.any(Number));
					expect(order.orderDate).toEqual(expect.any(String));
					expect(order.statusChangeDate).toEqual(expect.any(String));
					expect(order.status).toEqual(expect.any(String));
					expect(Array.isArray(order.details)).toBeTruthy();
					expect(Object.keys(order.details[0]).sort()).toEqual(['productId', 'ref',  'quantity', 'price', 'SKU', 'overview', 'image'].sort());
					expect(order.address).toEqual(expect.any(Object));
					expect(Object.keys(order.address).sort()).toEqual(['addressId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
				})
		);
		it('If parameters are missing, responds with Error 400', () =>
			agent
				.post("/api/v1/orders")
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
			await OrderService.bulkAdd(ordersData2);
		});

		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/orders/user/1")
				.expect(200)
		);
		it('Responds with all orders data', () =>
			agent
				.get("/api/v1/orders/user/1")
				.then( res => {

					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(Array.isArray(res.body.body)).toBeTruthy();
					expect(res.body.body.length).toBe(2);

					res.body.body.forEach( (order) => {
						expect(order).toEqual(expect.any(Object));
						expect(Object.keys(order).sort()).toEqual(['id', 'userId','orderDate', 'statusChangeDate', 'status', 'details', 'address'].sort());
						expect(order.id).toEqual(expect.any(Number));
						expect(order.userId).toEqual(expect.any(Number));
						expect(order.orderDate).toEqual(expect.any(String));
						expect(order.statusChangeDate).toEqual(expect.any(String));
						expect(order.status).toEqual(expect.any(String));
						expect(Array.isArray(order.details)).toBeTruthy();
						expect(Object.keys(order.details[0]).sort()).toEqual(['productId', 'ref',  'quantity', 'price', 'SKU', 'overview', 'image'].sort());
						expect(order.address).toEqual(expect.any(Object));
						expect(Object.keys(order.address).sort()).toEqual(['addressId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
					});
				})
		);

		it('If the user id not exists, returns an empty array', () =>
			agent
				.get("/api/v1/orders/user/8")
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
			await OrderService.add(...Object.values(ordersData2[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/orders/1")
				.expect(200)
		);
		it('Responds with the order data that corresponds to the id', () =>
			agent
				.get("/api/v1/orders/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const order =  res.body.body;
					expect(order).toEqual(expect.any(Object));
					expect(Object.keys(order).sort()).toEqual(['id', 'userId','orderDate', 'statusChangeDate', 'status', 'details', 'address'].sort());
					expect(order.id).toEqual(expect.any(Number));
					expect(order.userId).toEqual(expect.any(Number));
					expect(order.orderDate).toEqual(expect.any(String));
					expect(order.statusChangeDate).toEqual(expect.any(String));
					expect(order.status).toEqual(expect.any(String));
					expect(Array.isArray(order.details)).toBeTruthy();
					expect(Object.keys(order.details[0]).sort()).toEqual(['productId', 'ref',  'quantity', 'price', 'SKU', 'overview', 'image'].sort());
					expect(order.address).toEqual(expect.any(Object));
					expect(Object.keys(order.address).sort()).toEqual(['addressId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
				})
		);

		it('If the id does not correspond to any order, responds with Error 404', () =>
			agent
				.get("/api/v1/orders/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.get("/api/v1/orders/test")
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
			await OrderService.add(...Object.values(ordersData2[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.patch("/api/v1/orders/1")
				.send({
					status: "delivered",
				})
				.expect(200)
		);
		it('Update the order that correspond the id indicated and responds with the order data', () =>
			agent
				.patch("/api/v1/orders/1")
				.send({
					status: "delivered",
				})
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const order =  res.body.body;
					expect(order).toEqual(expect.any(Object));
					expect(Object.keys(order).sort()).toEqual(['id', 'userId','orderDate', 'statusChangeDate', 'status', 'details', 'address'].sort());
					expect(order.id).toEqual(expect.any(Number));
					expect(order.userId).toEqual(expect.any(Number));
					expect(order.orderDate).toEqual(expect.any(String));
					expect(order.statusChangeDate).toEqual(expect.any(String));
					expect(order.status).toBe('delivered');
					expect(Array.isArray(order.details)).toBeTruthy();
					expect(Object.keys(order.details[0]).sort()).toEqual(['productId', 'ref',  'quantity', 'price', 'SKU', 'overview', 'image'].sort());
					expect(order.address).toEqual(expect.any(Object));
					expect(Object.keys(order.address).sort()).toEqual(['addressId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
				})
		);

		it('If the id does not correspond to any order, responds with Error 404', () =>
			agent
				.patch("/api/v1/orders/62")
				.send({
					status: "delivered",
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
				.patch("/api/v1/orders/test")
				.send({
					status: "delivered",
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
			await OrderService.add(...Object.values(ordersData2[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.delete("/api/v1/orders/1")
				.expect(200)
		);
		it('Responds with 1', () =>
			agent
				.delete("/api/v1/orders/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(res.body.body).toBe(1);
				})
		);

		it('If the id does not correspond to any order, responds with Error 404', () =>
			agent
				.delete("/api/v1/orders/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.delete("/api/v1/orders/test")
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);
	});
});
