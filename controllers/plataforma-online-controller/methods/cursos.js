'use strict'
var cursoModel = require('../../../bds/mysql/querys/models/administracion-po/models/cursos');
var cursos = {
    select: {
        cursosAlumno: function(param) {
            return new Promise((resolve, reject) => {
                cursoModel.select.cursosAlumno(param).then(r => {
                    resolve({ data: { cursos: r } });
                })

            }).catch(() => {
                console.log('exepction controllers/plataforma-online-controller/methods/cursos/cursos/select/cursosAlumno');
            })
        }
    },
    update: {},
    delete: {}
}

module.exports = cursos;