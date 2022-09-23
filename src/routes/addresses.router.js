const express = require('express');
const router = express.Router();

//Utils
const catchAsync = require('../utils/catchAsync');
const {successResponse} = require('../utils/responses');

//Service
const Service = require('../services/address.service');

//Schemas
const { createAddressSchema, updateAddressSchema, getAddressSchema, getAddressByUserSchema } = require('../schemas/address.schema');

//Data Validator
const validatorHandler = require('../middlewares/validator.handler');


router.post('/', validatorHandler(createAddressSchema, 'body'), catchAsync( async (req, res, next) => {

	const { userId, state, city, streetAddress, postalCode, propertyType, phoneNumber, fullname } = req.body;
	const result = await Service.add( userId, state, city, streetAddress, postalCode, propertyType, phoneNumber, fullname );
	successResponse(res, 201, result);

}));

router.get('/:id', validatorHandler(getAddressSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.findOne(req.params.id);
	successResponse(res, 200, result);

}));

router.get('/user/:userId', validatorHandler(getAddressByUserSchema, 'params'), catchAsync( async (req, res, next) => {
	const {userId} = req.params;
	const result = await Service.find({userId});
	successResponse(res, 200, result);

}));

router.patch('/:id', validatorHandler(updateAddressSchema, 'params', 'body'), catchAsync( async (req, res, next) => {

	const result = await Service.update(req.params.id, req.body);
	successResponse(res, 200, result);

}));

router.delete('/:id', validatorHandler(getAddressSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.delete(req.params.id);
	successResponse(res, 200, result);

}));

module.exports = router;
