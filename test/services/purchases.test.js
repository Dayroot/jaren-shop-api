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
const PurchaseService = require(path.resolve(process.cwd(), 'src', 'services', 'purchase.service.js'));
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

const purchasesData = [
	{
		userId: 1,
		status: 'pending',
		purchase_products: [
			{
				productId: 1,
				quantity: 1,
				overview: 'perfume for men Sauvage 60ml brand DIOR',
			},
			{
				productId: 2,
				quantity: 4,
				overview: 'perfume for men BLEU DE CHANEL 100ml brand CHANEL',
			},
			{
				productId: 3,
				quantity: 2,
				overview: 'perfume for woman Black Opium 120ml brand YVES SAINT LAURENT',
			}
		],
	},
	{
		userId: 1,
		status: 'pending',
		purchase_products: [
			{
				productId: 1,
				quantity: 5,
				overview: 'perfume for men Sauvage 60ml brand DIOR',
			},
			{
				productId: 2,
				quantity: 2,
				overview: 'perfume for men BLEU DE CHANEL 100ml brand CHANEL',
			},
			{
				productId: 3,
				quantity: 12,
				overview: 'perfume for woman Black Opium 120ml brand YVES SAINT LAURENT',
			}
		],
	},
]

describe('Purchase service', () => {

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

	it('The "add" method registered a new purchase in data base and returns the purchase data', async () => {
		const purchase = await PurchaseService.add(...Object.values(purchasesData[0]));

		expect(typeof purchase).toBe('object');
		expect(Object.keys(purchase).sort()).toEqual(['id', 'userId','purchaseDate', 'statusChangeDate', 'status', 'purchase_products'].sort());
		expect(Array.isArray(purchase.purchase_products)).toBeTruthy();

		purchase.purchase_products.forEach( (item, i) => {
			expect(typeof item).toBe('object');
			expect(Object.keys(item).sort()).toEqual(['ref',  'quantity', 'overview', 'product'].sort());
			expect(item.quantity).toBe(purchasesData[0].purchase_products[i].quantity);
			expect(typeof item.product).toBe('object');
			expect(Object.keys(item.product).sort()).toEqual(['id', 'brand', 'images', 'discountId', 'name', 'description', 'stock', 'gender', 'prices', 'category'].sort());
			expect(item.product.name).toBe(productsData[i].name);
			expect(item.product.description).toBe(productsData[i].description);
			expect(item.product.stock).toBe(productsData[i].stock);
		});
	});

	it('The "findOne" method return the purchase that corresponds to the indicated id', async () => {
		const purchaseCreated = await PurchaseService.add(...Object.values(purchasesData[0]));
		const purchase = await PurchaseService.findOne(purchaseCreated.id);

		expect(typeof purchase).toBe('object');
		expect(Object.keys(purchase).sort()).toEqual(['id', 'userId','purchaseDate', 'statusChangeDate', 'status', 'purchase_products'].sort());
		expect(Array.isArray(purchase.purchase_products)).toBeTruthy();

		purchase.purchase_products.forEach( (item, i) => {
			expect(typeof item).toBe('object');
			expect(Object.keys(item).sort()).toEqual(['ref',  'quantity', 'overview', 'product'].sort());
			expect(item.quantity).toBe(purchasesData[0].purchase_products[i].quantity);
			expect(typeof item.product).toBe('object');
			expect(Object.keys(item.product).sort()).toEqual(['id', 'brand', 'images', 'discountId', 'name', 'description', 'stock', 'gender', 'prices', 'category'].sort());
			expect(item.product.name).toBe(productsData[i].name);
			expect(item.product.description).toBe(productsData[i].description);
			expect(item.product.stock).toBe(productsData[i].stock);
		});
	});

	it('The "bulkAdd" method registered multiple purchases in data base and returns the purchase data', async () => {
		const purchases = await PurchaseService.bulkAdd(purchasesData);

		expect(Array.isArray(purchases)).toBeTruthy();
		expect(purchases.length).toBe(2);

		purchases.forEach((purchase, j) => {
			expect(typeof purchase).toBe('object');
			expect(Object.keys(purchase).sort()).toEqual(['id', 'userId','purchaseDate', 'statusChangeDate', 'status', 'purchase_products'].sort());
			expect(Array.isArray(purchase.purchase_products)).toBeTruthy();

			purchase.purchase_products.forEach( (item, i) => {
				expect(typeof item).toBe('object');
				expect(Object.keys(item).sort()).toEqual(['ref',  'quantity', 'overview', 'product'].sort());
				expect(typeof item.product).toBe('object');
				expect(Object.keys(item.product).sort()).toEqual(['id', 'brand', 'images', 'discountId', 'name', 'description', 'stock', 'gender', 'prices', 'category'].sort());
				expect(item.product.name).toBe(productsData[i].name);
				expect(item.product.description).toBe(productsData[i].description);
				expect(item.product.stock).toBe(productsData[i].stock);
			});
		});
	});

	it('The "find" method returns all purchases that match the indicated parameter', async () => {
		await PurchaseService.bulkAdd(purchasesData);
		const purchases = await PurchaseService.find({userId: 1});


		expect(Array.isArray(purchases)).toBeTruthy();
		expect(purchases.length).toBe(2);

		purchases.forEach((purchase, j) => {
			expect(typeof purchase).toBe('object');
			expect(Object.keys(purchase).sort()).toEqual(['id', 'userId','purchaseDate', 'statusChangeDate', 'status', 'purchase_products'].sort());
			expect(Array.isArray(purchase.purchase_products)).toBeTruthy();

			purchase.purchase_products.forEach( (item, i) => {
				expect(typeof item).toBe('object');
				expect(Object.keys(item).sort()).toEqual(['ref',  'quantity', 'overview', 'product'].sort());
				expect(typeof item.product).toBe('object');
				expect(Object.keys(item.product).sort()).toEqual(['id', 'brand', 'images', 'discountId', 'name', 'description', 'stock', 'gender', 'prices', 'category'].sort());
				expect(item.product.name).toBe(productsData[i].name);
				expect(item.product.description).toBe(productsData[i].description);
				expect(item.product.stock).toBe(productsData[i].stock);
			});
		});
	});

	it('The "update" method updates the purchase with the indicated data', async () => {
		const purchaseCreated = await PurchaseService.add(...Object.values(purchasesData[0]));
		const purchase = await PurchaseService.update(purchaseCreated.id, {
			status: 'dispatched',
		});

		expect(typeof purchase).toBe('object');
		expect(Object.keys(purchase).sort()).toEqual(['id', 'userId','purchaseDate', 'statusChangeDate', 'status', 'purchase_products'].sort());
		expect(purchaseCreated.status).toBe('pending');
		expect(purchase.status).toBe('dispatched');
		expect(Array.isArray(purchase.purchase_products)).toBeTruthy();

	});

	it('The "delete" method delete the purchase with the indicated id', async () => {
		const purchaseCreated = await PurchaseService.add(...Object.values(purchasesData[0]));
		const result = await PurchaseService.delete(purchaseCreated.id);

		expect(result).toBe(1);

	});

});
