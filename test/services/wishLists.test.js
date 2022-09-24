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
const WishListService = require(path.resolve(process.cwd(), 'src', 'services', 'wishList.service.js'));
const CategoryService = require(path.resolve(process.cwd(), 'src', 'services', 'category.service.js'));


// Testing data
const { usersData, productsData, brandsData, wishProducts } = require('../testData');

describe('WishList service', () => {

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

	it('The "addProduct" method add a product to the wishlist in the database and returns all products of the wish list', async () => {
		const wishList = await WishListService.addProduct(...Object.values(wishProducts[0]));

		expect(typeof wishList).toBe('object');
		expect(Object.keys(wishList).sort()).toEqual(['id', 'userId', 'items'].sort());
		expect(Array.isArray(wishList.items)).toBeTruthy();
		wishList.items.forEach( (wishList_product) => {
			expect(typeof wishList_product).toBe('object');
			expect(Object.keys(wishList_product).sort()).toEqual(['ref', 'overview', 'image', 'price', 'SKU', 'productId'].sort());
		});
	});

	it('If the product has already been added to the wish list, an error will be thrown', async () => {
		expect.assertions(1);
		try {
			await WishListService.addProduct(...Object.values(wishProducts[0]));
			await WishListService.addProduct(...Object.values(wishProducts[0]));

		} catch (error) {
			expect(error.message).toMatch('the product had already been added');
		}
	});

	it('The "findOne" method return the wish list that corresponds to the id', async () => {
		const wishListCreated = await WishListService.addProduct(...Object.values(wishProducts[0]));
		const wishList = await WishListService.findOne(wishListCreated.id);

		expect(typeof wishList).toBe('object');
		expect(Object.keys(wishList).sort()).toEqual(['id', 'userId', 'items'].sort());
		expect(Array.isArray(wishList.items)).toBeTruthy();
		wishList.items.forEach( (wishList_product) => {
			expect(typeof wishList_product).toBe('object');
			expect(Object.keys(wishList_product).sort()).toEqual(['ref', 'overview', 'image', 'price', 'SKU', 'productId'].sort());
		});
	});

	it('If the wish list has no products, it must return an empty array in its products attribute', async () => {
		const wishListFinded = await WishListService.findOne(1);
		expect(typeof wishListFinded).toBe('object');
		expect(Object.keys(wishListFinded).sort()).toEqual(['id', 'userId', 'items'].sort());
		expect(Array.isArray(wishListFinded.items)).toBeTruthy();
		expect(wishListFinded.items.length).toBe(0);
	});

	it('The "deleteProduct" method delete a product of the wish list in the database, and returns the wish list', async () => {
		const wishList = await WishListService.addProduct(...Object.values(wishProducts[0]));
		const result = await WishListService.deleteProduct(wishList.id, wishList.items[0].ref);

		expect(typeof result).toBe('object');
		expect(Object.keys(result).sort()).toEqual(['id', 'userId', 'items'].sort());
		expect(Array.isArray(result.items)).toBeTruthy();
		expect(result.items.length).toBe(0);
	});

});
