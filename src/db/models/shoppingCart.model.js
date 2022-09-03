const conn = require('../connectionDB');

const ShoppingCart = conn.define('ShoppingCart', {}, {
	timestamps: false,
});

module.exports = ShoppingCart;
