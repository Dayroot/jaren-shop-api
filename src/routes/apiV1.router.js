const express = require('express');
const router = express.Router();

//Routers
const productsRouter = require('./products.router');
const categoriesRouter = require('./categories.router');
const brandsRouter = require('./brands.router');

router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
router.use('/brands', brandsRouter);

module.exports = router;
