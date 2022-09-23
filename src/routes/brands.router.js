const express = require('express');
const router = express.Router();

//Utils
const catchAsync = require('../utils/catchAsync');
const {successResponse} = require('../utils/responses');

//Service
const Service = require('../services/brand.service');

//Schemas
const {createBrandSchema, updateBrandSchema, getBrandSchema} = require('../schemas/brand.schema');

//Data Validator
const validatorHandler = require('../middlewares/validator.handler');


router.post('/', validatorHandler(createBrandSchema, 'body'), catchAsync( async (req, res, next) => {

	const { name, logoUrl } = req.body;
	const result = await Service.add( name, logoUrl );
	successResponse(res, 201, result);

}));

router.get('/:id', validatorHandler(getBrandSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.findOne(req.params.id);
	successResponse(res, 200, result);

}));

router.get('/', catchAsync( async (req, res, next) => {

	const result = await Service.find();
	successResponse(res, 200, result);

}));

router.patch('/:id', validatorHandler(updateBrandSchema, 'params', 'body'), catchAsync( async (req, res, next) => {

	const result = await Service.update(req.params.id, req.body);
	successResponse(res, 200, result);

}));

router.delete('/:id', validatorHandler(getBrandSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.delete(req.params.id);
	successResponse(res, 200, result);

}));

module.exports = router;
