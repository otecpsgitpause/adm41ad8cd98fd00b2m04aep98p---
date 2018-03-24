'use strict'
var mysql = require('../../../../mysql-config');

var generic = {
    queryEjecuteSql: function(sql) {
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result) => {
                resolve({ error: error, resultado: result });

            })
        })
    },
    queryEjecuteSqlParam: function(sql, parameter) {
        return new Promise((resolve, reject) => {
            mysql.query(sql, parameter, (error, result) => {

                resolve({ error: error, resultado: result });

            })
        })
    }
}

module.exports = generic;