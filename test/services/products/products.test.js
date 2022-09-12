const path = require('path');
const dotenv = require('dotenv');

//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));
const conn = require(path.resolve(process.cwd(), 'src', 'db', 'connectionDB.js'));

//Models
const ProductModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'product.model.js'));

//Services
const ProductService = require(path.resolve(process.cwd(), 'src', 'services', 'product.service.js'));
const BrandService = require(path.resolve(process.cwd(), 'src', 'services', 'brand.service.js'));

const brandsData = [
	{
		name: "DIOR",
		logoUrl: "http://diorlogo.png",
	},
	{
		name: "CHANEL",
		logoUrl: "http://chanellogo.png",
	},
	{
		name: "YVES SAINT LAURENT",
		logoUrl: "http://ivessaintlaurentlogo.png",
	},
];

const productsData = [
	{
		brandId: 1,
		name: "Sauvage",
		description: "The strong gust of Citrus in Sauvage Eau de Toilette is powerfully.",
		stock: 213,
		images: [{url:"http://suavage1.png"}, {url:"http://suavage2.png"}, {url:"http://suavage3.png"}],
	},
	{
		brandId: 2,
		name: "BLEU DE CHANEL",
		description: "An ode to masculine freedom expressed in an aromatic-woody fragrance with a captivating trail.",
		stock: 140,
		images: [{url:"http://blue1.png"}, {url:"http://blue2.png"}, {url:"http://blue3.png"}],
	},
	{
		brandId: 3,
		name: "Black Opium",
		description: "The original Eau de Parfum. Featuring black coffee and sensual vanilla. Addictive and energising.",
		stock: 451,
		images: [{url:"http://opium1.png"}, {url:"http://opium2.png"}, {url:"http://opium3.png"}],
	}
];

describe('Products service', () => {

	beforeEach( async () => {
		await migration();
		await BrandService.bulkAdd(brandsData);
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
		expect(Object.keys(product).sort()).toEqual(['id', 'brand', 'name', 'description', 'stock', 'images', 'discountId'].sort());

	});

	it('The bulkAdd method registered multiple products in the database', async() => {
		const products = await ProductService.bulkAdd(productsData);

		expect(Array.isArray(products)).toBeTruthy();

		products.forEach( (product, i) => {
			expect(product.id).toBe(i + 1);
			expect( product.brand.name ).toBe(brandsData[i].name);
			expect( product.images.length ).toBe(3);
			expect( Object.keys(product).sort()).toEqual(['brand', 'name', 'description', 'stock', 'images',  'discountId', 'id'].sort());
		});
	});

	it('The method findOne search the given id in the database and returns an object with the properties of the product',
	async () => {
		const productCreated = await ProductService.add(...Object.values(productsData[0]));
		const product = await ProductService.findOne(productCreated.id);

		expect(product.id).toBe(1);
		expect( product.brand.name ).toBe("DIOR");
		expect( product.images.length ).toBe(3);
		expect( Object.keys(product).sort()).toEqual(['brand', 'name', 'description', 'stock', 'images' , 'discountId', 'id'].sort());
	});

	it('The method find returns an array with all the products in the database', async () => {
		const productsCreated = await ProductService.bulkAdd(productsData);
		const products = await ProductService.find();

		expect(Array.isArray(products)).toBeTruthy();

		products.forEach( (product, i) => {
			expect(product.id).toBe(productsCreated[i].id);
			expect( product.brand.name ).toBe(productsCreated[i].brand.name);
			expect( product.images.length ).toBe(3);
			expect( Object.keys(product).sort()).toEqual(['brand', 'name', 'description', 'stock', 'images',  'discountId', 'id'].sort());
		});
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
		expect( Object.keys(productUpdated).sort()).toEqual(['brand', 'name', 'description', 'stock', 'images',  'discountId', 'id'].sort());

	});

	it('The delete method destroy the record in the dabase, returns the product id', async () => {
		const productCreated = await ProductService.add(...Object.values(productsData[0]));
		const result = await ProductService.delete(productCreated.id);

		expect(typeof result).toBe('number');
		expect(result).toBe(1);
	});
});
