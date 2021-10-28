const Sequelize = require('sequelize')
const instance = require('../../../database/index')
const cols = {
    supplier: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: require('../SupplierTableModel'),
            key: 'id'
        }
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}
const options = {
    freezeTableName: true,
    tableName: 'product',
    timestamps: true,
    createdAt: 'creationDate',
    updatedAt: 'updateDate',
    version: 'version'
}


module.exports = instance.define('product', cols, options);
