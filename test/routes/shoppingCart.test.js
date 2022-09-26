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
const { usersData, productsData, brandsData, shoppingProducts } = require('../testData');

//Services
const ShoppingCartService = require(path.resolve(process.cwd(), 'src', 'services', 'shoppingCart.service.js'));
const UserService = require(path.resolve(process.cwd(), 'src', 'services', 'user.service.js'));
const BrandService = require(path.resolve(process.cwd(), 'src', 'services', 'brand.service.js'));
const ProductService = require(path.resolve(process.cwd(), 'src', 'services', 'product.service.js'));
const CategoryService = require(path.resolve(process.cwd(), 'src', 'services', 'category.service.js'));

describe('ShoppingCart Endpoints', () => {

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

	describe('POST /:shoppingCartId', () => {
		it('Respond with a status code of 201', () =>
			agent
				.post("/api/v1/shoppingCart/1")
				.send(shoppingProducts[0])
				.expect(201)
		);
		it('Responds with the shoppingCart data', () =>
			agent
				.post("/api/v1/shoppingCart/1")
				.send(shoppingProducts[0])
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const shoppingCart =  res.body.body;
					expect(shoppingCart).toBeTruthy();
					expect(Object.keys(shoppingCart).sort()).toEqual(['id', 'userId', 'items'].sort());
					expect(shoppingCart.id).toEqual(expect.any(Number));
					expect(shoppingCart.items).toEqual(expect.any(Array));
					expect(shoppingCart.items.length).toBe(1);
					shoppingCart.items.forEach( item => {
						expect(Object.keys(item).sort()).toEqual(['ref', 'overview', 'image', 'price', 'SKU', 'productId', 'quantity'].sort());
						expect(item.quantity).toBe(1);
					});
				})
		);

		it('If the item had already been included in the cart, the quantity must be increased by 1 unit. Responds with the shoppingCart data', async () => {

			const res1 =  await agent.post("/api/v1/shoppingCart/1").send(shoppingProducts[0])
			expect(res1.statusCode).toBe(201);
			expect(res1.body.body.items[0].quantity).toBe(1);

			const res2 =  await agent.post("/api/v1/shoppingCart/1").send(shoppingProducts[0])
			expect(res2.statusCode).toBe(201);
			expect(res2.body.body.items[0].quantity).toBe(2);

		});

		it('If parameters are missing, responds with Error 400', () =>
			agent
				.post("/api/v1/shoppingCart/1")
				.send({})
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);

		it('If the id does not correspond to any shoppingCart, responds with Error 404', () =>
			agent
				.post("/api/v1/shoppingCart/82")
				.send(shoppingProducts[0])
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.post("/api/v1/shoppingCart/test")
				.send(shoppingProducts[0])
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);
	});

	describe('GET /:shoppingCartId', () => {
		beforeEach( async () => {
			await ShoppingCartService.addProduct(...Object.values(shoppingProducts[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/shoppingCart/1")
				.expect(200)
		);
		it('Responds with the shoppingCart data that corresponds to the id', () =>
			agent
				.get("/api/v1/shoppingCart/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const shoppingCart =  res.body.body;
					expect(shoppingCart).toBeTruthy();
					expect(Object.keys(shoppingCart).sort()).toEqual(['id', 'userId', 'items'].sort());
					expect(shoppingCart.id).toEqual(expect.any(Number));
					expect(shoppingCart.items).toEqual(expect.any(Array));
					expect(shoppingCart.items.length).toBe(1);
					shoppingCart.items.forEach( item => {
						expect(Object.keys(item).sort()).toEqual(['ref', 'overview', 'image', 'price', 'SKU', 'productId', 'quantity'].sort());
					});
				})
		);

		it('If the id does not correspond to any shoppingCart, responds with Error 404', () =>
			agent
				.get("/api/v1/shoppingCart/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.get("/api/v1/shoppingCart/test")
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);
	});

	describe('PATCH /:shoppingCartId/:ref', () => {

		beforeEach( async () => {
			await ShoppingCartService.addProduct(...Object.values(shoppingProducts[0]));
		});

		it('Update the cart item and respond with the shopping cart data', () =>
			agent
				.patch("/api/v1/shoppingCart/1/1")
				.send({
					quantity: 156,
				})
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const shoppingCart =  res.body.body;
					expect(shoppingCart).toBeTruthy();
					expect(Object.keys(shoppingCart).sort()).toEqual(['id', 'userId', 'items'].sort());
					expect(shoppingCart.id).toEqual(expect.any(Number));
					expect(shoppingCart.items).toEqual(expect.any(Array));
					expect(shoppingCart.items.length).toBe(1);
					shoppingCart.items.forEach( item => {
						expect(Object.keys(item).sort()).toEqual(['ref', 'overview', 'image', 'price', 'SKU', 'productId', 'quantity'].sort());
						expect(item.quantity).toBe(156);
					});
				})
		);

		it('If the id does not correspond to any shopping cart, responds with Error 404', () =>
			agent
				.patch("/api/v1/shoppingCart/82/1")
				.send({
					quantity: 156,
				})
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the id does not correspond to any item, responds with Error 404', () =>
			agent
				.patch("/api/v1/shoppingCart/1/82")
				.send({
					quantity: 156,
				})
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the shopping cart id is not an integer, responds with Error 400', () =>
			agent
				.patch("/api/v1/shoppingCart/test/1")
				.send({
					quantity: 156,
				})
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the item id is not an integer, responds with Error 400', () =>
			agent
				.patch("/api/v1/shoppingCart/1/test")
				.send({
					quantity: 156,
				})
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

	});

	describe('DELETE /:shoppingCartId/:ref', () => {
		beforeEach( async () => {
			await ShoppingCartService.addProduct(...Object.values(shoppingProducts[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.delete("/api/v1/shoppingCart/1/1")
				.expect(200)
		);
		it('Delete the item with 1 id and response with the shopping cart data', () =>
			agent
				.delete("/api/v1/shoppingCart/1/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const shoppingCart = res.body.body;
					expect(shoppingCart).toBeTruthy();
					expect(shoppingCart.items.length).toBe(0);
				})
		);

		it('If the id does not correspond to any shopping cart, responds with Error 404', () =>
			agent
				.delete("/api/v1/shoppingCart/62/1")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the id does not correspond to any item, responds with Error 404', () =>
			agent
				.delete("/api/v1/shoppingCart/1/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the shopping cart id is not an integer, responds with Error 400', () =>
			agent
				.delete("/api/v1/shoppingCart/test/1")
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the item id is not an integer, responds with Error 400', () =>
			agent
				.delete("/api/v1/shoppingCart/1/test")
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);
	});
});
