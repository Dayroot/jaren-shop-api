const path = require('path');
const dotenv = require('dotenv');


dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));
const conn = require(path.resolve(process.cwd(), 'src', 'db', 'connectionDB.js'));

//Service
const AddressService = require(path.resolve(process.cwd(), 'src', 'services', 'address.service.js'));
const UserService = require(path.resolve(process.cwd(), 'src', 'services', 'user.service.js'));

//Data
const { addressesData, usersData } = require('../testData');

describe('Address service', () => {

	beforeEach( async () => {
		await migration();
		await UserService.add(...Object.values(usersData[0]));
	});

	afterAll( async () => {
		await migration();
		conn.close();
	});

	it('The "add" method registered a new address in the database', async () => {
		const address = await AddressService.add(...Object.values(addressesData[0]));

		expect(typeof address).toBe('object');
		expect(Object.keys(address).sort()).toEqual(['id', 'userId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
		expect(address.userId).toBe(addressesData[0].userId);
		expect(address.fullname).toBe(addressesData[0].fullname);
		expect(address.state).toBe(addressesData[0].state);
		expect(address.city).toBe(addressesData[0].city);
		expect(address.postalCode).toBe(addressesData[0].postalCode);
		expect(address.phoneNumber).toBe(addressesData[0].phoneNumber);
		expect(address.propertyType).toBe(addressesData[0].propertyType);
		expect(address.streetAddress).toBe(addressesData[0].streetAddress);
	});

	it('The "bulkAdd" method registered multiple addresses in the database', async () => {
		const addresses = await AddressService.bulkAdd(addressesData);

		expect(Array.isArray(addresses)).toBeTruthy();
		addresses.forEach( (address, i) => {
			expect(typeof address).toBe('object');
			expect(Object.keys(address).sort()).toEqual(['id', 'userId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
			expect(address.userId).toBe(addressesData[i].userId);
			expect(address.fullname).toBe(addressesData[i].fullname);
			expect(address.state).toBe(addressesData[i].state);
			expect(address.city).toBe(addressesData[i].city);
			expect(address.postalCode).toBe(addressesData[i].postalCode);
			expect(address.phoneNumber).toBe(addressesData[i].phoneNumber);
			expect(address.propertyType).toBe(addressesData[i].propertyType);
			expect(address.streetAddress).toBe(addressesData[i].streetAddress);
		});
	});

	it('The "findOne" method return the address that corresponds to the id', async () => {
		const addressCreated = await AddressService.add(...Object.values(addressesData[0]));
		const address = await AddressService.findOne(addressCreated.id);

		expect(typeof address).toBe('object');
		expect(Object.keys(address).sort()).toEqual(['id', 'userId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
		expect(address.userId).toBe(addressesData[0].userId);
		expect(address.fullname).toBe(addressesData[0].fullname);
		expect(address.state).toBe(addressesData[0].state);
		expect(address.city).toBe(addressesData[0].city);
		expect(address.postalCode).toBe(addressesData[0].postalCode);
		expect(address.phoneNumber).toBe(addressesData[0].phoneNumber);
		expect(address.propertyType).toBe(addressesData[0].propertyType);
		expect(address.streetAddress).toBe(addressesData[0].streetAddress);
	});

	it('The "find" method returns the records of all addresses in the database', async () => {
		await AddressService.bulkAdd(addressesData);
		const addresses = await AddressService.find();

		expect(Array.isArray(addresses)).toBeTruthy();
		addresses.forEach( (address, i) => {
			expect(typeof address).toBe('object');
			expect(Object.keys(address).sort()).toEqual(['id', 'userId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
			expect(address.userId).toBe(addressesData[i].userId);
			expect(address.fullname).toBe(addressesData[i].fullname);
			expect(address.state).toBe(addressesData[i].state);
			expect(address.city).toBe(addressesData[i].city);
			expect(address.postalCode).toBe(addressesData[i].postalCode);
			expect(address.phoneNumber).toBe(addressesData[i].phoneNumber);
			expect(address.propertyType).toBe(addressesData[i].propertyType);
			expect(address.streetAddress).toBe(addressesData[i].streetAddress);
		});
	});

	it('The "update" method update the address data in the database', async () => {
		const addressCreated = await AddressService.add(...Object.values(addressesData[0]));
		const address = await AddressService.update(addressCreated.id, {
			fullname: 'other person name',
			city: 'Tangamandapio',
		})

		expect(typeof address).toBe('object');
		expect(Object.keys(address).sort()).toEqual(['id', 'userId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
		expect(address.fullname).toBe('other person name');
		expect(address.city).toBe('Tangamandapio');
	});

	it('The "delete" method delete the address data in the database', async () => {
		const addressCreated = await AddressService.add(...Object.values(addressesData[0]));
		const result = await AddressService.delete(addressCreated.id);
		expect(result).toBe(1);
	});

});
