const Table = require('./ProductTable')
const EmptyData = require("../../../errors/EmptyData");
const InvalidField = require("../../../errors/InvalidField");
class Product {
    constructor({id, title, price, stock, supplier, creationDate, updateDate, version}) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.stock = stock;
        this.supplier = supplier;
        this.creationDate = creationDate;
        this.updateDate = updateDate;
        this.version = version;
    }

    validate() {
        if(typeof this.title !== 'string' || this.title.length === 0){
            throw new InvalidField("title");
        }
        if(typeof this.price !== 'number' || this.price === 0){
            throw new InvalidField("price");
        }
    }
    async insert(){
        this.validate();
        const entity = await Table.insert({
            title: this.title,
            price: this.price,
            stock: this.stock,
            supplier: this.supplier
        });
        this.id = entity.id;
        this.creationDate = entity.creationDate;
        this.updateDate = entity.updateDate;
        this.version = entity.version;
    }
    async delete(){
        return Table.delete(this.id, this.supplier);
    }
    async load(){
        const entity = await Table.get(this.id, this.supplier);
        this.title = entity.title;
        this.price = entity.price;
        this.stock = entity.stock;
        this.creationDate = entity.creationDate;
        this.updateDate = entity.updateDate;
        this.version = entity.version;
    }
    async update(){
        const newData = {};
        if(typeof this.title === 'string' && this.title.length > 0){
            newData.title = this.title;
        }
        if(typeof this.price === 'number' && this.price > 0){
            newData.price = this.price
        }
        if(typeof this.stock === 'number' && this.stock >= 0){
            newData.stock = this.stock;
        }
        if(Object.keys(newData).length === 0){
            throw new EmptyData();
        }
        return Table.update({
                id: this.id,
                supplier: this.supplier
            },
            newData
        );
    }
    reduceStock(){
        return Table.subtract(
            this.id,
            this.supplier,
            'stock',
            this.stock
        );
    }
}
module.exports = Product;
