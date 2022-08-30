const path = require('path');
const dotenv = require('dotenv');

//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const conn = require(path.resolve(process.cwd(), 'src', 'db', 'connectionDB.js'));

//Models
const ProductImageModel = require(path.resolve(process.cwd(), 'src', 'db', 'models', 'productImage.model.js'));

//Services
const ProductImageService = require(path.resolve(process.cwd(), 'src', 'services', 'productImage.service.js'));

const productImagesData = [
	{url: "http://productimage1.png"},
	{url: "http://productimage2.png"},
	{url: "http://productimage3.png"},
];


describe('ProductImage service', () => {
	beforeAll(() => {
		service = new ProductImageService();
	});

	beforeEach( async () => {
		await conn.sync({force: true});
	});

	afterAll( async () => {
		await conn.sync({force: true});
	});

	it('The add method should add a new record in the ProductImages table of the database', async () => {
		const productImage = await service.add(...Object.values(productImagesData[0]));
		expect( productImage instanceof ProductImageModel).toBeTruthy();
		expect( productImage.url ).toBe(productImagesData[0].url);
	});

	it('The bulkAdd method should add multiple ProductImages records to the database', async () => {
		const productImages = await service.bulkAdd(productImagesData);
		expect(Array.isArray(productImages)).toBeTruthy();
		productImages.forEach( (productImage, i) => {
			expect( productImage instanceof ProductImageModel).toBeTruthy();
			expect( productImage.url ).toBe(productImagesData[i].url);
		});
	});

	it('The find method must return all productImages registered in the database',
		async () => {

			const allProductImagesCreated = await service.bulkAdd(productImagesData);
			const productImagesFinded = await service.find();
			productImagesFinded.forEach( (productImage, i) => {
				expect( productImage instanceof ProductImageModel).toBeTruthy();
				expect(productImage.url).toBe(allProductImagesCreated[i].url);
			});
		}
	);

	it('The findOne method must return the productImage with the indicated id',
		async () => {
			const productImageCreated = await service.add(...Object.values(productImagesData[0]));
			const productImageFinded = await service.findOne(productImageCreated.id);
			expect( productImageFinded instanceof ProductImageModel).toBeTruthy();
			expect(productImageFinded.id).toEqual(productImageCreated.id);
			expect(productImageFinded.url).toEqual(productImageCreated.url);
		}
	);

	it('The update method should return an array with a value of 1 if the productImage has been updated',
		async () => {
			const productImage = await service.add(...Object.values(productImagesData[0]));
			const numberProductImagesUpdated = await service.update(productImage.id, {url: 'http://changed-image.png'});
			const productImageUpdated = await service.findOne(productImage.id);

			expect(numberProductImagesUpdated).toEqual([1]);
			expect(productImageUpdated.url).toBe('http://changed-image.png');
		}
	);

	it('The delete method should return a value of 1 if the productImage has been deleted',
		async () => {
			const productImage = await service.add(...Object.values(productImagesData[0]));
			const numberProductImagesDelete = await service.delete(productImage.id);
			const productImageFinded = await service.findOne(productImage.id);

			expect(numberProductImagesDelete).toBe(1);
			expect(productImageFinded).toBeNull();
		}
	);
});
