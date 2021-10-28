const Sequelize = require('sequelize');
const config = require('config')

const instance = new Sequelize(
    config.get('mysql.database'),
    config.get('mysql.username'),
    config.get('mysql.password'),
    {
        host: config.get('mysql.host'),
        port: config.get('mysql.port'),
        dialect: 'mysql',
    }
);

module.exports = instance;
