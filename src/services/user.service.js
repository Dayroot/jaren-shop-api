const boom = require('@hapi/boom');

//Models
const User = require('../db/models/user.model');
const WishList = require('../db/models/wishList.model');
const ShoppingCart = require('../db/models/shoppingCart.model');

class UserService {

	static add = async (firstName, lastName, email, password) => {
		const request = this._setRequestAdd({firstName, lastName, email, password});
		const user = await User.create(request, {
			include: [ ShoppingCart, WishList],
		});
		if(!(user instanceof User)) throw boom.badImplementation('Unexpected error');
		return user.toJSON();
	}

	static bulkAdd = async (usersData) => {
		const request = usersData.map( data => this._setRequestAdd(data) );
		const users = await User.bulkCreate(request, {
			include: [ ShoppingCart, WishList],
		});
		if(!Array.isArray(users)) throw boom.badImplementation('Unexpected error');
		return users.map(user => user.toJSON());
	}

	static findOne = async (id) => {
		const user = await User.scope('format').findByPk(id);
		if( user === null ) throw boom.notFound('User not found');
		return user.toJSON();
	}

	static find = async (params = null) => {
		let searchRequest = {};
		if(params && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const users = await User.scope('format').findAll(searchRequest);
		if(!Array.isArray(users)) throw boom.badImplementation('Unexpected error');
		return users.map( user => user.toJSON());
	}

	static update = async (id, newData) => {
		const res = await User.update(newData, {where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(Array.isArray(res) && res[0] === 0) throw boom.badRequest("The id or data is not valid");
		return await this.findOne(id);
	}

	static delete = async (id) => {
		const res = await User.destroy({where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(res === 0) throw boom.badRequest("The id is not valid");
		return res;
	}

	static _setRequestAdd = ({firstName, lastName, email, password}) => ({
		firstName,
		lastName,
		email,
		password,
		wishList: {},
		shoppingCart: {},
	});
}

module.exports = UserService;
