//Models
const Address = require('../db/models/address.model');

class AddressService {

	static add = async (userId, state, city, streetAddress, postalCode, propertyType, phoneNumber, fullname) => {
		const address = await Address.create({
			userId,
			state,
			city,
			streetAddress,
			postalCode,
			propertyType,
			phoneNumber,
			fullname,
		});
		return address.toJSON();
	}

	static bulkAdd = async (addressesData) => {
		const addresses = await Address.bulkCreate(addressesData);
		return addresses.map(address => address.toJSON());
	}

	static findOne = async (id) => {
		const address = await Address.findByPk(id);
		return address.toJSON();
	}

	static find = async (params) => {
		let searchRequest = {};
		if(typeof params === 'object' && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const addresses = await Address.findAll(searchRequest);
		if(!Array.isArray(addresses)) return [];
		return addresses.map( address => address.toJSON());
	}

	static update = async (id, newData) => {
		await Address.update(newData, {where: {id}});
		return await this.findOne(id);
	}

	static delete = async (id) => {
		return await Address.destroy({where: {id}});
	}

}

module.exports = AddressService;
