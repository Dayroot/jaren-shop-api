const express = require('express');
const router = express.Router();

//Response
const {successResponse} = require('../utils/responses');

//Service
const Service = require('../services/product.service');

//Schemas
const {createProductSchema, updateProductSchema, getProductSchema} = require('../schemas/product.schema');

//Data Validator
const validatorHandler = require('../middlewares/validator.handler');

router.post('/', validatorHandler(createProductSchema, 'body'), async (req, res, next) => {
	try {
		const {brandId, name, description, images, gender, variants, categoryId} = req.body;
		const result = await Service.add(brandId, name, description, images, gender, variants, categoryId);
		successResponse(res, 201, result);
	} catch (error) {
		next(error)
	}
});

router.get('/:id', validatorHandler(getProductSchema, 'params'), async (req, res, next) => {
	try {
		const result = await Service.findOne(req.params.id);
		successResponse(res, 200, result);
	} catch (error) {
		next(error);
	}
});

router.get('/', async (req, res, next) => {
	try {
		const result = await Service.find();
		successResponse(res, 200, result);
	} catch (error) {
		next(error);
	}
});

router.patch('/:id', validatorHandler(updateProductSchema, 'params', 'body'), async (req, res, next) => {
	try {
		const result = await Service.update(req.params.id, req.body);
		successResponse(res, 200, result);
	} catch (error) {
		next(error)
	}
});

router.delete('/:id', validatorHandler(getProductSchema, 'params'), async (req, res, next) => {
	try {
		const result = await Service.delete(req.params.id);
		successResponse(res, 200, result);
	} catch (error) {
		next(error)
	}
});

module.exports = router;
