const boom = require('@hapi/boom');

//Models
const Review = require('../db/models/review.model');

class ReviewService {

	static add = async (productId, userId, rating, text) => {
		const review = await Review.create({
			productId,
			userId,
			rating,
			text,
		});
		if(!(review instanceof Review)) throw boom.badImplementation('Unexpected error');
		return review.toJSON();
	}

	static bulkAdd = async (reviewsData) => {
		const reviews = await Review.bulkCreate(reviewsData);
		if(!Array.isArray(reviews)) throw boom.badImplementation('Unexpected error');
		return reviews.map(review => review.toJSON());
	}

	static findOne = async (id) => {
		const review = await Review.findByPk(id);
		if( review === null ) throw boom.notFound('Review not found');
		return review.toJSON();
	}

	static find = async (params) => {
		let searchRequest = {};
		if(typeof params === 'object' && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const reviews = await Review.findAll(searchRequest);
		if(!Array.isArray(reviews)) throw boom.badImplementation('Unexpected error');
		return reviews.map( review => review.toJSON());
	}

	static update = async (id, newData) => {
		const res = await Review.update(newData, {where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(Array.isArray(res) && res[0] === 0) throw boom.badRequest("The id or data is not valid");
		return await this.findOne(id);
	}

	static delete = async (id) => {
		const res = await Review.destroy({where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(Array.isArray(res) && res[0] === 0) throw boom.badRequest("The id is not valid");
		return res;
	}

}

module.exports = ReviewService;
