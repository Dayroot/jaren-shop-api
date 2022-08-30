
const path = require('path');
const dotenv = require('dotenv');

//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const conn = require('../src/db/connectionDB');

//Models
const BrandModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'brand.model.js'));

//Services
const BrandService = require(path.resolve(process.cwd(), 'src', 'services', 'brand.service.js'));
const ProductService = require(path.resolve(process.cwd(), 'src', 'services', 'product.service.js'));



const productsData = [
	{
		brand: {
			name: "DIOR",
			logoUrl: "http://diorlogo.png",
		},
		name: "Sauvage",
		description: "The strong gust of Citrus in Sauvage Eau de Toilette is powerfully.",
		gender: "men",
		images: ["http://suavage1.png", "http://suavage2.png", "http://suavage3.png"],
		pricesPerSize: [{size:'30', price: 650.00}, {size:'60', price: 650.00}, {size:'100', price: 649.99}],
	},
	{
		brand: {
			name: "CHANEL",
			logoUrl: "http://chanellogo.png",
		},
		name: "BLEU DE CHANEL",
		description: "An ode to masculine freedom expressed in an aromatic-woody fragrance with a captivating trail.",
		gender: "men",
		images: ["http://blue1.png", "http://blue2.png", "http://blue3.png"],
		pricesPerSize: [{size:'60', price: 850.00}, {size:'100', price: 1350.00}, {size:'200', price: 2799.99}],
	},
	{
		brand: {
			name: "YVES SAINT LAURENT",
			logoUrl: "http://ivessaintlaurentlogo.png",
		},
		name: "Black Opium",
		description: "The original Eau de Parfum. Featuring black coffee and sensual vanilla. Addictive and energising.",
		gender: "women",
		images: ["http://opium1.png", "http://opium2.png", "http://opium3.png"],
		pricesPerSize: [{size:'80', price: 1199.99}, {size:'100', price: 1999.99}, {size:'200', price: 3400.00}],
	}
];

let service;
describe('Services testing', () => {
	describe('Brand service', () => {

		beforeAll(() => {
			service = new BrandService();
		});

		beforeEach( async () => {
			await conn.sync({force: true});
		});
		it('The add method should add a new record in the Brands table of the database', async () => {
			const brand = await service.add(...Object.values(productsData[0].brand));
			expect( brand instanceof BrandModel).toBeTruthy();
			expect( brand.name ).toEqual(productsData[0].brand.name);
			expect( brand.logoUrl ).toEqual(productsData[0].brand.logoUrl);
		});

		it('The bulkAdd method should add multiple Brands records to the database', async () => {
			const brandsData = productsData.map(product => product.brand);
			const brands = await service.bulkAdd(brandsData);
			brands.forEach( (brand, i) => {
				expect( brand instanceof BrandModel).toBeTruthy();
				expect( brand.name ).toEqual(productsData[i].brand.name);
				expect( brand.logoUrl ).toEqual(productsData[i].brand.logoUrl);
			});
		});

		it('The find method must return all brands registered in the database',
			async () => {
				const promises = productsData.map(async (product) => {
					return await service.add(...Object.values(product.brand));
				});
				const allBrandsCreated = await Promise.all(promises);
				const brandsFinded = await service.find();
				brandsFinded.forEach( (brand, i) => {
					expect( brand instanceof BrandModel).toBeTruthy();
					expect(brand.name).toEqual(allBrandsCreated[i].name);
				});
			}
		);

		it('The findOne method must return the brand with the indicated name',
			async () => {
				const brandCreated = await service.add(...Object.values(productsData[0].brand));
				const brandFinded = await service.findOne(brandCreated.name);
				expect( brandFinded instanceof BrandModel).toBeTruthy();
				expect(brandFinded.name).toEqual(brandCreated.name);
			}
		);

		it('The findOrCreate method must return the mark with the indicated name or create it if it does not exist',
			async () => {
				const result = await service.findOrCreate(...Object.values(productsData[0].brand));
				expect(result[1]).toBeTruthy();
				expect( result[0] instanceof BrandModel).toBeTruthy();
				expect(result[0].name).toEqual(productsData[0].brand.name);
			}
		);

		it('The update method should return an array with a value of 1 if the brand has been updated',
			async () => {
				const brand = await service.add(...Object.values(productsData[0].brand));
				const numberBrandsUpdated = await service.update(brand.id, {name:"name changed"});
				const brandUpdated = await service.findOne("name changed");

				expect(numberBrandsUpdated).toEqual([1]);
				expect(brandUpdated.name).toBe("name changed");
			}
		);

		it('The delete method should return a value of 1 if the brand has been deleted',
			async () => {
				const brand = await service.add(...Object.values(productsData[0].brand));
				const numberBrandsDelete = await service.delete(brand.id);
				const brandFinded = await service.findOne(brand.name);

				expect(numberBrandsDelete).toBe(1);
				expect(brandFinded).toBeNull();
			}
		);
	});
});
