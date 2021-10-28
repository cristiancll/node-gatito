const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const acceptFormats = require('./Serializer').acceptedFormats;
const ErrorSerializer = require('./Serializer').ErrorSerializer;
const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

const router = require('./routes/supplier');
app.use('/api/supplier', router);
const routerV2 = require('./routes/supplier/routes.v2')
app.use('/api/v2/supplier', routerV2);

app.use((req, res, next) => {
    let format = req.header('Accept');
    if(format === '*/*') format = 'application/json';
    if(!acceptFormats.includes(format)){
        res.status(406);
        res.end();
        return;
    }
    res.setHeader('Content-Type', format);
    next();
});

app.use((e, req, res, next) => {
    let errorCode = e.errorCode ? e.errorCode : 500;
    res.status(errorCode);
    const serializer = new ErrorSerializer(res.getHeader('Content-Type'));
    res.send(serializer.serialize({
        message: e.message,
        id: e.errorId,
        code: errorCode
    }))
});
app.listen(config.get('api.port'), () => console.log("API Started on port 3000"));
