const path = require('path');
const dotenv = require('dotenv');

//Environment configuration
dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));
const conn = require(path.resolve(process.cwd(), 'src', 'db', 'connectionDB.js'));

//Services
const CategoryService = require(path.resolve(process.cwd(), 'src', 'services', 'category.service.js'));

// Testing data
const { categoriesData } = require('../testData');


describe('Category service', () => {

	beforeEach( async () => {
		await migration();
	});

	afterAll( async () => {
		await migration();
		conn.close();
	});

	it('The add method should add a new record in the Categories table of the database', async () => {
		const category = await CategoryService.add(...Object.values(categoriesData[0]));
		expect( category.name ).toBe(categoriesData[0].name);
	});

	it('The bulkAdd method should add multiple Categories records to the database', async () => {
		const categories = await CategoryService.bulkAdd(categoriesData);
		expect(Array.isArray(categories)).toBeTruthy();
		categories.forEach( (category, i) => {
			expect( category.name ).toBe(categoriesData[i].name);
		});
	});

	it('The find method must return all categories registered in the database',
		async () => {

			const allCategoriesCreated = await CategoryService.bulkAdd(categoriesData);
			const categoriesFinded = await CategoryService.find();

			expect(Array.isArray(categoriesFinded)).toBeTruthy();

			categoriesFinded.forEach( (category, i) => {
				expect(typeof category).toBe('object');
				expect(category.name).toBe(allCategoriesCreated[i].name);
			});
		}
	);

	it('The findOne method must return the category with the indicated id',
		async () => {
			const categoryCreated = await CategoryService.add(...Object.values(categoriesData[0]));
			const categoryFinded = await CategoryService.findOne(categoryCreated.id);

			expect(typeof categoryFinded).toBe('object');
			expect(categoryFinded.id).toEqual(categoryCreated.id);
			expect(categoryFinded.name).toEqual(categoryCreated.name);
		}
	);

	it('The update method should return an array with a value of 1 if the category has been updated',
		async () => {
			const category = await CategoryService.add(...Object.values(categoriesData[0]));
			const categoryUpdated = await CategoryService.update(category.id, {name: "new name"});

			expect(typeof categoryUpdated).toBe('object');
			expect(categoryUpdated.name).toBe("new name");
		}
	);

	it('The delete method should return a value of 1 if the category has been deleted',
		async () => {
			const category = await CategoryService.add(...Object.values(categoriesData[0]));
			const categoryDelete = await CategoryService.delete(category.id);

			expect(categoryDelete).toBe(1);
		}
	);
});
