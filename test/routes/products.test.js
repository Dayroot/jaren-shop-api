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
const {brandsData, productsData} = require('../testData');
const ProductService = require('../../src/services/product.service');

//Services
const BrandService = require(path.resolve(process.cwd(), 'src', 'services', 'brand.service.js'));
const CategoryService = require(path.resolve(process.cwd(), 'src', 'services', 'category.service.js'));

describe('Products Endpoints', () => {

	beforeEach( async () => {
		await migration();
		await BrandService.bulkAdd(brandsData);
		await CategoryService.add('perfumes');
	});

	afterAll( async () => {
		await migration();
		conn.close();
	});

	describe('POST /', () => {
		it('Respond with a status code of 200', () =>
			agent
				.post("/api/v1/products")
				.send(productsData[0])
				.expect(201)
		);
		it('Responds with the product data', () =>
			agent
				.post("/api/v1/products")
				.send(productsData[0])
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const product =  res.body.body;
					expect(typeof product).toBe('object');
					expect(product.id).toBe(1);
					expect(product.brand.name).toBe("DIOR");
					expect(product.images.length).toBe(3);
					expect( product.variants.length ).toBe(3);
					expect( product.category.name).toBe("perfumes");
					expect(Object.keys(product).sort()).toEqual(['id', 'brand', 'name', 'description', 'images', 'discountId', 'category', 'gender', 'reviewCount', 'reviewAverage', 'variants'].sort());
					expect(Object.keys(product.variants[0]).sort()).toEqual(['id', 'price', 'stock', 'size', 'SKU', 'UPC'].sort());
				})
		);
		it('Responds with Error', () =>
			agent
				.post("/api/v1/products")
				.send({name: "test"})
				.expect(500)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);
	});

	describe('GET /', () => {
		beforeEach( async () => {
			await ProductService.bulkAdd(productsData);
		});
		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/products/")
				.expect(200)
		);
		it('Responds with all products data', () =>
			agent
				.get("/api/v1/products")
				.then( res => {

					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(Array.isArray(res.body.body)).toBeTruthy();
					const products =  res.body.body;

					products.forEach( (product, i) => {
						expect(typeof product).toBe('object');
						expect(product.id).toBe(i+1);
						expect(product.images.length).toBe(3);
						expect( product.variants.length ).toBe(3);
						expect( product.category.name).toBe("perfumes");
						expect(Object.keys(product).sort()).toEqual(['id', 'brand', 'name', 'description', 'images', 'discountId', 'category', 'gender', 'reviewCount', 'reviewAverage', 'variants'].sort());
						expect(Object.keys(product.variants[0]).sort()).toEqual(['id', 'price', 'stock', 'size', 'SKU', 'UPC'].sort());
					})
				})
		);
	});

	describe('GET /:id', () => {
		beforeEach( async () => {
			await ProductService.add(...Object.values(productsData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.get("/api/v1/products/1")
				.expect(200)
		);
		it('Responds with the product data that corresponds to the id', () =>
			agent
				.get("/api/v1/products/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const product =  res.body.body;
					expect(typeof product).toBe('object');
					expect(product.id).toBe(1);
					expect(product.brand.name).toBe("DIOR");
					expect(product.images.length).toBe(3);
					expect( product.variants.length ).toBe(3);
					expect( product.category.name).toBe("perfumes");
					expect(Object.keys(product).sort()).toEqual(['id', 'brand', 'name', 'description', 'images', 'discountId', 'category', 'gender', 'reviewCount', 'reviewAverage', 'variants'].sort());
					expect(Object.keys(product.variants[0]).sort()).toEqual(['id', 'price', 'stock', 'size', 'SKU', 'UPC'].sort());
				})
		);

		it('Responds with Error', () =>
			agent
				.get("/api/v1/products/62")
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);
	});

	describe('PATCH /:id', () => {
		beforeEach( async () => {
			await ProductService.add(...Object.values(productsData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.patch("/api/v1/products/1")
				.send({
					description: "The description was updated",
					name: "New name",
					variants: [
						{
							id: 1,
							size: '800',
						}
					]
				})
				.expect(200)
		);
		it('Responds with the product data that corresponds to the id', () =>
			agent
				.patch("/api/v1/products/1")
				.send({
					description: "The description was updated",
					name: "New name",
					variants: [
						{
							id: 1,
							size: '800',
						}
					]
				})
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const product =  res.body.body;
					expect(typeof product).toBe('object');
					expect(product.id).toBe(1);
					expect(product.images.length).toBe(3);
					expect( product.variants.length ).toBe(3);
					expect(product.name).toBe("New name");
					expect(product.description).toBe("The description was updated");
					expect(Object.keys(product).sort()).toEqual(['id', 'brand', 'name', 'description', 'images', 'discountId', 'category', 'gender', 'reviewCount', 'reviewAverage', 'variants'].sort());
					expect(Object.keys(product.variants[0]).sort()).toEqual(['id', 'price', 'stock', 'size', 'SKU', 'UPC'].sort());
					expect(product.variants[0].size).toBe('800');
				})
		);

		it('Responds with the product data that corresponds to the id', () =>
			agent
				.patch("/api/v1/products/1")
				.send({
					description: "The description was updated",
					name: "New name",
				})
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					const product =  res.body.body;
					expect(typeof product).toBe('object');
					expect(product.id).toBe(1);
					expect(product.images.length).toBe(3);
					expect( product.variants.length ).toBe(3);
					expect(product.name).toBe("New name");
					expect(product.description).toBe("The description was updated");
					expect(Object.keys(product).sort()).toEqual(['id', 'brand', 'name', 'description', 'images', 'discountId', 'category', 'gender', 'reviewCount', 'reviewAverage', 'variants'].sort());
					expect(Object.keys(product.variants[0]).sort()).toEqual(['id', 'price', 'stock', 'size', 'SKU', 'UPC'].sort());
				})
		);

		it('Responds with Error', () =>
			agent
				.patch("/api/v1/products/62")
				.send({
					description: "The description was updated",
					name: "New name",
				})
				.expect(404)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);
	});

	describe('DELETE /:id', () => {
		beforeEach( async () => {
			await ProductService.add(...Object.values(productsData[0]));
		});
		it('Respond with a status code of 200', () =>
			agent
				.delete("/api/v1/products/1")
				.expect(200)
		);
		it('Responds with 1', () =>
			agent
				.delete("/api/v1/products/1")
				.then( res => {
					expect(Object.keys(res.body)).toEqual(['error', 'body']);
					expect(res.body.body).toBe(1);
				})
		);

		it('Responds with Error', () =>
			agent
				.delete("/api/v1/products/62")
				.expect(400)
				.then( res => {
					const {error, body} = res.body;
					expect(typeof error).toBe('string');
					expect(body === null).toBeTruthy();
				})
		);
	});
});
