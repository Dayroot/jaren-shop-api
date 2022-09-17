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
		images: [{url:"http://suavage1.png"}, {url:"http://suavage2.png"}, {url:"http://suavage3.png"}],
		gender: 'men',
		variants: [
			{size:"30", price: 350.01, SKU:"DIO-SAU-30", UPC:"145836584321", stock: 10},
			{size:"60", price: 450.01, SKU:"DIO-SAU-60", UPC:"145836584322", stock: 18},
			{size:"100", price: 649.99, SKU:"DIO-SAU-100", UPC:"145836584323", stock: 12}
		],
		categoryId: 1,
	},
	{
		brandId: 1,
		name: "BLEU DE CHANEL",
		description: "An ode to masculine freedom expressed in an aromatic-woody fragrance with a captivating trail.",
		images: [{url:"http://blue1.png"}, {url:"http://blue2.png"}, {url:"http://blue3.png"}],
		gender: 'men',
		variants: [
			{size:"30", price: 550.01, SKU:"CHA-BLE-30", UPC:"145836584324", stock: 80},
			{size:"60", price: 850.01, SKU:"CHA-BLE-60", UPC:"145836584325", stock: 48},
			{size:"100", price: 1149.99, SKU:"CHA-BLE-100", UPC:"145836584326", stock: 242}
		],
		categoryId: 1,
	},
	{
		brandId: 1,
		name: "Black Opium",
		description: "The original Eau de Parfum. Featuring black coffee and sensual vanilla. Addictive and energising.",
		images: [{url:"http://opium1.png"}, {url:"http://opium2.png"}, {url:"http://opium3.png"}],
		gender: 'woman',
		variants: [
			{size:"30", price: 1250.01, SKU:"YSL-BOP-30", UPC:"145836584327", stock: 260},
			{size:"60", price: 1950.01, SKU:"YSL-BOP-60", UPC:"145836584328", stock: 187},
			{size:"100", price: 2349.99, SKU:"YSL-BOP-100", UPC:"145836584329", stock: 122}
		],
		categoryId: 1,
	}
];

const brandData = {
	name: "DIOR",
	logoUrl: "http://diorlogo.png",
}

const shoppingProducts = [
	{
		shoppingCartId: 1,
		productId: 1,
		SKU:"DIO-SAU-30",
		quantity: 1,
	},
	{
		shoppingCartId: 1,
		productId: 2,
		SKU:"CHA-BLE-60",
		quantity: 5,
	},
	{
		shoppingCartId: 1,
		productId: 3,
		SKU:"YSL-BOP-100",
		quantity: 26,
	},
]

describe('ShoppingCart service', () => {

	beforeEach( async () => {
		await migration();
		await UserService.add(...Object.values(userData));
		await BrandService.add(...Object.values(brandData));
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
