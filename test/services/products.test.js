const path = require('path');
const dotenv = require('dotenv');

//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));

//Models
const ProductModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'product.model.js'));

//Services
const ProductService = require(path.resolve(process.cwd(), 'src', 'services', 'product.service.js'));

const productsData = [
	{
		brand: {
			name: "DIOR",
			logoUrl: "http://diorlogo.png",
		},
		name: "Sauvage",
		description: "The strong gust of Citrus in Sauvage Eau de Toilette is powerfully.",
		stock: 213,
		images: [{url:"http://suavage1.png"}, {url:"http://suavage2.png"}, {url:"http://suavage3.png"}],
		type: {
			name: "Perfume",
			data: {
				gender: "men",
				pricesPerSize: [{size:30, price: 650.01}, {size:60, price: 650.01}, {size:100, price: 649.99}],
			}
		},
	},
	{
		brand: {
			name: "CHANEL",
			logoUrl: "http://chanellogo.png",
		},
		name: "BLEU DE CHANEL",
		description: "An ode to masculine freedom expressed in an aromatic-woody fragrance with a captivating trail.",
		stock: 140,
		images: [{url:"http://blue1.png"}, {url:"http://blue2.png"}, {url:"http://blue3.png"}],
		type: {
			name: "Perfume",
			data: {
				gender: "men",
				pricesPerSize: [{size:60, price: 850.00}, {size:100, price: 1350.00}, {size:200, price: 2799.99}],
			}
		},

	},
	{
		brand: {
			id: 3,
			name: "YVES SAINT LAURENT",
			logoUrl: "http://ivessaintlaurentlogo.png",
		},
		name: "Black Opium",
		description: "The original Eau de Parfum. Featuring black coffee and sensual vanilla. Addictive and energising.",
		stock: 451,
		images: [{url:"http://opium1.png"}, {url:"http://opium2.png"}, {url:"http://opium3.png"}],
		type: {
			name: "Perfume",
			data: {
				gender: "woman",
				pricesPerSize: [{size:80, price: 1199.99}, {size:100, price: 1999.99}, {size:200, price: 3400.00}],
			}
		},
	}
];

describe('Products service', () => {

	beforeEach( async () => {
		await migration();
	});

	afterAll( async () => {
		await migration();
	});

	it('The add method registered a new product in database', async () => {

		const product = await ProductService.add(...Object.values(productsData[0]));
		const brand = await product.getBrand();
		const imagesNumber = await product.countProductImages();
		const perfume = await product.getPerfume();
		const perfumeSizes = await perfume.countPerfumeSizes();

		expect( product instanceof ProductModel ).toBeTruthy();
		expect( brand.name ).toBe("DIOR");
		expect( imagesNumber ).toBe(3);
		expect( perfume.gender ).toBe("men");
		expect(perfumeSizes).toBe(3);

	});
});
