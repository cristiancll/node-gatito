const Model = require('./ProductTableModel')
const NotFound = require("../../../errors/NotFound");
const instance = require('../../../database')
module.exports = {
    list(supplierId) {
        return Model.findAll({
            where: {
                supplier: supplierId
            },
            raw: true
        });
    },

    insert(data){
        return Model.create(data);
    },
    delete(id, supplierId){
        return Model.destroy({
            where: {
                id: id,
                supplier: supplierId
            }
        });
    },
    async get(id, supplierId){
        const entity = await Model.findOne({
            where: {
                id: id,
                supplier: supplierId
            },
            raw: true
        })
        if(!entity) throw new NotFound();
        return entity;
    },

    async update(ids, newData){
        return Model.update(
            newData,
            {
                where: ids
            }
        );
    },
    subtract(id, supplier, field, amount){
        return instance.transaction(async transaction => {
            const product = await Model.findOne({
                where: {
                    id: id,
                    supplier: supplier
                }
            });
            product[field] = amount;
            await product.update();
            return product;
        });
    }

}
