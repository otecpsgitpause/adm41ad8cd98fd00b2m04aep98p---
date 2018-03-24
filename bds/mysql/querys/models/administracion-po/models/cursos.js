'use strict'
var generic = require('./generic');
var cursoQuery = require('../querys/cursos.query');
var consultasSql = require('../../queryJSON/consultasSql');
var cursos = {
    select: {
        cursosAlumno: function(param) {
            return new Promise((resolve, reject) => {
                let consultas = {
                    modulos: consultasSql.curso[0].select[0].curso.consulta[1].c,
                    clases: consultasSql.curso[0].select[0].curso.consulta[2].c,
                    contenidos: consultasSql.curso[0].select[0].curso.consulta[3].c
                }

                let funcionalidades = {
                    obtencionModulos: function(codCurso) {
                        return new Promise((resolve, reject) => {
                            generic.queryEjecuteSqlParam(consultas.modulos, codCurso).then(modulos => {
                                console.log({ moduloError: modulos.error });
                                resolve(modulos.resultado); // || modulosRes.error;
                            })
                        })

                    },
                    obtencionClases: function(cod_modulo) {
                        return new Promise((resolve, reject) => {
                            generic.queryEjecuteSqlParam(consultas.clases, cod_modulo).then(clases => {
                                resolve(clases.resultado);
                            })
                        })
                    },
                    obtencionContenidos: function(cod_clase) {
                        return new Promise((resolve, reject) => {
                            generic.queryEjecuteSqlParam(consultas.contenidos, cod_clase).then(contenidos => {
                                resolve(contenidos.resultado);
                            })

                        })
                    },
                    obtencionPruebas: function() {

                    },
                    obtencionAvancesAlumno: function() {

                    },
                    /**
                     * Metodos procesamiento información
                     */
                    obtencionDataCurso: function(curso) {
                        return new Promise((resolve, reject) => {
                            let cursoItem = {
                                curso: curso,
                                modulos: []
                            }
                            funcionalidades.obtencionModulos(curso.cod_curso).then(modulos => {

                                    modulos.forEach((modulo, indexModulo) => {
                                        let moduloItem = {
                                            modulo: modulo,
                                            clases: []
                                        }
                                        funcionalidades.obtencionClases(modulo.cod_modulo_curso).then(clases => {

                                                clases.forEach(clase => {
                                                    let claseItem = {
                                                        clase: clase,
                                                        contenidos: []
                                                    }
                                                    funcionalidades.obtencionContenidos(clase.cod_clases).then(contenidos => {
                                                            claseItem.contenidos = contenidos;
                                                        })
                                                        //registra las clases del modulo
                                                    moduloItem.clases.push(claseItem);
                                                })

                                            })
                                            // --/ clases

                                        cursoItem.modulos.push(moduloItem);
                                    })
                                })
                                //--/ modulos
                            setTimeout(() => {
                                resolve(cursoItem);
                            }, 20);
                        })
                    },
                    cursosArray: function(cursosItem) {
                        return new Promise((resolve, reject) => {
                            let cursosDataArr = [];
                            cursosItem.forEach(curso => {
                                funcionalidades.obtencionDataCurso(curso).then(data => {
                                    cursosDataArr.push(data);
                                })
                            })
                            setTimeout(() => {
                                resolve(cursosDataArr);
                            }, 200);
                        })

                    }
                }



                generic.queryEjecuteSqlParam(cursoQuery.cursosAlumno.query[0].curso_usuario, param.rut).then((respuesta) => {
                    if (respuesta.error == null && respuesta.resultado.length > 0) {
                        /**
                         * Se obtienen los curso donde el alumno está enrolado
                         */
                        funcionalidades.cursosArray(respuesta.resultado).then(dataCurso => {
                            resolve(dataCurso);
                        })

                    } else {
                        resolve([]);
                    }
                })


            })
        }
    },
    update: {},
    delete: {}
}

module.exports = cursos;