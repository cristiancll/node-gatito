const SupplierTable = require('./SupplierTable')
const InvalidField = require('../../errors/InvalidField')
const EmptyData = require("../../errors/EmptyData");
class Supplier {
    constructor({id, company, email, category, creationDate, updateDate, version}) {
        this.id = id;
        this.company = company;
        this.email = email;
        this.category = category;
        this.creationDate = creationDate;
        this.updateDate = updateDate;
        this.version = version;
    }

    async insert(){
        this.validate();
        const entity = await SupplierTable.insert({
            company: this.company,
            email: this.email,
            category: this.category
        });
        this.id = entity.id;
        this.creationDate = entity.creationDate;
        this.updateDate = entity.updateDate;
        this.version = entity.version;
    }

    async load(){
        const entity = await SupplierTable.getById(this.id);
        this.company = entity.company;
        this.email = entity.email;
        this.category = entity.category;
        this.creationDate = entity.creationDate;
        this.updateDate = entity.updateDate;
        this.version = entity.version;
    }

    async update(){
        await SupplierTable.getById(this.id);
        const fields = ['company', 'email', 'category'];
        const data = {};

        fields.forEach((field) => {
            const value = this[field];
            if(value && typeof value === 'string' && value.length > 0){
                data[field] = value;
            }
        });
        if(Object.keys(data).length === 0){
            throw new EmptyData;
        }
        await SupplierTable.update(this.id, data);
    }
    delete(){
        return SupplierTable.remove(this.id);
    }
    validate(){
        const fields = ['company', 'email', 'category'];
        fields.forEach((field) => {
            const value = this[field];
            if(!value || typeof value !== 'string' || value.length === 0){
                throw new InvalidField(field);
            }
        });
    }
}

module.exports = Supplier;
