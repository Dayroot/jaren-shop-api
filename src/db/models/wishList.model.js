const conn = require('../connectionDB');

const WishList = conn.define('wishList', {}, {
	timestamps: false,
});

module.exports = WishList;
