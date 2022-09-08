const conn = require('../connectionDB');

const ShoppingCart = conn.define('shoppingCart', {}, {
	timestamps: false,
});

module.exports = ShoppingCart;
