const Model = require('./SupplierTableModel')
const NotFound = require('../../errors/NotFound')

module.exports = {
    list() {
        return Model.findAll({raw: true});
    },
    insert(supplier){
        return Model.create(supplier);
    },
    async getById(id){
        const entity = await Model.findOne({
            where: {
                id: id
            }
        });
        if(!entity) throw new NotFound();
        return entity;
    },
    update(id, data){
        return Model.update(data, {where: {id: id}});
    },
    remove(id){
        return Model.destroy({where: {id: id}});
    }
}
