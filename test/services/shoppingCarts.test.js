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
		stock: 213,
		images: [{url:"http://suavage1.png"}, {url:"http://suavage2.png"}, {url:"http://suavage3.png"}],
		gender: 'men',
		prices: [{size:"30", value: 650.01}, {size:"60", value: 650.01}, {size:"100", value: 649.99}],
		categoryId: 1,
	},
	{
		brandId: 1,
		name: "BLEU DE CHANEL",
		description: "An ode to masculine freedom expressed in an aromatic-woody fragrance with a captivating trail.",
		stock: 140,
		images: [{url:"http://blue1.png"}, {url:"http://blue2.png"}, {url:"http://blue3.png"}],
		gender: 'men',
		prices: [{size:"60", value: 850.00}, {size:"100", value: 1350.00}, {size:"200", value: 2799.99}],
		categoryId: 1,
	},
	{
		brandId: 1,
		name: "Black Opium",
		description: "The original Eau de Parfum. Featuring black coffee and sensual vanilla. Addictive and energising.",
		stock: 451,
		images: [{url:"http://opium1.png"}, {url:"http://opium2.png"}, {url:"http://opium3.png"}],
		gender: 'woman',
		prices: [{size:"80", value: 1199.99}, {size:"100", value: 1999.99}, {size:"200", value: 3400.00}],
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
		quantity: 1,
		overview: 'perfume for men Sauvage 60ml brand DIOR',
	},
	{
		shoppingCartId: 1,
		productId: 2,
		quantity: 1,
		overview: 'perfume for men BLEU DE CHANEL 100ml brand CHANEL',
	},
	{
		shoppingCartId: 1,
		productId: 3,
		quantity: 4,
		overview: 'perfume for woman Black Opium 120ml brand YVES SAINT LAURENT',
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
	});

	it('The "addProduct" method add a product to the shopping cart in the database and returns all products of the shopping cart', async () => {
		const shoppingCart1 = await ShoppingCartService.addProduct(...Object.values(shoppingProducts[0]));
		const shoppingCart2 = await ShoppingCartService.addProduct(...Object.values(shoppingProducts[0]));

		expect(typeof shoppingCart1).toBe('object');
		expect(typeof shoppingCart2).toBe('object');
		expect( shoppingCart1.id === shoppingCart2.id).toBeTruthy();
		expect(Object.keys(shoppingCart2).sort()).toEqual(['id', 'userId', 'shoppingCart_products'].sort());
		expect(Array.isArray(shoppingCart2.shoppingCart_products)).toBeTruthy();

		shoppingCart2.shoppingCart_products.forEach( (shoppingCart_product, i) => {
			expect(typeof shoppingCart_product).toBe('object');
			expect(Object.keys(shoppingCart_product).sort()).toEqual(['ref', 'quantity', 'overview', 'product'].sort());
			expect(shoppingCart_product.quantity).toBe(2);

			expect(typeof shoppingCart_product.product).toBe('object');
			expect(Object.keys(shoppingCart_product.product).sort()).toEqual(['id', 'brand', 'images', 'discountId', 'name', 'description', 'stock', 'gender', 'prices', 'category'].sort());
			expect(shoppingCart_product.product.name).toBe(productsData[i].name);
			expect(shoppingCart_product.product.description).toBe(productsData[i].description);
			expect(shoppingCart_product.product.stock).toBe(productsData[i].stock);
		});
	});


	it('The "findOne" method return the shopping cart that corresponds to the id', async () => {
		const shoppingCart = await ShoppingCartService.addProduct(...Object.values(shoppingProducts[0]));
		const shoppingCartFinded = await ShoppingCartService.findOne(shoppingCart.id);


		expect(typeof shoppingCartFinded).toBe('object');
		expect(Object.keys(shoppingCartFinded).sort()).toEqual(['id', 'userId', 'shoppingCart_products'].sort());
		expect(Array.isArray(shoppingCartFinded.shoppingCart_products)).toBeTruthy();

		shoppingCartFinded.shoppingCart_products.forEach( (shoppingCart_product, i) => {
			expect(typeof shoppingCart_product).toBe('object');
			expect(Object.keys(shoppingCart_product).sort()).toEqual(['ref', 'quantity', 'overview', 'product'].sort());
			expect(typeof shoppingCart_product.product).toBe('object');
			expect(Object.keys(shoppingCart_product.product).sort()).toEqual(['id', 'brand', 'images', 'discountId', 'name', 'description', 'stock', 'gender', 'prices', 'category'].sort());
			expect(shoppingCart_product.product.name).toBe(productsData[i].name);
			expect(shoppingCart_product.product.description).toBe(productsData[i].description);
			expect(shoppingCart_product.product.stock).toBe(productsData[i].stock);
		});
	});

	it('The "updateProduct" method updates the data of a product in the database', async () => {
		const shoppingCartCreated = await ShoppingCartService.addProduct(...Object.values(shoppingProducts[0]));
		const shoppingCartUpdated = await ShoppingCartService.updateProduct(
			shoppingCartCreated.id,
			shoppingCartCreated.shoppingCart_products[0].ref,
			{
				quantity: 26,
			}
		);

		expect(typeof shoppingCartUpdated).toBe('object');
		expect(shoppingCartUpdated.shoppingCart_products[0].quantity).toBe(26);
	});

	it('If the cart has no products, it must return an empty array in its products attribute', async () => {
		const shoppingCartFinded = await ShoppingCartService.findOne(1);
		expect(typeof shoppingCartFinded).toBe('object');
		expect(Object.keys(shoppingCartFinded).sort()).toEqual(['id', 'userId', 'shoppingCart_products'].sort());
		expect(Array.isArray(shoppingCartFinded.shoppingCart_products)).toBeTruthy();
		expect(shoppingCartFinded.shoppingCart_products.length).toBe(0);
	});

	it('The "deleteProduct" method delete a product of the shopping cart in the database, and returns the shopping cart', async () => {
		const shoppingCart = await ShoppingCartService.addProduct(...Object.values(shoppingProducts[0]));
		const result = await ShoppingCartService.deleteProduct(shoppingCart.id, shoppingCart.shoppingCart_products[0].ref);

		expect(typeof result).toBe('object');
		expect(Object.keys(result).sort()).toEqual(['id', 'userId', 'shoppingCart_products'].sort());
		expect(Array.isArray(result.shoppingCart_products)).toBeTruthy();
		expect(result.shoppingCart_products.length).toBe(0);
	});

});
