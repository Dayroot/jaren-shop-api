const path = require('path');
const dotenv = require('dotenv');

//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const conn = require(path.resolve(process.cwd(), 'src', 'db', 'connectionDB.js'));

//Models
const BrandModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'brand.model.js'));

//Services
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


describe('Brand service', () => {

	beforeAll(() => {
		service = new BrandService();
	});

	beforeEach( async () => {
		await conn.sync({force: true});
	});

	afterAll( async () => {
		await conn.sync({force: true});
	});

	it('The add method should add a new record in the Brands table of the database', async () => {
		const brand = await service.add(...Object.values(brandsData[0]));
		expect( brand instanceof BrandModel).toBeTruthy();
		expect( brand.name ).toEqual(brandsData[0].name);
		expect( brand.logoUrl ).toEqual(brandsData[0].logoUrl);
	});

	it('The bulkAdd method should add multiple Brands records to the database', async () => {
		const brands = await service.bulkAdd(brandsData);
		brands.forEach( (brand, i) => {
			expect( brand instanceof BrandModel).toBeTruthy();
			expect( brand.name ).toEqual(brandsData[i].name);
			expect( brand.logoUrl ).toEqual(brandsData[i].logoUrl);
		});
	});

	it('The find method must return all brands registered in the database',
		async () => {
			const promises = brandsData.map(async (brand) => {
				return await service.add(...Object.values(brand));
			});
			const allBrandsCreated = await Promise.all(promises);
			const brandsFinded = await service.find();
			brandsFinded.forEach( (brand, i) => {
				expect( brand instanceof BrandModel).toBeTruthy();
				expect(brand.name).toEqual(allBrandsCreated[i].name);
			});
		}
	);

	it('The findOne method must return the brand with the indicated id',
		async () => {
			const brandCreated = await service.add(...Object.values(brandsData[0]));
			const brandFinded = await service.findOne(brandCreated.id);
			expect( brandFinded instanceof BrandModel).toBeTruthy();
			expect(brandFinded.id).toEqual(brandCreated.id);
			expect(brandFinded.name).toEqual(brandCreated.name);
		}
	);

	it('The findOrCreate method must return the brand with the indicated name or create it if it does not exist',
		async () => {
			const result = await service.findOrCreate(...Object.values(brandsData[0]));
			expect(result[1]).toBeTruthy();
			expect( result[0] instanceof BrandModel).toBeTruthy();
			expect(result[0].name).toEqual(brandsData[0].name);
		}
	);

	it('The update method should return an array with a value of 1 if the brand has been updated',
		async () => {
			const brand = await service.add(...Object.values(brandsData[0]));
			const numberBrandsUpdated = await service.update(brand.id, {name:"name changed"});
			const brandUpdated = await service.findOne(brand.id);

			expect(numberBrandsUpdated).toEqual([1]);
			expect(brandUpdated.name).toBe("name changed");
		}
	);

	it('The delete method should return a value of 1 if the brand has been deleted',
		async () => {
			const brand = await service.add(...Object.values(brandsData[0]));
			const numberBrandsDelete = await service.delete(brand.id);
			const brandFinded = await service.findOne(brand.id);

			expect(numberBrandsDelete).toBe(1);
			expect(brandFinded).toBeNull();
		}
	);
});
