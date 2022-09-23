const express = require('express');
const router = express.Router();

//Routers
const productsRouter = require('./products.router');
const categoriesRouter = require('./categories.router');

router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);

module.exports = router;
