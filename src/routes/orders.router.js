const express = require('express');
const router = express.Router();

//Utils
const catchAsync = require('../utils/catchAsync');
const {successResponse} = require('../utils/responses');

//Service
const Service = require('../services/order.service');

//Schemas
const { createOrderSchema, updateOrderSchema, getOrderSchema, getOrderByUserSchema } = require('../schemas/order.schema');

//Data Validator
const validatorHandler = require('../middlewares/validator.handler');


router.post('/', validatorHandler(createOrderSchema, 'body'), catchAsync( async (req, res, next) => {

	const { userId, address, status, details } = req.body;
	const result = await Service.add( userId, address, status, details );
	successResponse(res, 201, result);

}));

router.get('/:id', validatorHandler(getOrderSchema, 'params'), catchAsync( async (req, res, next) => {
	const result = await Service.findOne(req.params.id);
	successResponse(res, 200, result);

}));

router.get('/user/:userId', validatorHandler(getOrderByUserSchema, 'params'), catchAsync( async (req, res, next) => {
	const {userId} = req.params;
	const result = await Service.find({userId});
	successResponse(res, 200, result);

}));

router.patch('/:id', validatorHandler(updateOrderSchema, 'params', 'body'), catchAsync( async (req, res, next) => {

	const result = await Service.update(req.params.id, req.body);
	successResponse(res, 200, result);

}));

router.delete('/:id', validatorHandler(getOrderSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.delete(req.params.id);
	successResponse(res, 200, result);

}));

module.exports = router;
