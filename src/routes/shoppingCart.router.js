const express = require('express');
const router = express.Router();

//Utils
const catchAsync = require('../utils/catchAsync');
const {successResponse} = require('../utils/responses');

//Service
const Service = require('../services/shoppingCart.service');

//Schemas
const { getCartSchema } = require('../schemas/shoppingCart.schema');
const {createSPSchema, updateSPSchema, deleteSPSchema } = require('../schemas/shoppingCart_product.schema');

//Data Validator
const validatorHandler = require('../middlewares/validator.handler');


router.post('/:shoppingCartId', validatorHandler(createSPSchema, 'body', 'params'), catchAsync( async (req, res, next) => {

	const { productId, SKU, quantity } = req.body;
	const result = await Service.addProduct( req.params.shoppingCartId, productId, SKU, quantity );
	successResponse(res, 201, result);

}));

router.get('/:shoppingCartId', validatorHandler(getCartSchema, 'params'), catchAsync( async (req, res, next) => {

	const result = await Service.findOne(req.params.shoppingCartId);
	successResponse(res, 200, result);

}));


router.patch('/:shoppingCartId/:ref', validatorHandler(updateSPSchema, 'params', 'body'), catchAsync( async (req, res, next) => {
	const { shoppingCartId, ref } = req.params;
	const result = await Service.updateProduct(shoppingCartId, ref, req.body);
	successResponse(res, 200, result);

}));

router.delete('/:shoppingCartId/:ref', validatorHandler(deleteSPSchema, 'params'), catchAsync( async (req, res, next) => {
	const { shoppingCartId, ref } = req.params;
	const result = await Service.deleteProduct( shoppingCartId, ref );
	successResponse(res, 200, result);

}));

module.exports = router;
