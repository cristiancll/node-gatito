const Sequelize = require('sequelize')
const instance = require('../../database/index')
const cols = {
    company: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    category: {
        type: Sequelize.ENUM('food', 'toys'),
        allowNull: false
    }
}
const options = {
    freezeTableName: true,
    tableName: 'supplier',
    timestamps: true,
    createdAt: 'creationDate',
    updatedAt: 'updateDate',
    version: 'version'
}


module.exports = instance.define('supplier', cols, options);
