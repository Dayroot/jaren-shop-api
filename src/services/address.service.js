const boom = require('@hapi/boom');

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
		if(!(address instanceof Address)) throw boom.badImplementation('Unexpected error');
		return address.toJSON();
	}

	static bulkAdd = async (addressesData) => {
		const addresses = await Address.bulkCreate(addressesData);
		if(!Array.isArray(addresses)) throw boom.badImplementation('Unexpected error');
		return addresses.map(address => address.toJSON());
	}

	static findOne = async (id) => {
		const address = await Address.findByPk(id);
		if( address === null ) throw boom.notFound('Address not found');
		return address.toJSON();
	}

	static find = async (params = null) => {
		let searchRequest = {};
		if(params && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const addresses = await Address.findAll(searchRequest);
		if(!Array.isArray(addresses)) throw boom.badImplementation('Unexpected error');
		return addresses.map( address => address.toJSON());
	}

	static update = async (id, newData) => {
		const res = await Address.update(newData, {where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(Array.isArray(res) && res[0] === 0) throw boom.badRequest("The id or data is not valid");
		return await this.findOne(id);
	}

	static delete = async (id) => {
		const res = await Address.destroy({where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(res === 0) throw boom.badRequest("The id is not valid");
		return res;
	}

}

module.exports = AddressService;
