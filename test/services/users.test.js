const path = require('path');
const dotenv = require('dotenv');


dotenv.config (
	{ path: path.resolve(process.cwd(), 'environments', '.env.test') }
);

const migration = require(path.resolve(process.cwd(), 'src', 'db', 'modelAssociations.js'));
const conn = require(path.resolve(process.cwd(), 'src', 'db', 'connectionDB.js'));

//Service
const UserService = require(path.resolve(process.cwd(), 'src', 'services', 'user.service.js'));

// Testing data
const { usersData } = require('../testData');

describe('User service', () => {

	beforeEach( async () => {
		await migration();
	});

	afterAll( async () => {
		await migration();
		conn.close();
	});

	it('The "add" method registered a new user in the database', async () => {
		const user = await UserService.add(...Object.values(usersData[0]));

		expect(typeof user).toBe('object');
		expect(Object.keys(user).sort()).toEqual(['id', 'firstName', 'lastName', 'email', 'password', 'wishList', 'shoppingCart', 'registrationDate'].sort());
		expect(user.firstName).toBe(usersData[0].firstName);
		expect(user.lastName).toBe(usersData[0].lastName);
		expect(user.email).toBe(usersData[0].email);
	});

	it('The "bulkAdd" method registered multiple users in the database', async () => {
		const users = await UserService.bulkAdd(usersData);

		expect(Array.isArray(users)).toBeTruthy();
		users.forEach( (user, i) => {
			expect(Object.keys(user).sort()).toEqual(['id', 'firstName', 'lastName', 'email', 'password', 'wishList', 'shoppingCart', 'registrationDate'].sort());
			expect(user.firstName).toBe(usersData[i].firstName);
			expect(user.lastName).toBe(usersData[i].lastName);
			expect(user.email).toBe(usersData[i].email);
		});
	});

	it('The "findOne" method return the user that corresponds to the id', async () => {
		const userCreated = await UserService.add(...Object.values(usersData[0]));
		const user = await UserService.findOne(userCreated.id);

		expect(typeof user).toBe('object');
		expect(Object.keys(user).sort()).toEqual(['id', 'firstName', 'lastName', 'email', 'password', 'wishList', 'shoppingCart', 'registrationDate'].sort());
		expect(user.firstName).toBe(usersData[0].firstName);
		expect(user.lastName).toBe(usersData[0].lastName);
		expect(user.email).toBe(usersData[0].email);
	});

	it('The "find" method returns the records of all users in the database', async () => {
		await UserService.bulkAdd(usersData);
		const users = await UserService.find();

		expect(Array.isArray(users)).toBeTruthy();
		users.forEach( (user, i) => {
			expect(Object.keys(user).sort()).toEqual(['id', 'firstName', 'lastName', 'email', 'password', 'wishList', 'shoppingCart', 'registrationDate'].sort());
			expect(user.firstName).toBe(usersData[i].firstName);
			expect(user.lastName).toBe(usersData[i].lastName);
			expect(user.email).toBe(usersData[i].email);
		});
	});

	it('The "update" method update the user data in the database', async () => {
		const userCreated = await UserService.add(...Object.values(usersData[0]));
		const user = await UserService.update(userCreated.id, {
			firstName: 'new name',
			email: 'update_email@gmail.com',
		})

		expect(typeof user).toBe('object');
		expect(Object.keys(user).sort()).toEqual(['id', 'firstName', 'lastName', 'email', 'password', 'wishList', 'shoppingCart', 'registrationDate'].sort());
		expect(user.firstName).toBe('new name');
		expect(user.email).toBe('update_email@gmail.com');
	});

	it('The "delete" method delete the user data in the database', async () => {
		const userCreated = await UserService.add(...Object.values(usersData[0]));
		const result = await UserService.delete(userCreated.id);

		expect(result).toBe(1);
	});

});
