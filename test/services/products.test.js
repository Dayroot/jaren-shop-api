const path = require('path');
const dotenv = require('dotenv');

//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));
const conn = require(path.resolve(process.cwd(), 'src', 'db', 'connectionDB.js'));

//Services
const ProductService = require(path.resolve(process.cwd(), 'src', 'services', 'product.service.js'));
const BrandService = require(path.resolve(process.cwd(), 'src', 'services', 'brand.service.js'));
const CategoryService = require(path.resolve(process.cwd(), 'src', 'services', 'category.service.js'));

// Testing data
const { brandsData, productsData } = require('../testData');

describe('Products service', () => {

	beforeEach( async () => {
		await migration();
		await BrandService.bulkAdd(brandsData);
		await CategoryService.add('perfumes');
	});

	afterAll( async () => {
		await migration();
		conn.close();
	});

	it('The add method registered a new product in database', async () => {

		const product = await ProductService.add(...Object.values(productsData[0]));

		expect(typeof product).toBe('object');
		expect(product.id).toBe(1);
		expect(product.brand.name).toBe("DIOR");
		expect(product.images.length).toBe(3);
		expect( product.variants.length ).toBe(3);
		expect( product.category.name).toBe("perfumes");
		expect(Object.keys(product).sort()).toEqual(['id', 'brand', 'name', 'description', 'images', 'discountId', 'category', 'gender', 'reviewCount', 'reviewAverage', 'variants'].sort());
		expect(Object.keys(product.variants[0]).sort()).toEqual(['id', 'price', 'stock', 'size', 'SKU', 'UPC'].sort());

	});

	it('The bulkAdd method registered multiple products in the database', async() => {
		const products = await ProductService.bulkAdd(productsData);

		expect(Array.isArray(products)).toBeTruthy();

		products.forEach( (product, i) => {
			expect( product.images.length ).toBe(3);
			expect( product.variants.length ).toBe(3);
			expect( product.category.name).toBe("perfumes");
			expect(Object.keys(product).sort()).toEqual(['id', 'brand', 'name', 'description', 'images', 'discountId', 'category', 'gender', 'reviewCount', 'reviewAverage', 'variants'].sort());
			expect(Object.keys(product.variants[0]).sort()).toEqual(['id', 'price', 'stock', 'size', 'SKU', 'UPC'].sort());
		});
	});

	it('The method findOne search the given id in the database and returns an object with the properties of the product',
	async () => {
		const productCreated = await ProductService.add(...Object.values(productsData[0]));
		const product = await ProductService.findOne(productCreated.id);

		expect(product.id).toBe(1);
		expect( product.brand.name ).toBe("DIOR");
		expect( product.images.length ).toBe(3);
		expect( product.variants.length ).toBe(3);
		expect( product.category.name).toBe("perfumes");
		expect(Object.keys(product).sort()).toEqual(['id', 'brand', 'name', 'description', 'images', 'discountId', 'category', 'gender', 'reviewCount', 'reviewAverage', 'variants'].sort());
			expect(Object.keys(product.variants[0]).sort()).toEqual(['id', 'price', 'stock', 'size', 'SKU', 'UPC'].sort());
	});

	it('The method find returns an array with all the products in the database', async () => {
		await ProductService.bulkAdd(productsData);
		const products = await ProductService.find();

		expect(Array.isArray(products)).toBeTruthy();

		products.forEach( (product, i) => {
			expect( product.images.length ).toBe(3);
			expect( product.variants.length ).toBe(3);
			expect( product.category.name).toBe("perfumes");
			expect(Object.keys(product).sort()).toEqual(['id', 'brand', 'name', 'description', 'images', 'discountId', 'category', 'gender', 'reviewCount', 'reviewAverage', 'variants'].sort());
			expect(Object.keys(product.variants[0]).sort()).toEqual(['id', 'price', 'stock', 'size', 'SKU', 'UPC'].sort());
		});
	});

	it('The update method updates the product with the supplied data', async () => {

		const productCreated = await ProductService.add(...Object.values(productsData[0]));
		const productUpdated = await ProductService.update(productCreated.id, {
			description: "The description was updated",
			name: "New name",
			variants: [
				{
					id: 1,
					size: '800',
				}
			]
		});

		const variantUpdated = productUpdated.variants.find( variant => variant.id === 1);

		expect( typeof productUpdated).toBe('object');
		expect(productUpdated.name).toBe("New name");
		expect(productUpdated.description).toBe("The description was updated");
		expect(Object.keys(productUpdated).sort()).toEqual(['id', 'brand', 'name', 'description', 'images', 'discountId', 'category', 'gender', 'reviewCount', 'reviewAverage', 'variants'].sort());
		expect(Object.keys(variantUpdated).sort()).toEqual(['id', 'price', 'stock', 'size', 'SKU', 'UPC'].sort());
		expect(variantUpdated.size).toBe('800');

	});


	it('The update method updates the product with the supplied data', async () => {

		const productCreated = await ProductService.add(...Object.values(productsData[0]));
		const productUpdated = await ProductService.update(productCreated.id, {
			variants: [
				{
					id: 1,
					size: '800',
				}
			]
		});

		const variantUpdated = productUpdated.variants.find( variant => variant.id === 1);

		expect( typeof productUpdated).toBe('object');
		expect(Object.keys(productUpdated).sort()).toEqual(['id', 'brand', 'name', 'description', 'images', 'discountId', 'category', 'gender', 'reviewCount', 'reviewAverage', 'variants'].sort());
		expect(Object.keys(variantUpdated).sort()).toEqual(['id', 'price', 'stock', 'size', 'SKU', 'UPC'].sort());
		expect(variantUpdated.size).toBe('800');
	});

	it('The update method updates the product with the supplied data', async () => {

		const productCreated = await ProductService.add(...Object.values(productsData[0]));
		const productUpdated = await ProductService.update(productCreated.id, {
			description: "The description was updated",
			name: "New name",
		});
		expect( typeof productUpdated).toBe('object');
		expect(productUpdated.name).toBe("New name");
		expect(productUpdated.description).toBe("The description was updated");
		expect(Object.keys(productUpdated).sort()).toEqual(['id', 'brand', 'name', 'description', 'images', 'discountId', 'category', 'gender', 'reviewCount', 'reviewAverage', 'variants'].sort());
	});

	it('The delete method destroy the record in the dabase, returns the product id', async () => {
		const productCreated = await ProductService.add(...Object.values(productsData[0]));
		const result = await ProductService.delete(productCreated.id);

		expect(typeof result).toBe('number');
		expect(result).toBe(1);
	});
});
