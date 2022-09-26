const boom = require('@hapi/boom');

//Models
const Review = require('../db/models/review.model');

class ReviewService {

	static add = async (productId, userId, ref, rating, text) => {
		const review = await Review.scope('format').create({
			productId,
			userId,
			ref,
			rating,
			text,
		});
		if(!(review instanceof Review)) throw boom.badImplementation('Unexpected error');
		return await this.findOne(review.id);
	}

	static bulkAdd = async (reviewsData) => {
		const reviews = await Review.bulkCreate(reviewsData);
		if(!Array.isArray(reviews)) throw boom.badImplementation('Unexpected error');
		const reviewsId = reviews.map(review => review.id);
		return await this.find({id: reviewsId});
	}

	static findOne = async (id) => {
		const review = await Review.scope('format').findByPk(id);
		if( review === null ) throw boom.notFound('Review not found');
		return review.toJSON();
	}

	static find = async (params = null) => {
		let searchRequest = {};
		if(params && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const reviews = await Review.scope('format').findAll(searchRequest);
		if(!Array.isArray(reviews)) throw boom.badImplementation('Unexpected error');
		return reviews.map( review => review.toJSON());
	}

	static update = async (id, newData) => {
		const res = await Review.update(newData, {where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(Array.isArray(res) && res[0] === 0) throw boom.notFound('Review not found');
		return await this.findOne(id);
	}

	static delete = async (id) => {
		const res = await Review.destroy({where: {id}});
		if(res === null) throw boom.badImplementation('Unexpected error');
		if(res === 0) throw boom.notFound('Review not found');
		return res;
	}

}

module.exports = ReviewService;
