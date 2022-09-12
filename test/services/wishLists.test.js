const path = require('path');
const dotenv = require('dotenv');


dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));

//Service
const UserService = require(path.resolve(process.cwd(), 'src', 'services', 'user.service.js'));
const BrandService = require(path.resolve(process.cwd(), 'src', 'services', 'brand.service.js'));
const ProductService = require(path.resolve(process.cwd(), 'src', 'services', 'product.service.js'));
const WishListService = require(path.resolve(process.cwd(), 'src', 'services', 'wishList.service.js'));

const userData = {
	firstName: 'Juanito',
	lastName: 'Perez',
	email: 'juenito@gmail.com',
	password: '12345',
};

const productsData = [
	{
		brandId: 1,
		name: "Sauvage",
		description: "The strong gust of Citrus in Sauvage Eau de Toilette is powerfully.",
		stock: 213,
		images: [{url:"http://suavage1.png"}, {url:"http://suavage2.png"}, {url:"http://suavage3.png"}],
	},
	{
		brandId: 1,
		name: "BLEU DE CHANEL",
		description: "An ode to masculine freedom expressed in an aromatic-woody fragrance with a captivating trail.",
		stock: 140,
		images: [{url:"http://blue1.png"}, {url:"http://blue2.png"}, {url:"http://blue3.png"}],
	},
	{
		brandId: 1,
		name: "Black Opium",
		description: "The original Eau de Parfum. Featuring black coffee and sensual vanilla. Addictive and energising.",
		stock: 451,
		images: [{url:"http://opium1.png"}, {url:"http://opium2.png"}, {url:"http://opium3.png"}],
	}
];

const brandData = {
	name: "DIOR",
	logoUrl: "http://diorlogo.png",
}

const wishProducts = [
	{
		wishListId: 1,
		productId: 1,
		overview: 'perfume for men Sauvage 60ml brand DIOR',
	},
	{
		wishListId: 1,
		productId: 2,
		overview: 'perfume for men BLEU DE CHANEL 100ml brand CHANEL',
	},
	{
		wishListId: 1,
		productId: 3,
		overview: 'perfume for woman Black Opium 120ml brand YVES SAINT LAURENT',
	},
]

describe('WishList service', () => {

	beforeEach( async () => {
		await migration();
		await UserService.add(...Object.values(userData));
		await BrandService.add(...Object.values(brandData));
		await ProductService.bulkAdd(productsData);
	});

	afterAll( async () => {
		await migration();
	});

	it('The "addProduct" method add a product to the wishlist in the database and returns all products of the wish list', async () => {
		const wishList = await WishListService.addProduct(...Object.values(wishProducts[0]));

		expect(typeof wishList).toBe('object');
		expect(Object.keys(wishList).sort()).toEqual(['id', 'userId', 'wishList_products'].sort());
		expect(Array.isArray(wishList.wishList_products)).toBeTruthy();
		wishList.wishList_products.forEach( (wishList_product, i) => {
			expect(typeof wishList_product).toBe('object');
			expect(Object.keys(wishList_product).sort()).toEqual(['ref', 'overview', 'product'].sort());
			expect(typeof wishList_product.product).toBe('object');
			expect(Object.keys(wishList_product.product).sort()).toEqual(['id', 'brand', 'images', 'discountId', 'name', 'description', 'stock'].sort());
			expect(wishList_product.product.name).toBe(productsData[i].name);
			expect(wishList_product.product.description).toBe(productsData[i].description);
			expect(wishList_product.product.stock).toBe(productsData[i].stock);
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
		const wishList = await WishListService.addProduct(...Object.values(wishProducts[0]));
		const wishListFinded = await WishListService.findOne(wishList.id);

		expect(typeof wishListFinded).toBe('object');
		expect(Object.keys(wishListFinded).sort()).toEqual(['id', 'userId', 'wishList_products'].sort());
		expect(Array.isArray(wishListFinded.wishList_products)).toBeTruthy();
		wishListFinded.wishList_products.forEach( (wishList_product, i) => {
			expect(typeof wishList_product).toBe('object');
			expect(Object.keys(wishList_product).sort()).toEqual(['ref', 'overview', 'product'].sort());
			expect(typeof wishList_product.product).toBe('object');
			expect(Object.keys(wishList_product.product).sort()).toEqual(['id', 'brand', 'images', 'discountId', 'name', 'description', 'stock'].sort());
			expect(wishList_product.product.name).toBe(productsData[i].name);
			expect(wishList_product.product.description).toBe(productsData[i].description);
			expect(wishList_product.product.stock).toBe(productsData[i].stock);
		});
	});

	it('If the wish list has no products, it must return an empty array in its products attribute', async () => {
		const wishListFinded = await WishListService.findOne(1);
		expect(typeof wishListFinded).toBe('object');
		expect(Object.keys(wishListFinded).sort()).toEqual(['id', 'userId', 'wishList_products'].sort());
		expect(Array.isArray(wishListFinded.wishList_products)).toBeTruthy();
		expect(wishListFinded.wishList_products.length).toBe(0);
	});

	it('The "deleteProduct" method delete a product of the wish list in the database, and returns the wish list', async () => {
		const wishList = await WishListService.addProduct(...Object.values(wishProducts[0]));
		const result = await WishListService.deleteProduct(wishList.id, wishList.wishList_products[0].ref);

		expect(typeof result).toBe('object');
		expect(Object.keys(result).sort()).toEqual(['id', 'userId', 'wishList_products'].sort());
		expect(Array.isArray(result.wishList_products)).toBeTruthy();
		expect(result.wishList_products.length).toBe(0);
	});

});
