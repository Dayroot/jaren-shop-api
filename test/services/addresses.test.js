const path = require('path');
const dotenv = require('dotenv');


dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));

//Service
const AddressService = require(path.resolve(process.cwd(), 'src', 'services', 'address.service.js'));
const UserService = require(path.resolve(process.cwd(), 'src', 'services', 'user.service.js'));

const userData = {
	firstName: 'Juanito',
	lastName: 'Perez',
	email: 'juenito@gmail.com',
	password: '12345',
}


const addressData = [
	{
		userId: 1,
		state: 'Norte de santander',
		city: 'Cucuta',
		streetAddress: 'avenida 1a #85d barrio Caobos',
		postalCode: '530001',
		propertyType: 'house',
		phoneNumber: '3164578632',
		fullname: 'Helena Blade',
	},
	{
		userId: 1,
		state: 'Antioquia',
		city: 'Medellin',
		streetAddress: 'avenida 17a #45-3 Centro',
		postalCode: '530001',
		propertyType: 'apartment',
		phoneNumber: '3164578632',
		fullname: 'Claudio Fonseca',
	},
]



describe('Address service', () => {

	beforeEach( async () => {
		await migration();
		await UserService.add(...Object.values(userData));
	});

	afterAll( async () => {
		await migration();
	});

	it('The "add" method registered a new address in the database', async () => {
		const address = await AddressService.add(...Object.values(addressData[0]));

		expect(typeof address).toBe('object');
		expect(Object.keys(address).sort()).toEqual(['id', 'userId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
		expect(address.userId).toBe(addressData[0].userId);
		expect(address.fullname).toBe(addressData[0].fullname);
		expect(address.state).toBe(addressData[0].state);
		expect(address.city).toBe(addressData[0].city);
		expect(address.postalCode).toBe(addressData[0].postalCode);
		expect(address.phoneNumber).toBe(addressData[0].phoneNumber);
		expect(address.propertyType).toBe(addressData[0].propertyType);
		expect(address.streetAddress).toBe(addressData[0].streetAddress);
	});

	it('The "bulkAdd" method registered multiple addresses in the database', async () => {
		const addresses = await AddressService.bulkAdd(addressData);

		expect(Array.isArray(addresses)).toBeTruthy();
		addresses.forEach( (address, i) => {
			expect(typeof address).toBe('object');
			expect(Object.keys(address).sort()).toEqual(['id', 'userId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
			expect(address.userId).toBe(addressData[i].userId);
			expect(address.fullname).toBe(addressData[i].fullname);
			expect(address.state).toBe(addressData[i].state);
			expect(address.city).toBe(addressData[i].city);
			expect(address.postalCode).toBe(addressData[i].postalCode);
			expect(address.phoneNumber).toBe(addressData[i].phoneNumber);
			expect(address.propertyType).toBe(addressData[i].propertyType);
			expect(address.streetAddress).toBe(addressData[i].streetAddress);
		});
	});

	it('The "findOne" method return the address that corresponds to the id', async () => {
		const addressCreated = await AddressService.add(...Object.values(addressData[0]));
		const address = await AddressService.findOne(addressCreated.id);

		expect(typeof address).toBe('object');
		expect(Object.keys(address).sort()).toEqual(['id', 'userId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
		expect(address.userId).toBe(addressData[0].userId);
		expect(address.fullname).toBe(addressData[0].fullname);
		expect(address.state).toBe(addressData[0].state);
		expect(address.city).toBe(addressData[0].city);
		expect(address.postalCode).toBe(addressData[0].postalCode);
		expect(address.phoneNumber).toBe(addressData[0].phoneNumber);
		expect(address.propertyType).toBe(addressData[0].propertyType);
		expect(address.streetAddress).toBe(addressData[0].streetAddress);
	});

	it('The "find" method returns the records of all addresses in the database', async () => {
		await AddressService.bulkAdd(addressData);
		const addresses = await AddressService.find();

		expect(Array.isArray(addresses)).toBeTruthy();
		addresses.forEach( (address, i) => {
			expect(typeof address).toBe('object');
			expect(Object.keys(address).sort()).toEqual(['id', 'userId', 'state', 'city', 'streetAddress', 'postalCode', 'propertyType', 'phoneNumber', 'fullname'].sort());
			expect(address.userId).toBe(addressData[i].userId);
			expect(address.fullname).toBe(addressData[i].fullname);
			expect(address.state).toBe(addressData[i].state);
			expect(address.city).toBe(addressData[i].city);
			expect(address.postalCode).toBe(addressData[i].postalCode);
			expect(address.phoneNumber).toBe(addressData[i].phoneNumber);
			expect(address.propertyType).toBe(addressData[i].propertyType);
			expect(address.streetAddress).toBe(addressData[i].streetAddress);
		});
	});

	it('The "update" method update the address data in the database', async () => {
		const addressCreated = await AddressService.add(...Object.values(addressData[0]));
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
		const addressCreated = await AddressService.add(...Object.values(addressData[0]));
		const result = await AddressService.delete(addressCreated.id);
		expect(result).toBe(1);
	});

});
