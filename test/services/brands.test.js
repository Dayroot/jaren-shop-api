const path = require('path');
const dotenv = require('dotenv');

//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));
const conn = require(path.resolve(process.cwd(), 'src', 'db', 'connectionDB.js'));


//Services
const BrandService = require(path.resolve(process.cwd(), 'src', 'services', 'brand.service.js'));

//Data
const { brandsData } = require('../testData');


describe('Brand service', () => {

	beforeEach( async () => {
		await migration();
	});

	afterAll( async () => {
		await migration();
		conn.close();
	});

	it('The add method should add a new record in the Brands table of the database', async () => {
		const brand = await BrandService.add(...Object.values(brandsData[0]));
		expect( typeof brand ).toBe('object');
		expect( brand.name ).toEqual(brandsData[0].name);
		expect( brand.logoUrl ).toEqual(brandsData[0].logoUrl);
	});

	it('The bulkAdd method should add multiple Brands records to the database', async () => {
		const brands = await BrandService.bulkAdd(brandsData);
		expect(Array.isArray(brands)).toBeTruthy();
		brands.forEach( (brand, i) => {
			expect( typeof brand ).toBe('object');
			expect( brand.name ).toEqual(brandsData[i].name);
			expect( brand.logoUrl ).toEqual(brandsData[i].logoUrl);
		});
	});

	it('The find method must return all brands registered in the database',
		async () => {
			const allBrandsCreated = await BrandService.bulkAdd(brandsData);
			const brandsFinded = await BrandService.find();

			expect(Array.isArray(allBrandsCreated)).toBeTruthy();
			brandsFinded.forEach( (brand, i) => {
				expect( typeof brand ).toBe('object');
				expect(brand.name).toEqual(allBrandsCreated[i].name);
			});
		}
	);

	it('The findOne method must return the brand with the indicated id',
		async () => {
			const brandCreated = await BrandService.add(...Object.values(brandsData[0]));
			const brandFinded = await BrandService.findOne(brandCreated.id);
			expect( typeof brandFinded ).toBe('object');
			expect(brandFinded.id).toEqual(brandCreated.id);
			expect(brandFinded.name).toEqual(brandCreated.name);
		}
	);

	it('The findOrCreate method must return the brand with the indicated name or create it if it does not exist',
		async () => {
			const brand = await BrandService.findOrCreate(...Object.values(brandsData[0]));
			expect( typeof brand ).toBe('object');
			expect(brand.name).toEqual(brandsData[0].name);
		}
	);

	it('The update method should return the brand updated',
		async () => {
			const brand = await BrandService.add(...Object.values(brandsData[0]));
			const brandUpdated = await BrandService.update(brand.id, {name:"name changed"});

			expect( typeof brandUpdated ).toBe('object');
			expect(brandUpdated.name).toBe("name changed");
		}
	);

	it('The delete method should return a value of 1 if the brand has been deleted',
		async () => {
			const brand = await BrandService.add(...Object.values(brandsData[0]));
			const numberBrandsDelete = await BrandService.delete(brand.id);
			expect(numberBrandsDelete).toBe(1);
		}
	);
});
