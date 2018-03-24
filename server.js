var app = require('./server/server-config');
var port = process.env.PORT || 9000;
var mysql = require('./bds/mysql/mysql-config');
var mongoDB = require('./bds/mongodb/conexion');
var mail = require('./util-implements/mail/configuracion/conf');
mongoDB.conectar().then((mdb) => {
    if (mdb.error == true) {

        mail.senMail();
        console.log('servidor de base de datos no funcionando');
    } else {
        console.log('servidor de base de datos funcionando');
    }
});

/*
mysql.connect((error) => {
    try {
        if (!!error) {
            console.warn('no se pudo conectar');
            console.log({ errorMysql: error });
            mysql.disconect();
            //throw error;
            
            setTimeout(() => {
                conectar();
            }, 10000)
  mysql.end();


        } else {
            console.log('connected')
        }
    } catch (error) {

    }

});

mysql.on('error', function(err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        conectar(); // lost due to either server restart, or a
    } else { // connnection idle timeout (the wait_timeout
        console.log('2'); // server variable configures this)
    }
});*/