const express = require('express');
const router = express.Router();

//Utils
const catchAsync = require('../utils/catchAsync');
const {successResponse} = require('../utils/responses');

//Service
const Service = require('../services/review.service');

//Schemas
const {createReviewSchema, updateReviewSchema, getReviewSchema} = require('../schemas/review.schema');

//Data Validator
const validatorHandler = require('../middlewares/validator.handler');


router.post('/', validatorHandler(createReviewSchema, 'body'), catchAsync( async (req, res, next) => {

	const { productId, userId, ref, rating, text } = req.body;
	const result = await Service.add( productId, userId, ref, rating, text );
	successResponse(res, 201, result);

}));

router.get('/:id', validatorHandler(getReviewSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.findOne(req.params.id);
	successResponse(res, 200, result);

}));

router.get('/user/:id', validatorHandler(getReviewSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.find({userId: req.params.id});
	successResponse(res, 200, result);

}));

router.patch('/:id', validatorHandler(updateReviewSchema, 'params', 'body'), catchAsync( async (req, res, next) => {

	const result = await Service.update(req.params.id, req.body);
	successResponse(res, 200, result);

}));

router.delete('/:id', validatorHandler(getReviewSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.delete(req.params.id);
	successResponse(res, 200, result);

}));

module.exports = router;
