const router = require('express').Router({mergeParams: true});
const Table = require('./ProductTable')
const Product = require('./Product')
const ProductSerializer = require('../../../Serializer').ProductSerializer

router.options('/', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
});

router.options('/:id', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, HEAD');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
});
router.options('/:id/purchase', (req, res) => {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
});

router.get('/', async (req, res) => {
    const products = await Table.list(req.supplier.id);
    res.send(new ProductSerializer(res.getHeader('Content-Type')).serialize(products));
});

router.post('/', async (req, res, next) => {
    try{
        const supplierId = req.supplier.id;
        const body = req.body;
        const data = Object.assign({}, body, {supplier: supplierId});
        const product = new Product(data);
        await product.insert();
        const lastModified = (new Date(product.updateDate)).getTime();
        res
            .set('ETag', product.version)
            .set('Last-Modified', lastModified)
            .set('Location', `/api/supplier/${product.supplier}/product/${product.id}`)
            .status(201)
            .send(new ProductSerializer(res.getHeader('Content-Type')).serialize(product));
    }catch(e){
        next(e);
    }
});

router.delete('/:productId', async (req, res, next) => {
   const data = {
       id: req.params.productId,
       supplier: req.supplier.id
   }
   const entity = new Product(data);
   await entity.delete();
   res.status(204).end();
});


router.get("/:id", async (req, res, next) => {
    try{
        const data = {
            id: req.params.id,
            supplier: req.supplier.id
        }
        const product = new Product(data);
        await product.load();
        const lastModified = (new Date(product.updateDate)).getTime();
        res
            .set('ETag', product.version)
            .set('Last-Modified', lastModified)
            .send(new ProductSerializer(
                res.getHeader('Content-Type'),
            ['price', 'stock', 'supplier', 'creationDate', 'updateDate', 'version']
                )
                .serialize(product)
            );
    }catch(e){
        next(e);
    }
});

router.head('/:id', async (req, res, next) => {
    try{
        const data = {
            id: req.params.id,
            supplier: req.supplier.id
        }
        const product = new Product(data);
        await product.load();
        const lastModified = (new Date(product.updateDate)).getTime();
        res
            .set('ETag', product.version)
            .set('Last-Modified', lastModified)
            .status(200)
            .end();
    }catch(e){
        next(e);
    }
});

router.put('/:id', async (req, res, next) => {
    try{
        const data = Object.assign(
            {},
            req.body,
            {
                id: req.params.id,
                supplier: req.supplier.id
            }
        );
        const product = new Product(data);
        await product.update();
        await product.load();
        const lastModified = (new Date(product.updateDate)).getTime();
        res
            .set('ETag', product.version)
            .set('Last-Modified', lastModified)
            .status(204)
            .end();
    }catch(e){
        next(e);
    }
});

router.post('/:id/purchase', async (req, res, next) => {
    try{
        const product = new Product({
            id: req.params.id,
            supplier: req.supplier.id
        })
        await product.load();
        product.stock -= req.body.amount;
        await product.reduceStock();
        const lastModified = (new Date(product.updateDate)).getTime();
        res
            .set('ETag', product.version)
            .set('Last-Modified', lastModified)
            .status(204)
            .end();
    }catch(e){
        next(e);
    }
});

module.exports = router;
