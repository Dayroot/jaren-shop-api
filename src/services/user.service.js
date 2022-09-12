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
		return user.toJSON();
	}

	static bulkAdd = async (usersData) => {
		const request = usersData.map( data => this._setRequestAdd(data) );
		const users = await User.bulkCreate(request, {
			include: [ ShoppingCart, WishList],
		});
		return users.map(user => user.toJSON());
	}

	static findOne = async (id) => {
		const user = await User.scope('format').findByPk(id);
		return user.toJSON();
	}

	static find = async (params) => {
		let searchRequest = {};
		if(typeof params === 'object' && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const users = await User.scope('format').findAll(searchRequest);
		if(!Array.isArray(users)) return [];
		return users.map( user => user.toJSON());
	}

	static update = async (id, newData) => {
		await User.update(newData, {where: {id}});
		return await this.findOne(id);
	}

	static delete = async (id) => {
		return await User.destroy({where: {id}});
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
