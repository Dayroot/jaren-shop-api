const express = require('express');
const router = express.Router();

//Utils
const catchAsync = require('../utils/catchAsync');
const {successResponse} = require('../utils/responses');

//Service
const Service = require('../services/wishList.service');

//Schemas
const { getWishListSchema } = require('../schemas/wishList.schema');
const { createWLPSchema, deleteWLPSchema } = require('../schemas/wishList_product.schema');

//Data Validator
const validatorHandler = require('../middlewares/validator.handler');


router.post('/:wishListId', validatorHandler(createWLPSchema, 'body', 'params'), catchAsync( async (req, res, next) => {

	const { productId, SKU } = req.body;
	const result = await Service.addProduct( req.params.wishListId, productId, SKU );
	successResponse(res, 201, result);

}));

router.get('/:wishListId', validatorHandler(getWishListSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.findOne(req.params.wishListId);
	successResponse(res, 200, result);

}));


router.delete('/:wishListId/:ref', validatorHandler(deleteWLPSchema, 'params'), catchAsync( async (req, res, next) => {
	const { wishListId, ref } = req.params;
	const result = await Service.deleteProduct( wishListId, ref );
	successResponse(res, 200, result);

}));

module.exports = router;
