const express = require('express');
const router = express.Router();

//Utils
const catchAsync = require('../utils/catchAsync');
const {successResponse} = require('../utils/responses');

//Service
const Service = require('../services/product.service');

//Schemas
const {createProductSchema, updateProductSchema, getProductSchema} = require('../schemas/product.schema');

//Data Validator
const validatorHandler = require('../middlewares/validator.handler');

router.post('/', validatorHandler(createProductSchema, 'body'), catchAsync( async (req, res, next) => {

	const {brandId, name, description, images, gender, variants, categoryId} = req.body;
	const result = await Service.add(brandId, name, description, images, gender, variants, categoryId);
	successResponse(res, 201, result);

}));

router.get('/:id', validatorHandler(getProductSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.findOne(req.params.id);
	successResponse(res, 200, result);

}));

router.get('/', catchAsync( async (req, res, next) => {

	const result = await Service.find();
	successResponse(res, 200, result);

}));

router.patch('/:id', validatorHandler(updateProductSchema, 'params', 'body'), catchAsync( async (req, res, next) => {

	const result = await Service.update(req.params.id, req.body);
	successResponse(res, 200, result);

}));

router.delete('/:id', validatorHandler(getProductSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.delete(req.params.id);
	successResponse(res, 200, result);

}));

module.exports = router;
