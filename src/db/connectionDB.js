const {Sequelize} = require('sequelize');

const {DB_DIALECT, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT} = process.env;

const connectionDB = new Sequelize (
    `${DB_DIALECT}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    {
        logging: false,
    }
);
module.exports = connectionDB;
