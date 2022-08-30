const conn = require('../connectionDB');

const WishList = conn.define('WishList', {});

module.exports = WishList;
