'use strict'
var crypto = require('../../util-implements/cryptojs-implement');
var cursosModel = require('./methods/cursos');

var admpo = {
    cursos: {
        select: {
            cursosAlumno: function(req, res) {
                cursosModel.select.cursosAlumno(req.body.data).then(r => {
                    console.log({ reciboEsto: r });
                    let strgData = JSON.stringify(r);
                    crypto.encode(strgData).then((enc) => {
                        res.json({
                            d: enc
                        })
                    })
                })
            }
        },
        update: {},
        delete: {}
    }
}

module.exports = admpo;