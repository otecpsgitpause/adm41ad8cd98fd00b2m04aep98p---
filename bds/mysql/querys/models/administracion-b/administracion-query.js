var mysql = require('../../../mysql-config');
var crypto = require('../../../../../util-implements/cryptojs-implement');
var consultasSql = require('../queryJSON/consultasSql');
var administracionBack = {
    loginAdmin: function(user) {
        return new Promise((resolve, reject) => {
            let parameter;
            parameter = [user.usuario, user.contrasena];
            mysql.query(consultasSql.loginadmin[0].consulta, parameter, (error, result) => {

                if (error) {
                    resolve({ error: true });
                } else {
                    resolve({ error: false, data: result });
                }
            })
        }).catch(() => {
            console.log('algo paso en la identificacion del usuario');
        })

    },
    administracionCursos: {
        administracionPruebas: {
            registrarPrueba: function(prueba) {
                console.log({ pruebaRecibida: prueba });



                return new Promise((resolve, reject) => {

                    let funcionalidades = {
                        delPruebasTemporales: function() {
                            let parameter = [prueba.temPruebaDelete.pruebaNoDefinida.cod];
                            //console.log({ consultaSql: consultasSql.curso[2].temPruebas.consulta[2].c, parameterPruebaTempDelete:  });
                            administracionBack.queryEjecuteSqlParam(consultasSql.curso[2].temPruebas.consulta[2].c, parameter).then(tempDelete => {

                            })
                        }
                    }
                    crypto.generateCode().then((codePrueba) => {
                        //Registro Prueba
                        let parameter = [codePrueba, prueba.form.nombre, prueba.form.moduloCurso, prueba.form.instrucciones, prueba.form.numPrueba]
                            //validate consulta
                        let parameterValidate = [prueba.form.nombre, prueba.form.moduloCurso];

                        administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[0].registrarprueba[1].consulta, parameterValidate).then((validate) => {
                            //console.log({ validacion: validate });
                            if (validate.resultado.length == 0) {
                                administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[0].registrarprueba[0].consulta, parameter).then((regPrueba) => {
                                    //console.log({ regPrueba: regPrueba.error });
                                    //{ regPrueba: regPrueba.error } --> si es null se puede avanzar al registro siguiente
                                    if (regPrueba.error == null) {
                                        //registro de preguntas


                                        prueba.palt.forEach((preguntas, index) => {
                                            //preguntas.p[0] --> obtención enunciado pregunta
                                            //console.log(preguntas);

                                            //console.log({ pregunta: preguntas.p[0], numeroPregunta: index });
                                            crypto.generateCode().then((codePregunta) => {
                                                let parameterPreguntas = [codePregunta, preguntas.p[0], codePrueba];
                                                //registrando preguntas
                                                administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[0].registrarprueba[2].consulta, parameterPreguntas).then((preguntaQueryResponse) => {
                                                    //console.log(preguntaQueryResponse);
                                                    //preguntaQueryResponse.error --> null paso al registro de alternativas
                                                    if (preguntaQueryResponse.error == null) {

                                                        //registro de alternativas

                                                        preguntas.a.forEach((alternativas, i) => {
                                                            console.log({ registroAlternativa: alternativas });
                                                            crypto.generateCode().then((codeAlternativa) => {
                                                                    let parameterAlternativas = [codeAlternativa, alternativas.a, alternativas.c, codePregunta];
                                                                    administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[0].registrarprueba[3].consulta, parameterAlternativas).then((alternativaQueryResponse) => {
                                                                        if (alternativaQueryResponse.error == null) {
                                                                            console.log('se terminaron de registrar las alternativas');

                                                                        }
                                                                    })
                                                                })
                                                                //console.log({ alternativa: alternativas.a, numeroAlternativa: i });

                                                        })


                                                    }
                                                })

                                                //obtención alternativas


                                            })



                                        });





                                    } else {
                                        resolve({ data: { registro: 'error1000' } })
                                    }
                                    funcionalidades.delPruebasTemporales();
                                    resolve({ data: { registro: 'registrada' } })
                                })
                            } else {
                                console.log('esta prueba ya fue registrada');
                                resolve({ data: { registro: 'existente' } });
                            }
                        })


                        //preguntas









                    })
                }).catch(() => {
                    console.log('algo ocurrio en el registro de la prueba');
                })




            },
            SendPruebasRegistradas: function() {
                /**
                 *  Administrar Pruebas Registradas
                 */
                return new Promise((resolve, reject) => {
                    /**
                     * Data a Extraer 
                     * prueba(cod_prueba,nombre_prueba)
                     * modulo_curso(cod_modulo_curso,nombre_modulo_curso)
                     * curso(cod_curso,codigo_sence_curso,nombre_curso)
                     * area(cod_area,nombre_area)
                     */
                    administracionBack.queryEjecuteSql(consultasSql.administracionpruebas[0].pruebadata[0].consulta).then((pruebaResponse) => {
                        if (pruebaResponse.error == null) {
                            resolve({ data: { registro: pruebaResponse.resultado } });
                        }

                    })
                }).catch(() => {
                    console.log('algo ocurrio en senPruebasRegistradas');
                })



            },
            deletePrueba: function(prueba) {
                return new Promise((resolve, reject) => {


                    let parameter = [prueba.codPrueba];
                    administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[1].delete[0].deleteprueba.consulta, parameter).then((deletePruebaResponse) => {
                        if (deletePruebaResponse.error == null) {
                            resolve({ data: { registro: { dlt: "1" } } });
                        }
                    })

                }).catch(() => {
                    console.log('ocurrio algo en deletePrueba');
                })
            },
            editarPrueba: function(prueba) {
                return new Promise((resolve, reject) => {
                    /** 
                     * Recibe prueba.cod_prueba
                     * Data a Extraer
                     * All preguntas,alternativas
                     *  
                     */
                    console.log({ editarPruebaPrueba: prueba });
                    let parameter = [prueba.codPrueba];

                    console.log({ queryPreguntas: consultasSql.administracionpruebas[0].pruebadata[3].prueba.consulta });
                    //obtención prueba
                    administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[0].pruebadata[3].prueba.consulta, parameter).then((datosPrueba) => {
                        if (datosPrueba.error == null) {
                            administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[0].pruebadata[1].preguntas.consulta, parameter).then((preguntas) => {
                                if (preguntas.error == null) {
                                    let preguntaArray = [],
                                        alternativas = [],
                                        preguntasAlternativas = [];
                                    preguntaArray = preguntas.resultado;
                                    //console.log({ preguntasResultado: preguntas.resultado });

                                    preguntaArray.forEach(function(pregunta) {
                                        //console.log({ preguntasObtenidas: pregunta });

                                        let paramAlternativa = [pregunta.cod_pregunta];
                                        console.log({ alternativaQuery: consultasSql.administracionpruebas[0].pruebadata[2].alternativas.consulta, preguntaCode: paramAlternativa });

                                        administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[0].pruebadata[2].alternativas.consulta, paramAlternativa).then(function(alternativas) {
                                            preguntasAlternativas.push({ pregunta: pregunta, alternativas: alternativas.resultado });
                                            console.log('ejecutandose obtención alternativas');
                                            //console.log({ preguntaAlternativa: preguntasAlternativas });
                                            //console.log({ preguntaAlternativa: preguntasAlternativas });
                                        }).catch(() => {
                                            console.log('ocurrio algo en la obtención de las alternativas');
                                        })

                                    })
                                    setTimeout(() => {
                                        resolve({ data: { registro: preguntasAlternativas, prueba: datosPrueba.resultado } });
                                    }, 10)


                                    //resolve({ data: { registro: preguntasAlternativas } });

                                    //console.log({ editarPruebaData: preguntas.resultado });
                                } else {
                                    console.log({ editarPruebaError: preguntas.error });
                                }
                            }).catch(() => {
                                console.log('ocurrio algo en la obtención de las preguntas');
                            })
                        }
                    }).catch(() => {
                        console.log('paso algo en la obtención de los datos de la prueba en editarPrueba');
                    })





                }).catch(() => {
                    console.log('ocurrio algo en editarPrueba');
                })
            },
            registrarPruebaEditada: function(dataPrueba) {
                return new Promise((resolve, reject) => {
                    // console.log({ datosPruebasRecibido: dataPrueba });
                    //Editar Datos Prueba
                    console.log({ datosPrueba: dataPrueba });
                    /**
                     * campo = 'false||true'
                     */
                    let prueba = dataPrueba.form;
                    let editFormPrueba = false;
                    let editPAlt = false;
                    let delPreguntas = false;
                    let delAlternativas = false;
                    if (prueba.nombre != '' || prueba.area != '' || prueba.curso != '' || prueba.moduloCurso != '' || prueba.instrucciones != '') {
                        let paramsPrueba = [prueba.nombre, prueba.moduloCurso, prueba.instrucciones, dataPrueba.edtPrueba.cod_prueba];
                        editFormPrueba = true;
                        administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[2].update[0].updateDataPrueba.consulta, paramsPrueba).then((pruebaEditadaRespuesta) => {
                            if (pruebaEditadaRespuesta.error == null) {
                                //console.log('se actualizaron los datos de la prueba');
                                editFormPrueba = 'terminado';
                            }
                        }).catch(() => {
                            console.log('ocurrio algo en editar datos de la prueba metodo registrarPruebaEditada');
                        })
                    }
                    //editar datos preguntas
                    let preguntasEdit = dataPrueba.palt; // --> array
                    if (preguntasEdit.length > 0) {
                        editPAlt = true;
                        preguntasEdit.forEach((p) => {
                            let cod_prueba = dataPrueba.edtPrueba.cod_prueba;

                            let alternativas = p.a;
                            //console.log({ pregunta: p });
                            if (p.cod_pregunta == 'false') {
                                //añadir pregunta
                                crypto.generateCode().then((codePregunta) => {
                                    let paramPreguntas = [codePregunta, p.p[0], cod_prueba];


                                    administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[0].registrarprueba[2].consulta, paramPreguntas).then((preguntaRespuesta) => {
                                        if (preguntaRespuesta.error == null) {

                                            //console.log('se añadio la pregunta en registrarPruebaEditada');
                                            //añadir alternativa
                                            alternativas.forEach((a) => {
                                                //console.log({ alternativasFalse: a });
                                                crypto.generateCode().then((codAlternativa) => {
                                                    let paramsAlternativa = [codAlternativa, a.a, a.c, codePregunta];
                                                    administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[0].registrarprueba[3].consulta, paramsAlternativa).then((alternFalseResponse) => {

                                                    }).catch(() => {
                                                        console.log('problema en el if al registrar alternativas');
                                                    })
                                                })

                                            })

                                        }
                                    })

                                })


                            } else {
                                let paramPreguntas = [p.p[0], p.cod_pregunta];
                                administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[2].update[1].updatePreguntas.consulta, paramPreguntas).then((preguntaRespuesta) => {
                                    if (preguntaRespuesta.error == null) {
                                        alternativas.forEach((a) => {
                                            //console.log({ alternativaMoco: a });
                                            if (a.cod_alternativa == 'false') {
                                                crypto.generateCode().then((codealterna) => {
                                                    let paramsAlternativa = [codealterna, a.a, a.c, p.cod_pregunta];

                                                    administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[0].registrarprueba[3].consulta, paramsAlternativa).then((alternFalseResponse) => {

                                                    })
                                                })
                                            } else {
                                                let paramsAlternativa = [a.a, a.c, a.cod_alternativa];
                                                // console.log({ alternativaRegistroQuery: consultasSql.administracionpruebas[2].update[2].updateAlternativa.consulta });
                                                administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[2].update[2].updateAlternativa.consulta, paramsAlternativa).then((alternFalseResponse) => {

                                                }).catch(() => {
                                                    console.log('problema en el else al registrar las alternativas');
                                                })
                                            }

                                        })

                                    }
                                })
                            }

                        })
                        editPAlt = 'terminado';
                    }

                    //console.log({ datosPreguntas: dataPrueba.palt });

                    //1.- borrado de preguntas

                    if (dataPrueba.preguntasDelete != undefined && dataPrueba.preguntasDelete.length > 0) {
                        delPreguntas = true;
                        let preguntasArray = dataPrueba.preguntasDelete;
                        preguntasArray.forEach((preguntas) => {
                            let parameter = [preguntas.cd_prg];
                            //console.log({ queryPreguntas: consultasSql.administracionpruebas[1].delete[0].deletePregunta });
                            administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[1].delete[0].deletePregunta.consulta, parameter).then((deletePreguntasResponse) => {
                                    //console.log({ preguntasInformacionDelete: deletePreguntasResponse });
                                }).catch(() => {
                                    console.log('hubo un error al borrar una pregunta en el metodo registrarPruebaEditada');
                                })
                                //console.log({ preguntasDelete: preguntas });
                                //delete Pregunta

                        })
                        delPreguntas = 'terminado';
                    }
                    //2.- borrado de alternativas
                    if (dataPrueba.alternativasDelete != undefined && dataPrueba.alternativasDelete.length > 0) {
                        delAlternativas = true;
                        let alternativasArray = dataPrueba.alternativasDelete;
                        alternativasArray.forEach((alternativas) => {
                            let parameterAlt = [alternativas.cod_alt];
                            administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[1].delete[0].deleteAlternativa.consulta, parameterAlt).then((deleteAlternativaResponse) => {

                                }).catch(() => {
                                    console.log('hubo un error al borrar una alternativa en el metodo registrarPruebaEditada');
                                })
                                //console.log({ alternativasDelete: alternativas });
                        })
                        deleteAlternativa = 'terminado';
                    }
                    /**
                     * let editFormPrueba=false;let editPAlt=false;let delPreguntas=false;let delAlternativas=false;
                     */
                    if (editFormPrueba == false && editPAlt == false && delPreguntas == false && delAlternativas == false) {
                        resolve({ data: "1" });
                    } else if (editFormPrueba == 'terminado' || editPAlt == 'terminado' || delPreguntas == 'terminado' && delAlternativas == 'terminado') {
                        resolve({ data: "1" });
                    }


                })
            },
            sendDataCursos: function() {
                return new Promise((resolve, reject) => {
                    let innerQuery = null,
                        area = null,
                        curso = null,
                        modulo_curso = null
                    administracionBack.queryEjecuteSql(consultasSql.cursosdata[0].consulta).then((innQue) => {
                        administracionBack.queryEjecuteSql(consultasSql.cursosdata[1].consulta).then((areaQue) => {
                            administracionBack.queryEjecuteSql(consultasSql.cursosdata[2].consulta).then((cursoQue) => {
                                administracionBack.queryEjecuteSql(consultasSql.cursosdata[3].consulta).then((modCursQue) => {
                                    resolve({ data: { inner: innQue.resultado, arcrs: areaQue.resultado, crs: cursoQue.resultado, mdl_crs: modCursQue.resultado } })
                                })
                            })
                        })
                    })

                }).catch(() => {
                    console.log('algo ocurrio en el sendDatacursos');
                })
            }
        },

        curso: {
            registro: {
                registrarCurso: function(curso) {
                    console.log({ cursoRegistre: curso.curso.cursoDefinicion.curso });
                    console.log({ curso: curso.curso });
                    return new Promise((resolve, reject) => {


                        let funcionalidades = {


                            registroCursos: function(cursoVerific) {
                                return new Promise((resolve, reject) => {
                                    let cursoWard = curso.curso;
                                    funcionalidades.consultas.consultaExistenciaCurso(cursoVerific).then((cc) => {
                                        if (cc.existencia == true) {
                                            resolve({ registroCurso: false });
                                        } else {
                                            //funcionalidades siguientes
                                            /**
                                             * Registro Curso
                                             */
                                            crypto.generateCode().then((codeCurso) => {
                                                let dataCurso = [codeCurso, cursoWard.cursoDefinicion.curso.codigoSence, cursoWard.cursoDefinicion.curso.nombreCurso, cursoWard.cursoDefinicion.curso.area, cursoWard.cursoDefinicion.curso.imagenCurso, cursoWard.cursoDefinicion.curso.descripcion, cursoWard.cursoDefinicion.curso.totalHorasCurso, cursoWard.cursoDefinicion.curso.cantPruebas];
                                                administracionBack.queryEjecuteSqlParam(consultasSql.curso[1].registro[0].registrocurso.consulta[0].c, dataCurso).then((registroCursoRepuesta) => {
                                                    if (registroCursoRepuesta.error == null) {

                                                        curso.curso.pruebasCurso.pruebasCurso.forEach((pruebasCurso) => {

                                                            crypto.generateCode().then(codigoPrueba => {
                                                                let dataPrueba = [codigoPrueba, pruebasCurso.prueba[Number(Object.keys(pruebasCurso.prueba))], pruebasCurso.numPrueba, codeCurso]
                                                                administracionBack.queryEjecuteSqlParam(consultasSql.curso[2].temPruebas.consulta[0].c, dataPrueba).then((rp) => {

                                                                })
                                                            })


                                                        })

                                                        funcionalidades.registroModulos(cursoWard.modulos, codeCurso).then((mr) => {
                                                            if (mr.registroModulos == true) {
                                                                funcionalidades.registroPruebas(curso.curso.pruebasCurso).then(registroPruebas => {
                                                                    if (registroPruebas == true) {
                                                                        resolve({ registroCurso: true });
                                                                    }
                                                                })

                                                            }
                                                        })
                                                    }
                                                })
                                            })

                                        }
                                    })
                                })

                            },
                            registroModulos: function(modulos, codeCurso) {
                                return new Promise((resolve, reject) => {

                                    let cont = 0;
                                    modulos.forEach((modulo, indexModulo) => {
                                        cont = cont + 1;
                                        crypto.generateCode().then((codModulo) => {
                                            let dataModulo = [codModulo, modulo.moduloDefinicion.nombreModulo, modulo.moduloDefinicion.descripcion, codeCurso, modulo.moduloDefinicion.numeroModulo, modulo.moduloDefinicion.cantPruebas, modulo.moduloDefinicion.totalHorasModulo];
                                            administracionBack.queryEjecuteSqlParam(consultasSql.curso[1].registro[0].registrocurso.consulta[1].c, dataModulo).then((registroModuloRespuesta) => {

                                                if (registroModuloRespuesta.error == null) {
                                                    //registro pruebas
                                                    curso.curso.pruebasCurso.pruebasModulo.forEach((pruebasModulo) => {
                                                        if (pruebasModulo.numModulo == modulo.moduloDefinicion.numeroModulo) {
                                                            crypto.generateCode().then(codigoPrueba => {
                                                                let dataPrueba = [codigoPrueba, pruebasModulo.prueba[Number(Object.keys(pruebasModulo.prueba))], pruebasModulo.numPrueba, codModulo]
                                                                administracionBack.queryEjecuteSqlParam(consultasSql.curso[2].temPruebas.consulta[0].c, dataPrueba).then((rp) => {

                                                                })
                                                            })

                                                        }
                                                    })
                                                    funcionalidades.registroClases(modulo.clases, codModulo, modulo.moduloDefinicion.numeroModulo).then((rg) => {

                                                    })
                                                }
                                            })
                                        })
                                    })
                                    if (cont == modulos.length) {
                                        /**
                                         * Registro de clases
                                         */
                                        resolve({ registroModulos: true });

                                    }
                                })
                            },
                            registroClases: function(clases, codModulo, numeroModulo) {
                                return new Promise((resolve, reject) => {
                                    let cont = 0;
                                    clases.forEach((clase, indexClase) => {
                                        cont = cont + 1;
                                        crypto.generateCode().then((codClase) => {
                                            let dataClase = [codClase, clase.claseDefinicion.numeroClase, clase.claseDefinicion.nombreClase, clase.claseDefinicion.descripcion, clase.claseDefinicion.cantPruebas, codModulo, clase.claseDefinicion.totalHorasClase];
                                            administracionBack.queryEjecuteSqlParam(consultasSql.curso[1].registro[0].registrocurso.consulta[2].c, dataClase).then((registroClaseRespuesta) => {
                                                if (registroClaseRespuesta.error == null) {

                                                    curso.curso.pruebasCurso.pruebasClases.forEach((pruebasClases) => {
                                                        if (pruebasClases.numModulo == numeroModulo && pruebasClases.numClase == clase.claseDefinicion.numeroClase) {
                                                            crypto.generateCode().then(codigoPrueba => {
                                                                let dataPrueba = [codigoPrueba, pruebasClases.prueba[Number(Object.keys(pruebasClases.prueba))], pruebasClases.numPrueba, codClase]
                                                                administracionBack.queryEjecuteSqlParam(consultasSql.curso[2].temPruebas.consulta[0].c, dataPrueba).then((rp) => {

                                                                })
                                                            })

                                                        }
                                                    })
                                                    funcionalidades.registroContenidos(clase.contenidos, codClase);
                                                }
                                            })
                                        })
                                    })
                                    if (cont == clases.length) {
                                        resolve({ registroClases: true });
                                    }
                                })
                            },
                            registroContenidos: function(contenidos, codClase) {
                                return new Promise((resolve, reject) => {
                                    crypto.generateCode().then((codContenido) => {
                                        contenidos.forEach((contenido, indexContenido) => {
                                            let dataContenido = [codContenido, contenido.numeroContenido, contenido.contenidoActivo, contenido.nombre, contenido.descripcion, contenido.url, codClase];
                                            administracionBack.queryEjecuteSqlParam(consultasSql.curso[1].registro[0].registrocurso.consulta[3].c, dataContenido).then(registroContenidoRespuesta => {

                                            })
                                        })
                                    })
                                })
                            },
                            registroPruebas: function(pruebas) {
                                return new Promise((resolve, reject) => {
                                    pruebas.pruebasCurso.forEach(pCurso => {
                                        pCurso
                                    })
                                    resolve(true);
                                })
                            },
                            consultas: {
                                consultaExistenciaCurso: function(curso) {
                                    return new Promise((resolve, reject) => {

                                        administracionBack.queryEjecuteSqlParam(consultasSql.curso[1].registro[0].registrocurso.consulta[4].c, curso).then((consultaCursoRespuesta) => {
                                            if (consultaCursoRespuesta.resultado.length > 0) {
                                                resolve({ existencia: true });
                                            } else {
                                                resolve({ existencia: false });
                                            }
                                        })
                                    })
                                }
                            },

                        }
                        let cursoWard = curso.curso;
                        let consultaCurso = [cursoWard.cursoDefinicion.curso.codigoSence];
                        funcionalidades.registroCursos(consultaCurso).then(rc => {
                                if (rc.registroCurso == true) {
                                    resolve({ data: { registro: true } });
                                }
                            })
                            /*
                            let cursoWard = curso.curso;
                            //console.log({ mantecol: curso.curso.cursoDefinicion });
                            crypto.generateCode().then((codeCurso) => {
                                let consultaCurso = [cursoWard.cursoDefinicion.curso.codigoSence];
                                administracionBack.queryEjecuteSqlParam(consultasSql.curso[1].registro[0].registrocurso.consulta[4].c, consultaCurso).then((consultaCursoRespuesta) => {
                                    console.log({ consultaCursoRespuesta: consultaCursoRespuesta });
                                    if (consultaCursoRespuesta.resultado.length > 0) {
                                        resolve({ data: { registro: 'existente' } });
                                    } else {
                                        let dataCurso = [codeCurso, cursoWard.cursoDefinicion.curso.codigoSence, cursoWard.cursoDefinicion.curso.nombreCurso, cursoWard.cursoDefinicion.curso.area, cursoWard.cursoDefinicion.curso.imagenCurso, cursoWard.cursoDefinicion.curso.descripcion, cursoWard.cursoDefinicion.curso.totalHorasCurso];
                                        administracionBack.queryEjecuteSqlParam(consultasSql.curso[1].registro[0].registrocurso.consulta[0].c, dataCurso).then((registroCursoRepuesta) => {
                                            if (registroCursoRepuesta.error == null) {
                                                let modulos = cursoWard.modulos;
                                                console.log({ moduloDefinicion: modulos });
                                                modulos.forEach((modulo, indexModulo) => {
                                                    console.log({ modulos: modulo });
                                                    crypto.generateCode().then((codModulo) => {
                                                        let dataModulo = [codModulo, modulo.moduloDefinicion.nombreModulo, modulo.moduloDefinicion.descripcion, codeCurso, modulo.moduloDefinicion.numeroModulo, modulo.moduloDefinicion.cantPruebas, modulo.moduloDefinicion.totalHorasModulo]
                                                        administracionBack.queryEjecuteSqlParam(consultasSql.curso[1].registro[0].registrocurso.consulta[1].c, dataModulo).then((registroModuloRespuesta) => {
                                                            console.log({ errorRegistroModulo: registroModuloRespuesta.error });
                                                            if (registroModuloRespuesta.error == null) {
                                                                console.log({ clases: modulo.clases });
                                                                modulo.clases.forEach((clase, indexClase) => {
                                                                    crypto.generateCode().then((codClase) => {
                                                                        let dataClase = [codClase, clase.claseDefinicion.numeroClase, clase.claseDefinicion.nombreClase, clase.claseDefinicion.descripcion, clase.claseDefinicion.cantPruebas, codModulo, clase.claseDefinicion.totalHorasClase];
                                                                        administracionBack.queryEjecuteSqlParam(consultasSql.curso[1].registro[0].registrocurso.consulta[2].c, dataClase).then((registroClaseRespuesta) => {
                                                                            if (registroClaseRespuesta.error == null) {
                                                                                console.log({ contenido: clase });
                                                                                crypto.generateCode().then((codContenido) => {
                                                                                    clase.contenidos.forEach((contenido, indexContenido) => {
                                                                                        let dataContenido = [codContenido, contenido.numeroContenido, contenido.contenidoActivo, contenido.nombre, contenido.descripcion, contenido.url, codClase];
                                                                                        administracionBack.queryEjecuteSqlParam(consultasSql.curso[1].registro[0].registrocurso.consulta[3].c, dataContenido).then(registroContenidoRespuesta => {
                                                                                            if (registroContenidoRespuesta.error == null) {
                                                                                                console.log('se termino de registrar todo el curso');
                                                                                            }
                                                                                        })
                                                                                    })
                                                                                })
                                                                            }
                                                                        })
                                                                    })
                                                                })
                                                            }
                                                        })
                                                    })
                                                    let largo = indexModulo + 1;
                                                    if (largo == modulos.length) {
                                                        resolve({ data: { registro: true } });
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            })*/



                        //administracionBack.queryEjecuteSqlParam
                        //extración contenido curso

                    })
                }
            },


            /**
             * Select desde la base de dato
             */
            selectData: {
                area: function() {
                    return new Promise((resolve, reject) => {

                        administracionBack.queryEjecuteSql(consultasSql.curso[0].select[0].area.consulta).then((response) => {
                            if (response.error == null) {
                                resolve({ data: { area: response.resultado } });
                            }
                        })
                    })
                },
                cursos: function(externCurso) {
                    return new Promise((resolve, reject) => {
                        let funcionalidades = {
                            externCurso: function(cursos) {
                                return new Promise((resolve, reject) => {
                                    let dataCurso = [];
                                    externCurso.externCurso.forEach(curso => {
                                        cursos.resultado.forEach(cursoItem => {
                                            if (curso == cursoItem.cod_curso) {
                                                dataCurso.push(cursoItem);
                                            }
                                        })
                                    })
                                    resolve(dataCurso);
                                })


                            }
                        }
                        administracionBack.queryEjecuteSql(consultasSql.curso[0].select[0].curso.consulta[0].c).then((cursos) => {
                            if (cursos.error == null) {
                                if (externCurso != undefined && Object.keys(externCurso) == 'externCurso') {
                                    funcionalidades.externCurso(cursos).then(r => {
                                        resolve(r);
                                    })


                                } else {
                                    resolve({ data: { cursos: cursos.resultado } });
                                }

                            }
                        })
                    })
                },
                dataAllCurso: function(cursos) {
                    console.log({ cursosManteocl: cursos });
                    return new Promise((resolve, reject) => {
                        let consultas = {
                            modulos: consultasSql.curso[0].select[0].curso.consulta[1].c,
                            clases: consultasSql.curso[0].select[0].curso.consulta[2].c,
                            contenidos: consultasSql.curso[0].select[0].curso.consulta[3].c,
                            pruebas: consultasSql.curso[0].select[0].curso.consulta[4].c,
                            pruebasNoDefinidas: consultasSql.curso[2].temPruebas.consulta[1].c
                        }
                        console.log({ consultaPruebas: consultasSql.curso[0].select[0].curso.consulta[4].c });
                        let cursoData = {
                            curso: Object,
                            modulos: [],


                        }

                        let funcionalidades = {
                            validacionExistPruebas: function(cursoData) {
                                /**
                                 * Metodo que  evalua existencia de pruebas en cursos modulos y clases
                                 */
                                return new Promise((resolve, reject) => {
                                    let cursoValidacion = [];
                                    let val = {
                                        pCurso: 0,
                                        modulos: 0,
                                        clases: 0
                                    }
                                    cursoData.forEach((c, indexC) => {
                                        /**
                                         * cursoPruebas
                                         * 
                                         */

                                        val.pCurso = c.pruebasNoDefinidas.length;
                                        console.log({ pruebasCurso: c.pruebasNoDefinidas.length });
                                        /**
                                         * modulosPruebas
                                         */
                                        let pruebasModulos = 0;
                                        let pruebasClases = 0;
                                        c.modulos.forEach(m => {
                                            pruebasModulos = pruebasModulos + m.pruebasNoDefinidas.length;

                                            m.clases.forEach(clase => {
                                                pruebasClases = pruebasClases + clase.pruebasNoDefinidas.length
                                            })


                                        })

                                        val.modulos = pruebasModulos;
                                        val.clases = pruebasClases;

                                        if (val.pCurso > 0 && val.modulos > 0 && val.clases > 0) {

                                            cursoValidacion.push(val);
                                        } else {
                                            cursoData.splice(c, 1);
                                        }

                                        val = {
                                            pCurso: 0,
                                            modulos: 0,
                                            clases: 0
                                        }

                                    })
                                    setTimeout(() => {
                                        resolve(cursoData);
                                    }, 20);
                                })
                            },
                            obtencionDePruebas: function(cod) {
                                return new Promise((resolve, reject) => {
                                    administracionBack.queryEjecuteSqlParam(consultas.pruebas, cod).then(pruebas => {
                                        if (pruebas.error != null) {
                                            console.log({ errorMessage: 'hubo un error al obtener la prueba', error: pruebas.error });
                                            resolve(false);
                                        } else {
                                            resolve(pruebas.resultado);
                                        }
                                    })
                                })
                            },
                            obtencionPruebasNoDefinidas: function(cod) {
                                return new Promise((resolve, reject) => {
                                    administracionBack.queryEjecuteSqlParam(consultas.pruebasNoDefinidas, cod).then(pruebas => {
                                        if (pruebas.error != null) {
                                            resolve(false);
                                        } else {
                                            resolve(pruebas.resultado);
                                        }
                                    })
                                })
                            },
                            obtencionModulos: function(codCurso) {
                                return new Promise((resolve, reject) => {
                                    administracionBack.queryEjecuteSqlParam(consultas.modulos, codCurso).then(modulos => {
                                        resolve(modulos.resultado); // || modulosRes.error;
                                    })
                                })

                            },
                            obtencionClases: function(cod_modulo) {
                                return new Promise((resolve, reject) => {
                                    administracionBack.queryEjecuteSqlParam(consultas.clases, cod_modulo).then(clases => {
                                        resolve(clases.resultado);
                                    })
                                })
                            },
                            obtencionContenidos: function(cod_clase) {
                                return new Promise((resolve, reject) => {
                                    administracionBack.queryEjecuteSqlParam(consultas.contenidos, cod_clase).then(contenidos => {
                                        resolve(contenidos.resultado);
                                    })

                                })
                            },
                            obtencionDataCurso: function(curso) {
                                return new Promise((resolve, reject) => {
                                    let cursoItem = {
                                            curso: curso,
                                            pruebas: [],
                                            pruebasNoDefinidas: [],
                                            modulos: [],
                                            mantecol: 'hola sot el mantecol'
                                        }
                                        //pruebas declaradas no definidas
                                    funcionalidades.obtencionPruebasNoDefinidas(curso.cod_curso).then(pruebaNDCurso => {
                                        if (pruebaNDCurso != false) {
                                            cursoItem.pruebasNoDefinidas = pruebaNDCurso;
                                        }
                                    })
                                    funcionalidades.obtencionDePruebas(curso.cod_curso).then(pruebasCurso => {
                                        cursoItem.pruebas = pruebasCurso;
                                    })

                                    funcionalidades.obtencionModulos(curso.cod_curso).then(modulos => {

                                            modulos.forEach((modulo, indexModulo) => {
                                                let moduloItem = {
                                                    modulo: modulo,
                                                    pruebas: [],
                                                    pruebasNoDefinidas: [],
                                                    clases: []
                                                };
                                                //pruebas registradas
                                                funcionalidades.obtencionDePruebas(modulo.cod_modulo_curso).then(pruebasMod => {

                                                        moduloItem.pruebas = pruebasMod;
                                                        console.log({ pruebasObtenidasModulos: pruebasMod, indexModulo: indexModulo });

                                                    })
                                                    //pruebas declaradas no definidas
                                                funcionalidades.obtencionPruebasNoDefinidas(modulo.cod_modulo_curso).then(pruebaNDMod => {

                                                    moduloItem.pruebasNoDefinidas = pruebaNDMod;

                                                })

                                                funcionalidades.obtencionClases(modulo.cod_modulo_curso).then(clases => {

                                                        clases.forEach((clase, indexClases) => {
                                                            let claseItem = {
                                                                clase: clase,
                                                                pruebas: [],
                                                                pruebasNoDefinidas: [],
                                                                contenidos: []
                                                            };

                                                            funcionalidades.obtencionDePruebas(clase.cod_clases).then(pruebasClass => {

                                                                claseItem.pruebas = pruebasClass;
                                                                console.log({ pruebasObtenidasclases: pruebasClass, indexModulo: indexModulo, indexClase: indexClases });

                                                            })

                                                            //pruebas declaradas no definidas
                                                            funcionalidades.obtencionPruebasNoDefinidas(clase.cod_clases).then(pruebaNDClas => {
                                                                if (pruebaNDClas != false) {
                                                                    claseItem.pruebasNoDefinidas = pruebaNDClas;
                                                                }
                                                            })


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
                                    if (Object.keys(cursosItem[0]).indexOf('cod_curso') > -1) {
                                        cursosItem.forEach(curso => {
                                            funcionalidades.obtencionDataCurso(curso).then(data => {
                                                cursosDataArr.push(data);
                                            })

                                        })
                                    } else {
                                        console.log({ message: 'estamos ante extern curso', curso: cursosItem });
                                        administracionBack.administracionCursos.curso.selectData.cursos({ externCurso: cursosItem }).then(externDataCurso => {
                                            externDataCurso.forEach((curso) => {
                                                funcionalidades.obtencionDataCurso(curso).then(data => {
                                                    cursosDataArr.push(data);
                                                })
                                            })
                                        })

                                    }
                                    setTimeout(() => {
                                        resolve(cursosDataArr);
                                    }, 10000);
                                })

                            }
                        }
                        console.log({ consultas: { modulos: consultas.modulos, clases: consultas.clases, contenidos: consultas.contenidos } });
                        let cursosDatas = [];
                        funcionalidades.cursosArray(cursos).then(CursoResolve => {
                            console.log({ dataProcesadaCurso: CursoResolve });

                            setTimeout(() => {
                                funcionalidades.validacionExistPruebas(CursoResolve).then(cursos => {
                                    resolve({ data: { cursos: cursos }} );
                                })

                            }, 20)

                        });
                        /* cursos.forEach(curso => {
                             funcionalidades.obtencionDataCurso(curso).then(dataItemCursoAm => {
                                 cursosDatas.push(dataItemCursoAm);
                             })
                         })
                         setTimeout(() => {
                             resolve({ data: { cursos: cursosDatas } });
                         }, 1500);*/



                    })
                }
            },
            registerData: {
                area: function(areas) {
                    return new Promise((resolve, reject) => {
                        //let area =[area.area.];

                        areas.forEach((area, indexArea) => {
                            crypto.generateCode().then((areaCode) => {
                                let areaValid = [area];
                                //verifica existencia area
                                administracionBack.queryEjecuteSqlParam(consultasSql.curso[1].registro[0].registroArea.consulta[1].c, areaValid).then((consultaAreaRespuesta) => {
                                    if (consultaAreaRespuesta.resultado.length > 0) {
                                        resolve({ data: { registro: 'existente', areaExistente: area } });
                                    } else {
                                        let areaItem = [areaCode, area];
                                        administracionBack.queryEjecuteSqlParam(consultasSql.curso[1].registro[0].registroArea.consulta[0].c, areaItem).then((registroAreaRespuesta) => {
                                            if (registroAreaRespuesta.error == null) {
                                                resolve({ data: { registro: true } });
                                            }
                                        })
                                    }

                                })
                            })
                        })


                    })
                }
            },
            delete: {
                deleteCurso: function(delCursos) {
                    //console.log({ cursosABorrar: delCursos });
                    return new Promise((resolve, reject) => {
                        //console.log({ remueveCurso: delCursos[0].removeCursoExtern.pruebasTemporalesDelete });
                        console.log({ loQueReciboActualmente: delCursos })


                        let funcionalidades = {
                            removerPruebasTemporales: function(pruebas) {
                                return new Promise((resolve, reject) => {
                                    if (Object.keys(delCursos[0].removeCursoExtern.pruebasTemporalesDelete)[0] == 'pruebasTemporales') {
                                        delCursos[0].removeCursoExtern.pruebasTemporalesDelete.pruebasTemporales.forEach(prueba => {
                                            let parameterPrueba = [prueba];

                                            administracionBack.queryEjecuteSqlParam(consultasSql.curso[2].temPruebas.consulta[2].c, parameterPrueba).then(rp => {

                                            })

                                        })
                                    }

                                    resolve(true);
                                })
                            },
                            removerPruebas: function() {
                                return new Promise((resolve, reject) => {
                                    //console.log({ remueveCurso: delCursos[0].removeCursoExtern.pruebasTemporalesDelete });
                                    Object.keys(delCursos[0].removeCursoExtern.pruebasTemporalesDelete).forEach(i => {
                                        if (i == 'pruebas') {
                                            delCursos[0].removeCursoExtern.pruebasTemporalesDelete.pruebas.forEach(prueba => {
                                                administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[1].delete[0].deleteprueba.consulta, prueba).then(r => {

                                                })

                                            })
                                        }
                                    })



                                    resolve(true);
                                })

                            },
                            moduloDelete: function(modulos) {
                                return new Promise((resolve, reject) => {
                                    modulos.forEach((modulo) => {
                                        funcionalidades.pruebasDelete(modulo.pruebas);
                                        funcionalidades.pruebaTDelete(modulo.pruebasNoDefinidas);
                                        funcionalidades.claseDelete(modulo.clases);
                                    })
                                    resolve(true);

                                })

                            },
                            claseDelete: function(clases) {
                                clases.forEach(clase => {
                                    funcionalidades.pruebasDelete(clase.pruebas);
                                    funcionalidades.pruebaTDelete(clase.pruebasNoDefinidas);
                                })

                                console.log({ clasesAmm: clases });
                            },
                            cursoDelete: function(cursos) {
                                return new Promise((resolve, reject) => {
                                    cursos.forEach(curso => {

                                        let parameterCurso = [curso.curso.cod_curso];
                                        funcionalidades.moduloDelete(curso.modulos).then(md => {
                                                if (md == true) {
                                                    funcionalidades.pruebasDelete(curso.pruebas);
                                                    funcionalidades.pruebaTDelete(curso.pruebasNoDefinidas);
                                                    administracionBack.queryEjecuteSqlParam(consultasSql.curso[0].delete[0].deleteCursos.consulta[0].c, parameterCurso).then((deleteCursoResponse) => {
                                                        if (deleteCursoResponse.error == null) {
                                                            resolve(true);

                                                        }

                                                    })
                                                }
                                            })
                                            /**/

                                        //console.log({ cursoDelete: curso, pruebasNoDefinidas: curso.pruebasNoDefinidas });
                                        //funcionalidades.pruebasDelete(curso.pruebas);
                                        //funcionalidades.pruebaTDelete(curso.pruebasNoDefinidas);
                                    })

                                })
                            },
                            pruebasDelete: function(pruebas) {

                                pruebas.forEach(prueba => {
                                    let pruebaParameter = [prueba.cod_prueba];
                                    administracionBack.queryEjecuteSqlParam(consultasSql.administracionpruebas[1].delete[0].deleteprueba.consulta, pruebaParameter).then(r => {

                                    })
                                    console.log({ pruebaDelete: prueba });
                                });

                            },
                            pruebaTDelete: function(pruebasTemporales) {
                                pruebasTemporales.forEach(pTemporal => {
                                    let pruebaTParameter = [pTemporal.cod];
                                    administracionBack.queryEjecuteSqlParam(consultasSql.curso[2].temPruebas.consulta[2].c, pruebaTParameter).then(rp => {

                                    })
                                    console.log({ pTemporalDelete: pTemporal, codigoPrueba: pTemporal.cod });
                                })
                            }

                        }


                        //console.log({ arrayPruebas: delCursos });
                        //console.log({ objectKeys: Object.keys(delCursos)[0][0] });

                        if (Object.keys(delCursos[0])[0] == 'removeCursoExtern') {
                            delCursos.forEach((arr) => {
                                //console.log({ verCurso: arr });
                                //console.log({ verCursoObjectKeys: Object.keys(arr) });
                                if (Object.keys(arr) == 'removeCursoExtern') {
                                    let removerCursoParameter = [arr.removeCursoExtern.removeCursoExtern];
                                    console.log({ removeCursoParameter: removerCursoParameter });



                                    administracionBack.queryEjecuteSqlParam(consultasSql.curso[0].delete[0].deleteCursos.consulta[0].c, removerCursoParameter).then((deleteCursoResponse) => {
                                        if (deleteCursoResponse.error == null) {
                                            funcionalidades.removerPruebasTemporales(arr.removeCursoExtern.pruebasTemporalesDelete).then(r => {
                                                if (r == true) {
                                                    funcionalidades.removerPruebas().then(f => {
                                                        if (f == true) {
                                                            resolve({ data: { delete: true } });
                                                        }

                                                    })

                                                }
                                            })

                                        }

                                    })


                                }
                            })
                        } else {
                            console.log('no hay nada que hacer');

                            administracionBack.administracionCursos.curso.selectData.dataAllCurso(delCursos).then(dataCurso => {
                                console.log({ estoyRecibiendoDataCursoAm: dataCurso.data.cursos });
                                funcionalidades.cursoDelete(dataCurso.data.cursos).then(r => {
                                    resolve({ data: { delete: r } });
                                })
                            })


                        }




                        /*if (Object.keys(delCursos)[0] == 'removeCursoExtern') {
                            console.log('remuevo curso externo');
                        }*/
                        /*
                        let cursoLength = delCursos.length - 1;
                        delCursos.forEach((codeCurso, index) => {
                            administracionBack.queryEjecuteSqlParam(consultasSql.curso[0].delete[0].deleteCursos.consulta[0].c, codeCurso).then((deleteCursoResponse) => {
                            })
                            if (cursoLength == index) {
                                resolve({ data: { delete: true } });
                            }
                        })*/

                    })
                },
                deleteAreas: function(area) {
                    return new Promise((resolve, reject) => {
                        //console.log({ areaDeleteRecibe: areas });
                        let consultas = {
                            deleteArea: consultasSql.curso[0].delete[1].deleteAreas.consulta[0].c
                        }
                        let parameterDeleteArea = [area.cod_area];
                        administracionBack.queryEjecuteSqlParam(consultas.deleteArea, parameterDeleteArea).then((dar) => {
                            if (dar.error == null) {
                                resolve({ data: { delete: true } });
                            } else {
                                resolve({ data: { delete: false } });
                            }
                        })




                    })
                }
            },
            update: {
                updateArea: function(areaUpdate) {
                    return new Promise((resolve, reject) => {
                        let consultas = {
                            updateNameUnArea: consultasSql.curso[0].update[0].updateArea.consulta[0].c
                        }
                        console.log({ areaUpdate: areaUpdate, consuta: consultas.updateNameUnArea });
                        let parameterUpdate = [areaUpdate.valorEdicion, areaUpdate.area.cod_area];
                        administracionBack.queryEjecuteSqlParam(consultas.updateNameUnArea, parameterUpdate).then(callBack => {
                            if (callBack.error == null) {
                                resolve({ data: { editado: true } });
                            } else {
                                resolve({ data: { editado: false } });
                            }
                        })

                    })
                }
            }

        }

    },


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

module.exports = {
    administracionBack
}