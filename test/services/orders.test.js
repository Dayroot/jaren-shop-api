const path = require('path');
const dotenv = require('dotenv');


dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));
const conn = require(path.resolve(process.cwd(), 'src', 'db', 'connectionDB.js'));

//Service
const UserService = require(path.resolve(process.cwd(), 'src', 'services', 'user.service.js'));
const BrandService = require(path.resolve(process.cwd(), 'src', 'services', 'brand.service.js'));
const ProductService = require(path.resolve(process.cwd(), 'src', 'services', 'product.service.js'));
const OrderService = require(path.resolve(process.cwd(), 'src', 'services', 'order.service.js'));
const CategoryService = require(path.resolve(process.cwd(), 'src', 'services', 'category.service.js'));

const userData = {
	firstName: 'Juanito',
	lastName: 'Perez',
	email: 'juenito@gmail.com',
	password: '12345',
};

const productsData =  [
	{
		brandId: 1,
		name: "Sauvage",
		description: "The strong gust of Citrus in Sauvage Eau de Toilette is powerfully.",
		images: [{url:"http://suavage1.png"}, {url:"http://suavage2.png"}, {url:"http://suavage3.png"}],
		gender: 'men',
		variants: [
			{size:"30", price: 350.01, SKU:"DIO-SAU-30", UPC:"145836584321", stock: 10},
			{size:"60", price: 450.01, SKU:"DIO-SAU-60", UPC:"145836584322", stock: 18},
			{size:"100", price: 649.99, SKU:"DIO-SAU-100", UPC:"145836584323", stock: 12}
		],
		categoryId: 1,
	},
	{
		brandId: 1,
		name: "BLEU DE CHANEL",
		description: "An ode to masculine freedom expressed in an aromatic-woody fragrance with a captivating trail.",
		images: [{url:"http://blue1.png"}, {url:"http://blue2.png"}, {url:"http://blue3.png"}],
		gender: 'men',
		variants: [
			{size:"30", price: 550.01, SKU:"CHA-BLE-30", UPC:"145836584324", stock: 80},
			{size:"60", price: 850.01, SKU:"CHA-BLE-60", UPC:"145836584325", stock: 48},
			{size:"100", price: 1149.99, SKU:"CHA-BLE-100", UPC:"145836584326", stock: 242}
		],
		categoryId: 1,
	},
	{
		brandId: 1,
		name: "Black Opium",
		description: "The original Eau de Parfum. Featuring black coffee and sensual vanilla. Addictive and energising.",
		images: [{url:"http://opium1.png"}, {url:"http://opium2.png"}, {url:"http://opium3.png"}],
		gender: 'woman',
		variants: [
			{size:"30", price: 1250.01, SKU:"YSL-BOP-30", UPC:"145836584327", stock: 260},
			{size:"60", price: 1950.01, SKU:"YSL-BOP-60", UPC:"145836584328", stock: 187},
			{size:"100", price: 2349.99, SKU:"YSL-BOP-100", UPC:"145836584329", stock: 122}
		],
		categoryId: 1,
	}
];


const brandData = {
	name: "DIOR",
	logoUrl: "http://diorlogo.png",
}

const ordersData = [
	{
		userId: 1,
		address: {
			state: 'Norte de santander',
			city: 'Cucuta',
			streetAddress: 'avenida 1a #85d barrio Caobos',
			postalCode: '530001',
			propertyType: 'house',
			phoneNumber: '3164578632',
			fullname: 'Helena Blade',
		},
		status: 'pending',
		details: [
			{
				productId: 1,
				SKU: "DIO-SAU-30",
				price: 350.01,
				quantity: 1,
				overview: 'perfume for men Sauvage 30ml brand DIOR',
			},
			{
				productId: 2,
				SKU: "CHA-BLE-100",
				price: 1149.99,
				quantity: 4,
				overview: 'perfume for men BLEU DE CHANEL 100ml brand CHANEL',
			},
			{
				productId: 3,
				SKU:"YSL-BOP-60",
				price: 1950.01,
				quantity: 2,
				overview: 'perfume for woman Black Opium 60ml brand YVES SAINT LAURENT',
			}
		],
	},
	{
		userId: 1,
		address: {
			state: 'Norte de santander',
			city: 'Cucuta',
			streetAddress: 'avenida 1a #85d barrio Caobos',
			postalCode: '530001',
			propertyType: 'house',
			phoneNumber: '3164578632',
			fullname: 'Helena Blade',
		},
		status: 'pending',
		details: [
			{
				productId: 1,
				SKU: "DIO-SAU-30",
				price: 350.01,
				quantity: 1,
				overview: 'perfume for men Sauvage 30ml brand DIOR',
			},
			{
				productId: 2,
				SKU: "CHA-BLE-100",
				price: 1149.99,
				quantity: 4,
				overview: 'perfume for men BLEU DE CHANEL 100ml brand CHANEL',
			},
		],
	},
];

describe('Order service', () => {

	beforeEach( async () => {
		await migration();
		await UserService.add(...Object.values(userData));
		await BrandService.add(...Object.values(brandData));
		await CategoryService.add('perfumes');
		await ProductService.bulkAdd(productsData);
	});

	afterAll( async () => {
		await migration();
		conn.close();
	});

	it('The "add" method registered a new order in data base and returns the order data', async () => {
		const order = await OrderService.add(...Object.values(ordersData[0]));

		expect(typeof order).toBe('object');
		expect(Object.keys(order).sort()).toEqual(['id', 'userId','orderDate', 'statusChangeDate', 'status', 'details', 'address'].sort());

		expect(typeof order.address).toBe('object');
		expect(Object.keys(order.address).sort()).toEqual(['addressId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());

		expect(Array.isArray(order.details)).toBeTruthy();

		order.details.forEach( (item, i) => {
			expect(typeof item).toBe('object');
			expect(Object.keys(item).sort()).toEqual(['productId', 'ref',  'quantity', 'price', 'SKU', 'overview', 'image'].sort());
			expect(item.quantity).toBe(ordersData[0].details[i].quantity);
			expect(item.price).toBe(ordersData[0].details[i].price);
			expect(item.SKU).toBe(ordersData[0].details[i].SKU);
			expect(item.UPC).toBe(ordersData[0].details[i].UPC);
		});
	});

	it('The "findOne" method return the order that corresponds to the indicated id', async () => {
		const purchaseCreated = await OrderService.add(...Object.values(ordersData[0]));
		const order = await OrderService.findOne(purchaseCreated.id);

		expect(typeof order).toBe('object');
		expect(Object.keys(order).sort()).toEqual(['id', 'userId','orderDate', 'statusChangeDate', 'status', 'details', 'address'].sort());

		expect(typeof order.address).toBe('object');
		expect(Object.keys(order.address).sort()).toEqual(['addressId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());

		expect(Array.isArray(order.details)).toBeTruthy();

		order.details.forEach( (item, i) => {
			expect(typeof item).toBe('object');
			expect(Object.keys(item).sort()).toEqual(['productId', 'ref',  'quantity', 'price', 'SKU', 'overview', 'image'].sort());
			expect(item.quantity).toBe(ordersData[0].details[i].quantity);
			expect(item.price).toBe(ordersData[0].details[i].price);
			expect(item.SKU).toBe(ordersData[0].details[i].SKU);
			expect(item.UPC).toBe(ordersData[0].details[i].UPC);
		});
	});

	it('The "bulkAdd" method registered multiple purchases in data base and returns the order data', async () => {
		const orders = await OrderService.bulkAdd(ordersData);

		expect(Array.isArray(orders)).toBeTruthy();
		expect(orders.length).toBe(2);

		orders.forEach((order) => {
			expect(typeof order).toBe('object');
			expect(Object.keys(order).sort()).toEqual(['id', 'userId','orderDate', 'statusChangeDate', 'status', 'details', 'address'].sort());

			expect(typeof order.address).toBe('object');
			expect(Object.keys(order.address).sort()).toEqual(['addressId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());

			expect(Array.isArray(order.details)).toBeTruthy();

			order.details.forEach( (item, i) => {
				expect(typeof item).toBe('object');
				expect(Object.keys(item).sort()).toEqual(['productId', 'ref',  'quantity', 'price', 'SKU', 'overview', 'image'].sort());
				expect(item.quantity).toBe(ordersData[0].details[i].quantity);
				expect(item.price).toBe(ordersData[0].details[i].price);
				expect(item.SKU).toBe(ordersData[0].details[i].SKU);
				expect(item.UPC).toBe(ordersData[0].details[i].UPC);
			});
		});
	});

	it('The "find" method returns all purchases that match the indicated parameter', async () => {
		await OrderService.bulkAdd(ordersData);
		const orders = await OrderService.find({userId: 1});


		expect(Array.isArray(orders)).toBeTruthy();
		expect(orders.length).toBe(2);

		orders.forEach((order) => {
			expect(typeof order).toBe('object');
			expect(Object.keys(order).sort()).toEqual(['id', 'userId','orderDate', 'statusChangeDate', 'status', 'details', 'address'].sort());

			expect(typeof order.address).toBe('object');
			expect(Object.keys(order.address).sort()).toEqual(['addressId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());

			expect(Array.isArray(order.details)).toBeTruthy();

			order.details.forEach( (item, i) => {
				expect(typeof item).toBe('object');
				expect(Object.keys(item).sort()).toEqual(['productId', 'ref',  'quantity', 'price', 'SKU', 'overview', 'image'].sort());
				expect(item.quantity).toBe(ordersData[0].details[i].quantity);
				expect(item.price).toBe(ordersData[0].details[i].price);
				expect(item.SKU).toBe(ordersData[0].details[i].SKU);
				expect(item.UPC).toBe(ordersData[0].details[i].UPC);
			});
		});
	});

	it('The "update" method updates the order with the indicated data', async () => {
		const orderCreated = await OrderService.add(...Object.values(ordersData[0]));
		const order = await OrderService.update(orderCreated.id, {
			status: 'dispatched',
			details: [
				{
					ref: 1,
					overview: "Updated overview",
				}
			]
		});

		expect(typeof order).toBe('object');
		expect(Object.keys(order).sort()).toEqual(['id', 'userId','orderDate', 'statusChangeDate', 'status', 'details', 'address'].sort());
		expect(orderCreated.status).toBe('pending');
		expect(order.status).toBe('dispatched');
		expect(Array.isArray(order.details)).toBeTruthy();
		expect(order.details[0].ref).toBe(1);
		expect(order.details[0].overview).toBe("Updated overview");
	});

	it('The "update" method updates the order with the indicated data', async () => {
		const orderCreated = await OrderService.add(...Object.values(ordersData[0]));
		const order = await OrderService.update(orderCreated.id, {
			status: 'dispatched',
		});

		expect(typeof order).toBe('object');
		expect(Object.keys(order).sort()).toEqual(['id', 'userId','orderDate', 'statusChangeDate', 'status', 'details', 'address'].sort());
		expect(orderCreated.status).toBe('pending');
		expect(order.status).toBe('dispatched');
		expect(Array.isArray(order.details)).toBeTruthy();
	});

	it('The "update" method updates the order with the indicated data', async () => {
		const orderCreated = await OrderService.add(...Object.values(ordersData[0]));
		const order = await OrderService.update(orderCreated.id, {
			details: [
				{
					ref: 1,
					overview: "Updated overview",
				}
			]
		});

		expect(typeof order).toBe('object');
		expect(Object.keys(order).sort()).toEqual(['id', 'userId','orderDate', 'statusChangeDate', 'status', 'details', 'address'].sort());
		expect(Array.isArray(order.details)).toBeTruthy();
		expect(order.details[0].ref).toBe(1);
		expect(order.details[0].overview).toBe("Updated overview");
	});

	it('The "delete" method delete the order with the indicated id', async () => {
		const purchaseCreated = await OrderService.add(...Object.values(ordersData[0]));
		const result = await OrderService.delete(purchaseCreated.id);

		expect(result).toBe(1);

	});

});
