var mysql = require('mysql');
var configuracion = require('./configuracion');
dbConfig = {

};
connection = mysql.createConnection({
    host: configuracion.host,
    user: configuracion.user,
    password: configuracion.password,
    database: configuracion.database,
    acquireTimeout: 30000
});

module.exports = connection;