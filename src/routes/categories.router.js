const express = require('express');
const router = express.Router();

//Utils
const catchAsync = require('../utils/catchAsync');
const {successResponse} = require('../utils/responses');

//Service
const Service = require('../services/category.service');

//Schemas
const {createCategorySchema, updateCategorySchema, getCategorySchema} = require('../schemas/category.schema');

//Data Validator
const validatorHandler = require('../middlewares/validator.handler');


router.post('/', validatorHandler(createCategorySchema, 'body'), catchAsync( async (req, res, next) => {

	const { name } = req.body;
	const result = await Service.add( name );
	successResponse(res, 201, result);

}));

router.get('/:id', validatorHandler(getCategorySchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.findOne(req.params.id);
	successResponse(res, 200, result);

}));

router.get('/', catchAsync( async (req, res, next) => {

	const result = await Service.find();
	successResponse(res, 200, result);

}));

router.patch('/:id', validatorHandler(updateCategorySchema, 'params', 'body'), catchAsync( async (req, res, next) => {

	const result = await Service.update(req.params.id, req.body);
	successResponse(res, 200, result);

}));

router.delete('/:id', validatorHandler(getCategorySchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.delete(req.params.id);
	successResponse(res, 200, result);

}));

module.exports = router;
