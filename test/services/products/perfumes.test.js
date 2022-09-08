const path = require('path');
const dotenv = require('dotenv');


//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));
const conn = require(path.resolve(process.cwd(), 'src', 'db', 'connectionDB.js'));

//Models
const PerfumeModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'perfume.model.js'));

//Services
const PerfumeService = require(path.resolve(process.cwd(), 'src', 'services', 'perfume.service.js'));
const BrandService = require(path.resolve(process.cwd(), 'src', 'services', 'brand.service.js'));

const perfumesData = [
	{
		brand: {
			id: 1,
			name: "DIOR",
			logoUrl: "http://diorlogo.png",
		},
		name: "Sauvage",
		description: "The strong gust of Citrus in Sauvage Eau de Toilette is powerfully.",
		stock: 213,
		images: [{url:"http://suavage1.png"}, {url:"http://suavage2.png"}, {url:"http://suavage3.png"}],
		gender: "men",
		perfumePrices: [{size:30, price: 650.01}, {size:60, price: 650.01}, {size:100, price: 649.99}],
	},
	{
		brand: {
			id: 2,
			name: "CHANEL",
			logoUrl: "http://chanellogo.png",
		},
		name: "BLEU DE CHANEL",
		description: "An ode to masculine freedom expressed in an aromatic-woody fragrance with a captivating trail.",
		stock: 140,
		images: [{url:"http://blue1.png"}, {url:"http://blue2.png"}, {url:"http://blue3.png"}],
		gender: "men",
		perfumePrices: [{size:60, price: 850.00}, {size:100, price: 1350.00}, {size:200, price: 2799.99}],

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
		gender: "woman",
		perfumePrices: [{size:80, price: 1199.99}, {size:100, price: 1999.99}, {size:200, price: 3400.00}],
	}
];

describe('Perfume Service', () => {

	beforeEach( async () => {
		await migration();
		const brandsData = perfumesData.map( product => {
			return {
				name: product.brand.name,
				logoUrl: product.brand.logoUrl,
			}
		});
		await BrandService.bulkAdd(brandsData);
	});

	afterAll( async () => {
		await migration();
		conn.close();

	});

	it('The add method registered a new Perfume in database', async() => {
		const perfume = await PerfumeService.add(...Object.values(perfumesData[0]));

		expect(typeof perfume).toBe('object');
		expect(perfume.id).toBe(1);
		expect( perfume.brand.name ).toBe("DIOR");
		expect( perfume.images.length ).toBe(3);
		expect( Object.keys(perfume).sort()).toEqual(['brand', 'name', 'description', 'stock', 'images', 'gender', 'perfumePrices', 'discountId', 'id'].sort());
	});

	it('The bulkAdd method registered multiple perfumes in database', async() => {
		const perfumes = await PerfumeService.bulkAdd(perfumesData);

		expect(Array.isArray(perfumes)).toBeTruthy();

		perfumes.forEach( (perfume, i) => {
			expect(perfume.id).toBe(i + 1);
			expect( perfume.brand.name ).toBe(perfumesData[i].brand.name);
			expect( perfume.images.length ).toBe(3);
			expect( Object.keys(perfume).sort()).toEqual(['brand', 'name', 'description', 'stock', 'images', 'gender', 'perfumePrices', 'discountId', 'id'].sort());
		});
	});

	it('The method findOne search the given id in the database and returns an object with the properties of the Perfume class',
	async () => {
		const perfumeCreated = await PerfumeService.add(...Object.values(perfumesData[0]));
		const perfume = await PerfumeService.findOne(perfumeCreated.id);

		expect(perfume.id).toBe(1);
		expect( perfume.brand.name ).toBe("DIOR");
		expect( perfume.images.length ).toBe(3);
		expect( Object.keys(perfume).sort()).toEqual(['brand', 'name', 'description', 'stock', 'images', 'gender', 'perfumePrices', 'discountId', 'id'].sort());
	});

	it('The method find returns an array with all the perfumes in the database', async () => {
		const perfumesCreated = await PerfumeService.bulkAdd(perfumesData);
		const perfumes = await PerfumeService.find();

		expect(Array.isArray(perfumes)).toBeTruthy();

		perfumes.forEach( (perfume, i) => {
			expect(perfume.id).toBe(perfumesCreated[i].id);
			expect( perfume.brand.name ).toBe(perfumesCreated[i].brand.name);
			expect( perfume.images.length ).toBe(3);
			expect( Object.keys(perfume).sort()).toEqual(['brand', 'name', 'description', 'stock', 'images', 'gender', 'perfumePrices', 'discountId', 'id'].sort());
		});
	});

	it('The update method updates the product and the perfume with the supplied data', async () => {

		const perfumeCreated = await PerfumeService.add(...Object.values(perfumesData[0]));
		const perfumeUpdated = await PerfumeService.update(perfumeCreated.id, {
			description: "The description was updated",
			name: "New name",
			gender: "woman",
		});

		expect( typeof perfumeUpdated).toBe('object');
		expect(perfumeUpdated.name).toBe("New name");
		expect(perfumeUpdated.description).toBe("The description was updated");
		expect(perfumeUpdated.gender).toBe("woman");
		expect( Object.keys(perfumeUpdated).sort()).toEqual(['brand', 'name', 'description', 'stock', 'images', 'gender', 'perfumePrices', 'discountId', 'id'].sort());

	});


	it('The delete method destroy the record in the dabase, returns the product id', async () => {
		const perfumeCreated = await PerfumeService.add(...Object.values(perfumesData[0]));
		const result = await PerfumeService.delete(perfumeCreated.id);

		expect(typeof result).toBe('number');
		expect(result).toBe(1);
	});
});
