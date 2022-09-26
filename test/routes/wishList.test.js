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
const { usersData, productsData, brandsData, wishProducts } = require('../testData');

//Services
const WishListService = require(path.resolve(process.cwd(), 'src', 'services', 'wishList.service.js'));
const UserService = require(path.resolve(process.cwd(), 'src', 'services', 'user.service.js'));
const BrandService = require(path.resolve(process.cwd(), 'src', 'services', 'brand.service.js'));
const ProductService = require(path.resolve(process.cwd(), 'src', 'services', 'product.service.js'));
const CategoryService = require(path.resolve(process.cwd(), 'src', 'services', 'category.service.js'));

describe('WishList Endpoints', () => {

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

	describe('POST /:wishListId', () => {
		it('Respond with a status code of 201', () =>
			agent
				.post("/api/v1/wishList/1")
				.send(wishProducts[0])
				.expect(201)
		);
		it('Responds with the wishList data', () =>
			agent
				.post("/api/v1/wishList/1")
				.send(wishProducts[0])
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const wishList =  res.body.body;
					expect(wishList).toBeTruthy();
					expect(Object.keys(wishList).sort()).toEqual(['id', 'userId', 'items'].sort());
					expect(wishList.id).toEqual(expect.any(Number));
					expect(wishList.items).toEqual(expect.any(Array));
					expect(wishList.items.length).toBe(1);
					wishList.items.forEach( item => {
						expect(Object.keys(item).sort()).toEqual(['ref', 'overview', 'image', 'price', 'SKU', 'productId'].sort());
					});
				})
		);
		it('If parameters are missing, responds with Error 400', () =>
			agent
				.post("/api/v1/wishList/1")
				.send({})
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);

		it('If a product that was already included is added again, responds with Error 409', async () => {

			const res1 = await agent.post("/api/v1/wishList/1").send(wishProducts[0]);

			expect(res1.statusCode).toBe(201);
			expect(Object.keys(res1.body)).toEqual(['error', 'body']);
			const wishList =  res1.body.body;
			expect(wishList).toBeTruthy();
			expect(Object.keys(wishList).sort()).toEqual(['id', 'userId', 'items'].sort());
			expect(wishList.id).toEqual(expect.any(Number));
			expect(wishList.items).toEqual(expect.any(Array));
			expect(wishList.items.length).toBe(1);
			wishList.items.forEach( item => {
				expect(Object.keys(item).sort()).toEqual(['ref', 'overview', 'image', 'price', 'SKU', 'productId'].sort());
			});

			const res2 = await agent.post("/api/v1/wishList/1").send(wishProducts[0]);

			expect(res2.statusCode).toBe(409);
			const {error, body} = res2.body;
			expect(typeof error).toBe('string');
			expect(body === null).toBeTruthy();
		});

		it('If the id does not correspond to any wishList, responds with Error 404', () =>
			agent
				.post("/api/v1/wishList/82")
				.send(wishProducts[0])
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.post("/api/v1/wishList/test")
				.send(wishProducts[0])
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);
	});

	describe('GET /:wishListId', () => {
		beforeEach( async () => {
			await WishListService.addProduct(...Object.values(wishProducts[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/wishList/1")
				.expect(200)
		);
		it('Responds with the wishList data that corresponds to the id', () =>
			agent
				.get("/api/v1/wishList/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const wishList =  res.body.body;
					expect(wishList).toBeTruthy();
					expect(Object.keys(wishList).sort()).toEqual(['id', 'userId', 'items'].sort());
					expect(wishList.id).toEqual(expect.any(Number));
					expect(wishList.items).toEqual(expect.any(Array));
					expect(wishList.items.length).toBe(1);
					wishList.items.forEach( item => {
						expect(Object.keys(item).sort()).toEqual(['ref', 'overview', 'image', 'price', 'SKU', 'productId'].sort());
					});
				})
		);

		it('If the id does not correspond to any wishList, responds with Error 404', () =>
			agent
				.get("/api/v1/wishList/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);

		it('If the id is not an integer, responds with Error 400', () =>
			agent
				.get("/api/v1/wishList/test")
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);
	});

	describe('DELETE /:wishListId/:ref', () => {
		beforeEach( async () => {
			await WishListService.addProduct(...Object.values(wishProducts[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.delete("/api/v1/wishList/1/1")
				.expect(200)
		);
		it('Delete the item with 1 id and response with the wish list data', () =>
			agent
				.delete("/api/v1/wishList/1/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const wishList = res.body.body;
					expect(wishList).toBeTruthy();
					expect(wishList.items.length).toBe(0);
				})
		);

		it('If the id does not correspond to any wish list, responds with Error 404', () =>
			agent
				.delete("/api/v1/wishList/62/1")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the id does not correspond to any item, responds with Error 404', () =>
			agent
				.delete("/api/v1/wishList/1/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the wish list id is not an integer, responds with Error 400', () =>
			agent
				.delete("/api/v1/wishList/test/1")
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);

		it('If the item id is not an integer, responds with Error 400', () =>
			agent
				.delete("/api/v1/wishList/1/test")
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body).toBeNull();
				})
		);
	});
});
