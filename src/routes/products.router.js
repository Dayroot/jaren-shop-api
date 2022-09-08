const express = require('express');
const router = express.Router();

//Response
const {successResponse} = require('../utils/responses');

//Service
const ProductService = require('../services/product.service');

router.post('/:typeProduct', async (req, res, next) => {
	try {
		const {typeProduct} = req.params;
		const Service = require(`../services/${typeProduct}.service.js`) || ProductService;
		const result = await Service.add();
		successResponse(res, 201, result);
	} catch (error) {
		next(error)
	}
});



module.exports = router;
