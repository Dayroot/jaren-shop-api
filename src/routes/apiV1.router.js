const express = require('express');
const router = express.Router();

//Routers
const productsRouter = require('./products.router');

router.use('/products', productsRouter);

module.exports = router;
