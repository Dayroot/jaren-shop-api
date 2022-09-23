const express = require('express');
const router = express.Router();

//Utils
const catchAsync = require('../utils/catchAsync');
const {successResponse} = require('../utils/responses');

//Service
const Service = require('../services/discount.service');

//Schemas
const {createDiscountSchema, updateDiscountSchema, getDiscountSchema} = require('../schemas/discount.schema');

//Data Validator
const validatorHandler = require('../middlewares/validator.handler');


router.post('/', validatorHandler(createDiscountSchema, 'body'), catchAsync( async (req, res, next) => {

	const { value, startDate, finishDate, isEnabled } = req.body;
	const result = await Service.add( value, startDate, finishDate, isEnabled );
	successResponse(res, 201, result);

}));

router.get('/:id', validatorHandler(getDiscountSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.findOne(req.params.id);
	successResponse(res, 200, result);

}));

router.get('/', catchAsync( async (req, res, next) => {

	const result = await Service.find();
	successResponse(res, 200, result);

}));

router.patch('/:id', validatorHandler(updateDiscountSchema, 'params', 'body'), catchAsync( async (req, res, next) => {

	const result = await Service.update(req.params.id, req.body);
	successResponse(res, 200, result);

}));

router.delete('/:id', validatorHandler(getDiscountSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.delete(req.params.id);
	successResponse(res, 200, result);

}));

module.exports = router;
