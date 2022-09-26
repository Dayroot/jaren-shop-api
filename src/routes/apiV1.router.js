const express = require('express');
const router = express.Router();

//Routers
const productsRouter = require('./products.router');
const categoriesRouter = require('./categories.router');
const brandsRouter = require('./brands.router');
const discountsRouter = require('./discounts.router');
const usersRouter = require('./users.router');
const addressesRouter = require('./addresses.router');
const ordersRouter = require('./orders.router');
const wishListRouter = require('./wishList.router');
const shoppingCartRouter = require('./shoppingCart.router');
const reviewsRouter = require('./reviews.router');

router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
router.use('/brands', brandsRouter);
router.use('/discounts', discountsRouter);
router.use('/users', usersRouter);
router.use('/addresses', addressesRouter);
router.use('/orders', ordersRouter);
router.use('/wishList', wishListRouter);
router.use('/shoppingCart', shoppingCartRouter);
router.use('/reviews', reviewsRouter);

module.exports = router;
