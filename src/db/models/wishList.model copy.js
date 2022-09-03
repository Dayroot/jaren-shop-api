const conn = require('../connectionDB');

const WishList = conn.define('WishList', {}, {
	timestamps: false,
});

module.exports = WishList;
