const conn = require('../connectionDB');

const ShoppingCart = conn.define('ShoppingCart', {});

module.exports = ShoppingCart;
