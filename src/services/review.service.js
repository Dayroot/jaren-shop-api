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
		return review.toJSON();
	}

	static bulkAdd = async (reviewsData) => {
		const reviews = await Review.bulkCreate(reviewsData);
		return reviews.map(review => review.toJSON());
	}

	static findOne = async (id) => {
		const review = await Review.findByPk(id);
		return review.toJSON();
	}

	static find = async (params) => {
		let searchRequest = {};
		if(typeof params === 'object' && Object.keys(params).length !== 0){
			searchRequest.where = params;
		}
		const reviews = await Review.findAll(searchRequest);
		if(!Array.isArray(reviews)) return [];
		return reviews.map( review => review.toJSON());
	}

	static update = async (id, newData) => {
		await Review.update(newData, {where: {id}});
		return await this.findOne(id);
	}

	static delete = async (id) => {
		return await Review.destroy({where: {id}});
	}

}

module.exports = ReviewService;
