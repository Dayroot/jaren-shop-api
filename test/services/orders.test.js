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

//Testing data
const { ordersData, productsData, brandsData, usersData } = require('../testData');

describe('Order service', () => {

	beforeEach( async () => {
		await migration();
		await UserService.add(...Object.values(usersData[0]));
		await BrandService.bulkAdd(brandsData);
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
		const orderCreated = await OrderService.add(...Object.values(ordersData[0]));
		const order = await OrderService.findOne(orderCreated.id);

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

		expect(order).toBeTruthy();
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
