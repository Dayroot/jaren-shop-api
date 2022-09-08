const path = require('path');
const dotenv = require('dotenv');

//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));

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

	beforeEach( async () => {
		await migration();
	});

	afterAll( async () => {
		await migration();
	});

	it('The add method should add a new record in the ProductImages table of the database', async () => {
		const productImage = await ProductImageService.add(...Object.values(productImagesData[0]));
		expect( typeof productImage).toBe('object');
		expect( productImage.url ).toBe(productImagesData[0].url);
	});

	it('The bulkAdd method should add multiple ProductImages records to the database', async () => {
		const productImages = await ProductImageService.bulkAdd(productImagesData);
		expect(Array.isArray(productImages)).toBeTruthy();
		productImages.forEach( (productImage, i) => {
			expect( typeof productImage).toBe('object');
			expect( productImage.url ).toBe(productImagesData[i].url);
		});
	});

	it('The find method must return all productImages registered in the database',
		async () => {

			const allProductImagesCreated = await ProductImageService.bulkAdd(productImagesData);
			const productImagesFinded = await ProductImageService.find();

			expect(Array.isArray(productImagesFinded)).toBeTruthy();
			productImagesFinded.forEach( (productImage, i) => {
				expect( typeof productImage).toBe('object');
				expect(productImage.url).toBe(allProductImagesCreated[i].url);
			});
		}
	);

	it('The findOne method must return the productImage with the indicated id',
		async () => {
			const productImageCreated = await ProductImageService.add(...Object.values(productImagesData[0]));
			const productImageFinded = await ProductImageService.findOne(productImageCreated.id);

			expect( typeof productImageFinded).toBe('object');
			expect(productImageFinded.id).toEqual(productImageCreated.id);
			expect(productImageFinded.url).toEqual(productImageCreated.url);
		}
	);

	it('The update method should return an array with a value of 1 if the productImage has been updated',
		async () => {
			const productImage = await ProductImageService.add(...Object.values(productImagesData[0]));
			const productImageUpdated = await ProductImageService.update(productImage.id, {url: 'http://changed-image.png'});

			expect( typeof productImageUpdated).toBe('object');
			expect(productImageUpdated.url).toBe('http://changed-image.png');
		}
	);

	it('The delete method should return a value of 1 if the productImage has been deleted',
		async () => {
			const productImage = await ProductImageService.add(...Object.values(productImagesData[0]));
			const numberProductImagesDelete = await ProductImageService.delete(productImage.id);

			expect(numberProductImagesDelete).toBe(1);
		}
	);
});
