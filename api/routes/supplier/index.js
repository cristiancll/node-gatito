const router = require('express').Router();
const SupplierTable = require('./SupplierTable')
const Supplier = require('./Supplier')
const SupplierSerializer = require('../../Serializer').SupplierSerializer;

router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
});
router.options('/:id', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
});

router.get('/', async (req, res) => {
    const results = await SupplierTable.list()
    res.status(200);
    const serializer = new SupplierSerializer(res.getHeader('Content-Type'), ['company']);
    res.send(serializer.serialize(results))
});

router.post('/', async (req, res, next) => {
    try{
        const data = req.body;
        console.log(data);
        const supplier = new Supplier(data);
        await supplier.insert();
        res.status(201)
        const serializer = new SupplierSerializer(res.getHeader('Content-Type'), ['company']);
        res.send(serializer.serialize(supplier));
    }catch(e){
        next(e);
    }

});

router.get('/:id', async (req, res, next) => {
    try{
        const id = req.params.id;
        const supplier = new Supplier({id});
        await supplier.load();
        res.status(200);
        const serializer = new SupplierSerializer(res.getHeader('Content-Type'), ['email', 'company', 'creationDate', 'updateDate', 'version']);
        res.send(serializer.serialize(supplier));
    }catch(e){
        next(e);
    }
});

router.put('/:id', async (req, res, next) => {
    try{
        const data = Object.assign({}, req.body, {id: req.params.id});
        const supplier = new Supplier(data);
        await supplier.update();
        res.status(204).end();
    }catch(e){
        next(e);
    }
});

router.delete("/:id", async (req, res, next) => {
    try{
        const id = req.params.id;
        const supplier = new Supplier({id: id});
        await supplier.load();
        await supplier.delete();
        res.status(204).end();
    }catch(e){
        next(e);
    }
});

const productRouter = require('./products')
const verifySupplier = async (req, res, next) => {
    try{
        const id = req.params.id;
        const supplier = new Supplier({id: id});
        await supplier.load();
        req.supplier = supplier;
        next();
    }catch(e){
        next(e);
    }
};
router.use('/:id/product', verifySupplier, productRouter);

module.exports = router;
