const InvalidContentType = require("./errors/InvalidContentType");
const jsontoxml = require('jsontoxml');
class Serializer {
    json(data){
        return JSON.stringify(data);
    }
    xml(data){
        let tag = this.singleTag;
        if(Array.isArray(data)){
            tag = this.pluralTag;
            data = data.map((item) => {
                return {
                    [this.singleTag]: item
                }
            });
        }
        return jsontoxml({[tag]: data});
    }
    serialize(data){
        const filteredData = this.filter(data);
        if(this.contentType === 'application/json') return this.json(filteredData);
        if(this.contentType === 'application/xml') return this.xml(filteredData);
        throw new InvalidContentType(this.contentType);
    }
    filterFields(data){
        const dto = {};
        this.publicFields.forEach((field) => {
            if(data.hasOwnProperty(field)) dto[field] = data[field];
        });
        return dto;
    }
    filter(data){
        if(Array.isArray(data)){
            data = data.map(item => this.filterFields(item));
        }else{
            data = this.filterFields(data);
        }
        return data;
    }
}

class SupplierSerializer extends Serializer {
    constructor(contentType, extraFields) {
        super();
        this.contentType = contentType;
        this.singleTag = 'supplier';
        this.pluralTag = 'suppliers';
        this.publicFields = [
            'id',
            // 'company',
            'category'
        ].concat(extraFields || []);
    }

}

class ErrorSerializer extends Serializer {
    constructor(contentType, extraFields) {
        super();
        this.contentType = contentType;
        this.singleTag = 'error';
        this.pluralTag = 'errors';
        this.publicFields = [
            'id',
            'code',
            'message'
        ].concat(extraFields || []);
    }

}

class ProductSerializer extends Serializer {
    constructor(contentType, extraFields) {
        super();
        this.contentType = contentType;
        this.singleTag = 'product';
        this.pluralTag = 'products';
        this.publicFields = [
            'id',
            'title'
        ].concat(extraFields || []);
    }
}


module.exports = {
    Serializer: Serializer,
    SupplierSerializer: SupplierSerializer,
    ErrorSerializer: ErrorSerializer,
    ProductSerializer: ProductSerializer,
    acceptedFormats: [
        'application/json',
        'application/xml'
    ]
}
