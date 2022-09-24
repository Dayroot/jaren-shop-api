const path = require('path');
const dotenv = require('dotenv');


dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));
const conn = require(path.resolve(process.cwd(), 'src', 'db', 'connectionDB.js'));

//Service
const UserService = require(path.resolve(process.cwd(), 'src', 'services', 'user.service.js'));
const BrandService = require(path.resolve(process.cwd(), 'src', 'services', 'brand.service.js'));
const ProductService = require(path.resolve(process.cwd(), 'src', 'services', 'product.service.js'));
const ShoppingCartService = require(path.resolve(process.cwd(), 'src', 'services', 'shoppingCart.service.js'));
const CategoryService = require(path.resolve(process.cwd(), 'src', 'services', 'category.service.js'));

// Testing data
const { usersData, productsData, brandsData, shoppingProducts } = require('../testData');


describe('ShoppingCart service', () => {

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

	it('The "addProduct" method add a product to the shopping cart in the database and returns all products of the shopping cart', async () => {
		const shoppingCart1 = await ShoppingCartService.addProduct(...Object.values(shoppingProducts[0]));
		const shoppingCart2 = await ShoppingCartService.addProduct(...Object.values(shoppingProducts[0]));

		expect(typeof shoppingCart1).toBe('object');
		expect(typeof shoppingCart2).toBe('object');
		expect( shoppingCart1.id === shoppingCart2.id).toBeTruthy();
		expect(Object.keys(shoppingCart2).sort()).toEqual(['id', 'userId', 'items'].sort());
		expect(Array.isArray(shoppingCart2.items)).toBeTruthy();

		shoppingCart2.items.forEach( (item) => {
			expect(typeof item).toBe('object');
			expect(Object.keys(item).sort()).toEqual(['ref', 'quantity', 'overview', 'image', 'price', 'SKU', 'productId'].sort());
			expect(item.quantity).toBe(2);
		});
	});


	it('The "findOne" method return the shopping cart that corresponds to the id', async () => {
		const shoppingCart = await ShoppingCartService.addProduct(...Object.values(shoppingProducts[0]));
		const shoppingCartFinded = await ShoppingCartService.findOne(shoppingCart.id);

		expect(typeof shoppingCartFinded).toBe('object');
		expect(Object.keys(shoppingCartFinded).sort()).toEqual(['id', 'userId', 'items'].sort());
		expect(Array.isArray(shoppingCartFinded.items)).toBeTruthy();

		shoppingCartFinded.items.forEach( (item) => {
			expect(typeof item).toBe('object');
			expect(Object.keys(item).sort()).toEqual(['ref', 'quantity', 'overview', 'image', 'price', 'SKU', 'productId'].sort());
		});
	});

	it('The "updateProduct" method updates the data of a product in the database', async () => {
		const shoppingCartCreated = await ShoppingCartService.addProduct(...Object.values(shoppingProducts[0]));
		const shoppingCartUpdated = await ShoppingCartService.updateProduct(
			shoppingCartCreated.id,
			shoppingCartCreated.items[0].ref,
			{
				quantity: 26,
			}
		);

		expect(typeof shoppingCartUpdated).toBe('object');
		expect(shoppingCartUpdated.items[0].quantity).toBe(26);
	});

	it('If the cart has no products, it must return an empty array in its products attribute', async () => {
		const shoppingCartFinded = await ShoppingCartService.findOne(1);
		expect(typeof shoppingCartFinded).toBe('object');
		expect(Object.keys(shoppingCartFinded).sort()).toEqual(['id', 'userId', 'items'].sort());
		expect(Array.isArray(shoppingCartFinded.items)).toBeTruthy();
		expect(shoppingCartFinded.items.length).toBe(0);
	});

	it('The "deleteProduct" method delete a product of the shopping cart in the database, and returns the shopping cart', async () => {
		const shoppingCart = await ShoppingCartService.addProduct(...Object.values(shoppingProducts[0]));
		const result = await ShoppingCartService.deleteProduct(shoppingCart.id, shoppingCart.items[0].ref);

		expect(typeof result).toBe('object');
		expect(Object.keys(result).sort()).toEqual(['id', 'userId', 'items'].sort());
		expect(Array.isArray(result.items)).toBeTruthy();
		expect(result.items.length).toBe(0);
	});

});
