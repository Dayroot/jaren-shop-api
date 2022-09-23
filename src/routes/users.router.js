const express = require('express');
const router = express.Router();

//Utils
const catchAsync = require('../utils/catchAsync');
const {successResponse} = require('../utils/responses');

//Service
const Service = require('../services/user.service');

//Schemas
const {createUserSchema, updateUserSchema, getUserSchema} = require('../schemas/user.schema');

//Data Validator
const validatorHandler = require('../middlewares/validator.handler');


router.post('/', validatorHandler(createUserSchema, 'body'), catchAsync( async (req, res, next) => {

	const { firstName, lastName, email, password } = req.body;
	const result = await Service.add( firstName, lastName, email, password );
	successResponse(res, 201, result);

}));

router.get('/:id', validatorHandler(getUserSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.findOne(req.params.id);
	successResponse(res, 200, result);

}));

router.get('/', catchAsync( async (req, res, next) => {

	const result = await Service.find();
	successResponse(res, 200, result);

}));

router.patch('/:id', validatorHandler(updateUserSchema, 'params', 'body'), catchAsync( async (req, res, next) => {

	const result = await Service.update(req.params.id, req.body);
	successResponse(res, 200, result);

}));

router.delete('/:id', validatorHandler(getUserSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.delete(req.params.id);
	successResponse(res, 200, result);

}));

module.exports = router;
