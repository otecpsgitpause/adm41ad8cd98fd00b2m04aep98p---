var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var methodOverride = require('method-override');
var jwt = require('jsonwebtoken'); //no use
var ip = require('ip');
var cluster = require('cluster');
var numCPUs= require('os').cpus().length;
var app = express();
var secureRoutes = express.Router();
app.set('port', (process.env.PORT || 9000));


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true,limit: '5mb' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT,POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * Falta configurar el router con todas las url
 * */
//router authenticate
var token_router = require('../routers/token-router/authentication-token-router');

//secure router url
var identificacion_router = require('../routers/identificacion-router/indentificacion-router');
var administracion_b_router = require('../routers/administracion-backend-router/administracion-b-router');
var administracion_po_router = require('../routers/administracion-plataforma-online-router/administracion-po-router');
var sistema_router = require('../routers/sistema-router/sistema-router');
var pruebas_b_router = require('../routers/pruebas-router/pruebas-b-router');
//use prefix router url
app.use('/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ', token_router);

//use prefix router secure url
app.use('/FWMCRgy5RJzbMzrOQtV1JXJ3Opj-VEkiHnys', identificacion_router);
app.use('/AMsSBHBODdRmcgiv3Z', sistema_router);
app.use('/GnYvuJnEEXAWr2cKDy48dPnYrxWozGrD5tkGX', administracion_b_router);
app.use('/GnYvuJnEEXAWr2cKDy48dPnYrxWozGrd5tkGX', administracion_po_router);
app.use('/GnYvu',pruebas_b_router);



if(cluster.isMaster){
    for(var i=0; i < numCPUs;i++){
        cluster.fork();
        cluster.on('exit', function(worker, code, signal)
        {
          console.log('worker ' + worker.process.pid + ' died');
        });
    }
}else{
    app.listen(app.get('port'), () => {
        console.log('app running port ', app.get('port'), 'IP:', ip.address());
    })
}
/*
app.listen(app.get('port'), () => {
    console.log('app running port ', app.get('port'), 'IP:', ip.address());
})*/