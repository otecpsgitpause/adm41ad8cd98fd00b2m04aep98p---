'use strict'
var _ = require('lodash');
var moment = require('moment');
moment.locale('es');
var crypto = require('../../util-implements/cryptojs-implement');
var admQuery = require('../../bds/mysql/querys/models/administracion-b/administracion-query');
var mgbCNDModel = require('../../bds/mongodb/model/noDefinidas');
var mgbCursosModel = require('../../bds/mongodb/model/cursos');
var mgbClientesOtecModel = require('../../bds/mongodb/model/clientesOtec');
var mgbfrontPageModel = require('../../bds/mongodb/model/frontPageAdm');
var mgbComplDataCurso = require('../../bds/mongodb/model/complDataCurso');
var mgbPeticionCurso = require('../../bds/mongodb/model/peticionesCurso');
var mgbOtecs = require('../../bds/mongodb/model/otecs');
//funciones migracion

var adminbackend = {
    genericUse: {
        peticionCurso: peticionCurso
    },
    frontPageAdministracion: {
        getPosiciones: getPosiciones,
        alertasMensajes: {
            getRegisteredAlertsMensajes: getRegisteredAlertsMensajes,
            registerAlertsMesaje: registerAlertsMesaje,
            deleteAlertMesaje: deleteAlertMesaje,
            updateAlertMess: updateAlertMess

        },
        pagos: {
            addBtnPay: addBtnPay,
            getBtnPay: getBtnPay,
            updateBtnPay:updateBtnPay,
            deleteBtnPay:deleteBtnPay
        }
    },
    loginAdminstracion: loginAdminstracion,
    gestionClientesOtec: {
        estudiantes: {
            añadirEstudiante: añadirEstudiante,
            buscarEstudiante: buscarEstudiante,
            deleteUsuario: deleteUsuario,
            inscribirEstudianteCurso: inscribirEstudianteCurso
        }

    },
    administracionCursos: {
        /**
         * Metodos Modulo Administración Pruebas
         */
        administracionPruebas: {
            registrarPrueba: registrarPrueba
            ,
            sendDataCursos: sendDataCursos,
            sendPruebasRegistradas: sendPruebasRegistradas,
            deletePrueba: deletePrueba,
            editarPrueba: editarPrueba,
            registrarPruebaEditada: registrarPruebaEditada


        },
        registro: {
            registroCurso: registroCurso,  //o-- cursos.service registroCurso(p)
            registroArea: registroArea
        },
        cursos: {
            genericMethodCurso:{
                genericAccionCurso:genericAccionCurso
            },
            delete: {
                deleteCursos: deleteCursos,
                deleteArea: deleteArea,
                deleteCursoND: deleteCursoND,
                deleteCursoConBtn:deleteCursoConBtn
            },
            select: {
                area: {
                    dataArea: dataArea
                },
                cursos: {
                    cursosNoDefinidos: cursosNoDefinidos,
                    dataCursos: dataCursos
                }
            },
            update: {
                updateArea: updateArea,
                updateCursoSendData: updateCursoSendData,
                updateCurso: updateCurso,
                actualizarCurso:actualizarCurso,
                updateParamCurso:updateParamCurso
            },
            registrar:{
                registrarOpcion:registrarOpcion
            }
        }
    },

    otecs: {
        otec: {
            registro: {
                registroOtec: registroOtec
            }
        },
        usuarios: {
            registro: {
                registroUsuario: registroUsuario
            }
        }
    }

}

function deleteCursoConBtn(req,res){
    let data = req.body.data;
    let identificador= data.i.usuario.idnt;
    let cursoAccion= data.u;
    console.log({deleteCursoConBtn:{cursoAccion:cursoAccion}});
    mgbCursosModel.remove({"curso.cod_curso":cursoAccion.curso},(errDeleteCurso)=>{
        console.log({errDeleteCurso:errDeleteCurso});
    })
    var method = {
        respuesta: (item) => {
            let strgData = JSON.stringify({ data: { respuesta:item.respuesta } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        }
    }
}

function updateParamCurso(req,res){
    let data = req.body.data;
    let identificador= data.i.usuario.idnt;
    let cursoAccion= data.u;

    console.log({updateParamCurso:{cursoAccion:cursoAccion.param}});

    
    var method = {
        respuesta: (item) => {
            let strgData = JSON.stringify({ data: { respuesta:item.respuesta } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        }
    }

    mgbCursosModel.update({"curso.cod_curso":cursoAccion.param.cod_curso},{
        
        $set:{
            "curso":cursoAccion.param,
            "activo":cursoAccion.param.active
        }

    },(err,raw)=>{
        if(err==null){
            method.respuesta({respuesta:{update:true}});
        }else{
            method.respuesta({respuesta:{update:false}});
        }
    })
}



function genericAccionCurso(req,res){

    var method = {
        respuesta: (item) => {
            let strgData = JSON.stringify({ data: { respuesta:item.respuesta } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        },
        updateItem:(param)=>{
            console.log({updateItem:{update:param.update,param:param.param}});
            let updateItemGuso=param.update;
         

            
            mgbCursosModel.update({"curso.cod_curso":param.param.cod_curso},{
                
                $set:updateSet
            },(err,raw)=>{
                if(err==null){
                    method.respuesta({respuesta:{update:true}});
                }else{
                    method.respuesta({respuesta:{update:false}});
                }
            })
        },
        deleteItem:(param)=>{
            console.log({deleteItem:{param:param}});
            
            mgbCursosModel.remove({"curso.cod_curso":param.cod_curso},(errDeleteCurso)=>{
                console.log({deleteCurso:errDeleteCurso});
                if(errDeleteCurso==null){
                    mgbfrontPageModel.find({},(err,frontCurso)=>{
                        console.log({frontCurso:frontCurso});
                        let idxBoton= _.findIndex(frontCurso[0].botonesPago,(o)=>{
                            return o.titleCurso.cod_curso==param.cod_curso;
                        })

                        if(idxBoton>-1){
                            frontCurso[0].botonesPago.splice(idxBoton,1);
                            mgbfrontPageModel.update({"_id":frontCurso._id},{
                                $set:{
                                    "botonesPago":frontCurso[0].botonesPago
                                }
                            },(err,raw)=>{
                                if(errDeleteCurso==null){
                                    method.respuesta({respuesta:{delete:true}});
                                }else{
                                    method.respuesta({respuesta:{delete:false}});
                                }
                            })
                        }else{
                            if(errDeleteCurso==null){
                                console.log('respuesta entregada');
                                method.respuesta({respuesta:{delete:true}});
                            }else{
                                method.respuesta({respuesta:{delete:false}});
                            }
                        }
                    })
                }else{
                    method.respuesta({respuesta:{delete:false}});
                }
            })
        }

    }


    let data = req.body.data;
    let identificador= data.i.usuario.idnt;
    let cursoAccion= data.u;

    console.log({genericAccionCurso:{data:data,identificador:identificador,u:data.u}});

    if(cursoAccion.method=='deleteCurso'){
        method.deleteItem({cod_curso:cursoAccion.curso});
    }else if(cursoAccion.method=='updateCurso'){
        method.updateItem(cursoAccion);
    }


    
}


function registrarOpcion(req,res){
    let data = req.body.data;
    let identificador= data.i.usuario.idnt;
    let curso = data.u;
    let opcion = curso.opcion;

    mgbCursosModel.updateOne({"curso.cod_curso":curso.curso},{
        $set:{
            "curso.opcionTerminoCurso":opcion
        }
    },(err,raw)=>{
        if(err==null){
            method.respuesta({registrarOpcion:true});
        }else{
            method.respuesta({registrarOpcion:false});
        }
    })

    var method = {
        respuesta: (item) => {
            let strgData = JSON.stringify({ data: { registrarOpcion:item.registrarOpcion } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        }

    }
    console.log({registrarOpcion:{identificador:identificador,curso:curso,opcion:opcion}});
}

function actualizarCurso(req,res){
    let data = req.body.data;
    let identificador= data.i.usuario.idnt;
    let curso = data.u;
    console.log({actualizarCurso:{identificador:identificador,curso:curso}});

    mgbCursosModel.updateOne({"curso.cod_curso":curso.curso.cod_curso},{
        $set:{
            "esquema":curso.esquema,
            "modulos":curso.modulos,
            "pruebasCurso":curso.pruebasCurso
        }
    },(error,raw)=>{
        if(error==null){
            method.respuesta({actualizacionCurso:true});
        }else{
            method.respuesta({actualizacionCurso:false});
        }
    })

    var method = {
        respuesta: (item) => {
            let strgData = JSON.stringify({ data: { actualizacionCurso:item.actualizacionCurso } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        }

    }
}

function inscribirEstudianteCurso(req, res) {
    try {
        let data = req.body.data;
        let cliente = data.cliente;
        let curso = data.curso;
        let identificador = data.ident;
        let idxCsC = Object.keys(data).indexOf('cursosSuscrito');
        let cursosSuscritoUser = null;
        if (idxCsC == -1) {
            cursosSuscritoUser = [];
        } else {
            cursosSuscritoUser = data.cursosSuscrito;
        }

        mgbCursosModel.find({ "curso.cod_curso": curso }, (err, resCursos) => {
            if (err == null && resCursos.length > 0) {
                let idxCursoSuscrito = _.findIndex(cursosSuscritoUser, (o) => {
                    return o.esquema.curso.cod_curso == curso;
                })
                if (idxCursoSuscrito == -1) {
                    let modelObjectCursoSuscrito = {
                        curso: {
                            data: resCursos[0].curso

                        },
                        esquema: resCursos[0].esquema,
                        avances: [],
                        pruebasContestadas: [

                        ],


                        fechaInscripcion: { fecha: moment().format('MMMM Do YYYY, h:mm:ss a') },
                        terminoCurso: {
                            fecha: ""
                        }
                    }
                    cursosSuscritoUser.push(modelObjectCursoSuscrito);
                    mgbClientesOtecModel.update({ "cliente.rut": cliente.rut, "identificador.key": identificador }, {
                        $set: {
                            cursosSuscrito: cursosSuscritoUser
                        }
                    }, (err, raw) => {
                        if (err == null) {
                            mgbClientesOtecModel.findOne({ "cliente.rut": cliente.rut, "identificador.key": identificador }, (err, resClienteRes) => {
                                if (err == null && resClienteRes != null) {
                                    method.respuesta({ inscripcion: resClienteRes, error: false, mensaje: 'Usuario inscrito con exito en el curso' });
                                }
                            })

                        } else {
                            method.respuesta({ inscripcion: null, error: true, mensaje: 'Hubo un problema al inscribir al usuario en el curso, intente despues' });
                        }
                    })
                } else {
                    method.respuesta({ inscripcion: null, error: true, mensaje: 'El usuario ya está inscrito en este curso' });
                }



            }
        })
        console.log({ inscribirEstudianteCurso: data });
    } catch (e) {
        method.respuesta({ inscripcion: null, error: true, mensaje: 'Hubo un problema al inscribir al usuario en el curso, intente despues' });
    }
    var method = {
        respuesta: (item) => {
            let strgData = JSON.stringify({ data: { inscripcion: item.inscripcion, error: item.error, mensaje: item.mensaje } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        }

    }

}

function getBtnPay(req, res) {
    try {
        let data = req.body.data;
        let identificador = data.i.usuario.idnt;
        mgbfrontPageModel.findOne({ "identificador.key": identificador }, (err, resFront) => {
            if (err == null) {
                method.respuesta({ btns: resFront.botonesPago, error: false, mensaje: null });

            } else {
                method.respuesta({ btns: [], error: true, mensaje: 'Sin registros' });
            }

        })
    } catch (e) { }

    var method = {
        respuesta: (item) => {
            let strgData = JSON.stringify({ data: { btns: item.btns, error: item.error, mensaje: item.mensaje } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        }

    }
}

function addBtnPay(req, res) {
    try {
        let data = req.body.data;
        let identificador = data.i.usuario.idnt;
        let boton = data.u;
        mgbfrontPageModel.findOne({ "identificador.key": identificador }, (err, resFront) => {
            if (err == null) {
                if (resFront.botonesPago.length > 0) {

                    let idxButton = _.findIndex(resFront.botonesPago, (o) => {
                        o.titleCurso.cod_curso==boton.titleCurso.cod_curso;
                    });
                    if (idxButton == -1) {
                        resFront.botonesPago.push(boton);
                        method.registro({ btns: resFront.botonesPago, idnt: identificador });
                    } else {
                        method.respuesta({ registro: false, error: true, mensaje: 'El boton ya se encuentra registrado' })
                    }
                } else {
                    resFront.botonesPago.push(boton);
                    method.registro({ btns: resFront.botonesPago, idnt: identificador });
                }


            } else {
                method.respuesta({ registro: false, error: true, mensaje: 'No hay registros' })
            }
        })


    } catch (e) {
        method.respuesta({ registro: false, error: true, mensaje: 'No se pudo concretar su solicitud intentelo mas tarde' })
    }

    var method = {
        respuesta: (item) => {
            let strgData = JSON.stringify({ data: { registro: item.registro, error: item.error, mensaje: item.mensaje } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        },
        registro: (reg) => {
            mgbfrontPageModel.update({ "identificador.key": reg.idnt }, {
                $set: {
                    "botonesPago": reg.btns
                }
            }, (err, raw) => {
                if (err == null) {
                    method.respuesta({ registro: true, error: false, mensaje: 'Boton registrado con exito' })
                }
            });
        }
    }
}

function updateBtnPay(req,res){
    let data = req.body.data;
    let identificador = data.i.usuario.idnt;
    let boton = data.u;
    mgbfrontPageModel.findOne({ "identificador.key": identificador },(err,resFront)=>{
        if(resFront!=null){
            if(resFront.botonesPago.length>0){
                let idxBoton = _.findIndex(resFront.botonesPago,(o)=>{
                    return o.titleCurso.cod_curso==boton.titleCurso.cod_curso;
                })

                if(idxBoton>-1){
                    resFront.botonesPago.splice(idxBoton,1,boton);
                    mgbfrontPageModel.updateOne({ "identificador.key": identificador },{
                        $set:{
                            "botonesPago":resFront.botonesPago
                        }
                    },(err,raw)=>{
                        if(err==null){
                            //envio respuesta
                            method.respuesta({ update:resFront.botonesPago , error: false, mensaje: '' });
                        }else{
                            //hubo un error
                            method.respuesta({ update:resFront.botonesPago , error: true, mensaje: 'Hubo un error al actualizar el documento' });
                        }
                    })
                }else{
                    //no se encontro el boton en el indice
                    method.respuesta({ update:resFront.botonesPago , error: true, mensaje: 'No se encontro el boton' });
                }

        
            }
        }else{
            //no se encontro el documento
            method.respuesta({ update:[], error: true, mensaje: 'No se encontro el registro' });
        }
    })
    //let idxBoton = _.findIndex()
  
    var method = {
        respuesta: (item) => {
            let strgData = JSON.stringify({ data: { update: item.update, error: item.error, mensaje: item.mensaje } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        }
    }
}

function deleteBtnPay(req,res){
    let data = req.body.data;
    let identificador = data.i.usuario.idnt;
    let boton = data.u;

    mgbfrontPageModel.findOne({ "identificador.key": identificador },(err,resFront)=>{
        if(resFront!=null){
            if(resFront.botonesPago.length>0){
                let idxBoton = _.findIndex(resFront.botonesPago,(o)=>{
                    return o.titleCurso.cod_curso==boton.titleCurso.cod_curso;
                })

                if(idxBoton>-1){
                    resFront.botonesPago.splice(idxBoton,1);
                    mgbfrontPageModel.updateOne({ "identificador.key": identificador },{
                        $set:{
                            "botonesPago":resFront.botonesPago
                        }
                    },(err,raw)=>{
                        if(err==null){
                            //envio respuesta
                            method.respuesta({ delete:resFront.botonesPago , error: false, mensaje: '' });
                        }else{
                            //hubo un error
                            method.respuesta({ delete:resFront.botonesPago , error: true, mensaje: 'Hubo un error al actualizar el documento' });
                        }
                    })
                }else{
                    //no se encontro el boton en el indice
                    method.respuesta({ delete:resFront.botonesPago , error: true, mensaje: 'No se encontro el boton' });
                }

        
            }
        }else{
            //no se encontro el documento
            method.respuesta({ delete:[], error: true, mensaje: 'No se encontro el registro' });
        }
    })


    var method = {
        respuesta: (item) => {
            let strgData = JSON.stringify({ data: { delete: item.delete, error: item.error, mensaje: item.mensaje } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        }
    }

    
}




function deleteCursoND(req, res) {

    try {

        let data = req.body.data;
        let identificador = data.i.usuario.idnt;
        let curso = data.u;

        console.log({ cursoMoco: curso });
        setTimeout(() => {
            mgbCNDModel.remove({ "_id": curso._id }, (err) => {
                if (err == null) {
                    method.respuesta({ curso: [], delete: true, error: false, mensaje: 'Curso eliminado con exito' })
                } else {
                    console.log({ errorDeQue: err });
                    method.respuesta({ curso: [], delete: false, error: true, mensaje: 'No se pudo eliminar el curso' })
                }
            })

        }, 1000);

    } catch (e) {
        console.log({ errorCatch: e });
        method.respuesta({ curso: [], delete: false, error: true, mensaje: 'Tuvimos un problemas al completar su solicitud' })
    }

    var method = {
        respuesta: (item) => {
            let strgData = JSON.stringify({ data: { curso: item.curso, delete: item.delete, error: item.error, mensaje: item.mensaje } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        }
    }
}


function deleteUsuario(req, res) {
    try {
        let data = req.body.data;
        let delUser = data.user;
        let identificador = data.u.idnt;

        mgbClientesOtecModel.find({ "cliente.rut": delUser.rut, "identificador.key": identificador }, (err, resDelClient) => {
            if (err == null && resDelClient.length > 0) {
                let idxCursoNComplete = _.findIndex(resDelClient[0].cursosSuscrito, (o) => {
                    return o.terminoCurso.fecha == '';
                })
                if (idxCursoNComplete == -1) {
                    console.log('Eliminación usuario');
                    mgbClientesOtecModel.remove({ "cliente.rut": delUser.rut, "identificador.key": identificador }, (err, resDel) => {
                        if (err == null) {
                            method.respuesta({ usuario: null, error: false, mensaje: 'Usuario eliminado con exito' });
                        } else {
                            method.respuesta({ usuario: null, error: true, mensaje: 'Usuario no se pudo eliminar' });
                        }
                    });
                } else {
                    console.log('Usuario no se puede eliminar');
                    method.respuesta({ usuario: null, error: true, mensaje: 'Usuario no se puede eliminar pues tiene pendiente de termino curso' });
                }
            } else {
                method.respuesta({ usuario: null, error: true, mensaje: 'Usuario no encontrado' });
            }
        })
        //let identificador= data.u.usuario.idnt;
        console.log({ dataDelUsuario: data });
    } catch (e) {
        method.respuesta({ usuario: null, error: true, mensaje: 'Hubo un problema al concretar tu solicitud' });
    }
    var method = {
        respuesta: (item) => {
            let strgData = JSON.stringify({ data: { usuario: item.usuario, error: item.error, mensaje: item.mensaje } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        }
    }
}


function buscarEstudiante(req, res) {

    try {
        let data = req.body.data;
        let criterio = data.criterio.criterio;
        let identificador = data.u.usuario.idnt;
        console.log({ dataBuscarEstudiante: data.u.usuario });

        mgbClientesOtecModel.find({ "cliente.rut": criterio, "identificador.key": identificador }, (err, resCliente) => {
            if (err == null && resCliente.length > 0) {
                console.log({ resClienteEncontrado: resCliente });
                method.respuesta({ usuario: resCliente[0], error: false, mensaje: null });
            } else {
                method.respuesta({ usuario: null, error: true, mensaje: 'Usuario no encontrado' });
            }
        })
    } catch (e) {

        method.respuesta({ usuario: null, error: true, mensaje: 'Hubo un problema al concretar su solicitud' });
    }

    var method = {
        respuesta: (item) => {
            let strgData = JSON.stringify({ data: { usuario: item.usuario, error: item.error, mensaje: item.mensaje } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        }
    }

}

function updateCursoSendData(req, res) {

    try {
        let data = req.body.data;
        let identificador = data.i.idnt;
        let curso = data.cu.cod_curso;
        console.log({ cursoReq: curso, identificadorReq: identificador, dataReq: data });
        mgbCursosModel.find({ "identificador.key": identificador, "curso.cod_curso": curso }, (err, resCursoData) => {
            if (err == null && resCursoData.length > 0) {
                method.respuesta({ curso: resCursoData, error: false, mensaje: null });
            } else {
                method.respuesta({ curso: [], error: true, mensaje: 'No se pudo cargar el curso' });
                console.log({ errorBaseDeDato: err });
            }
        })
        console.log({ updateCursoSendData: data });
    } catch (e) {
        method.respuesta({ curso: [], error: true, mensaje: 'Tuvimos un problema contacte con el administrador' });
    }



    var method = {
        respuesta: (cursoData) => {
            let strgData = JSON.stringify({ data: { curso: cursoData.curso, error: cursoData.error, mensaje: cursoData.mensaje } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        }
    }

}



function updateCurso(req, res) {
    let data = req.body.data;
    let curso = data.u;
    let identificador = data.i.usuario.idnt;

    mgbCursosModel.update({ "identificador.key": identificador, "_id": curso._id }, {
        $set: {
            "curso": curso.curso,
            "modulos": curso.modulos,
            "esquema": curso.esquema
        }
    }
        , (err, raw) => {
            if (err == null) {
                method.respuesta({ updt: true, error: false, mensaje: 'Actualización correcta del curso' });
            } else {
                method.respuesta({ updt: false, error: true, mensaje: 'Tuvimos un problema al actualizar el curso' });
            }
        });
    var method = {
        respuesta: (cursoData) => {
            let strgData = JSON.stringify({ data: { updt: cursoData.updt, error: cursoData.error, mensaje: cursoData.mensaje } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        }
    }

    console.log({ ucurso: curso, uidentificador: identificador });
}

function registroOtec(req, res) {

    /**
     * Registro de otecs
     */

    let otec = req.body.data;
    mgbOtecs.find({ "identificador.key": otec.identificador.key }, (err, documentOtec) => {
        if (documentOtec.length == 0) {
            let guardOtec = new mgbOtecs();
            guardOtec.otec = otec.otec;
            guardOtec.identificador = otec.identificador;
            guardOtec.clientes = otec.clientes;
            guardOtec.usuarios = otec.usuarios;
            guardOtec.save((error, guard) => {
                if (error) {
                    res.status(500).json({ message: 'hubo un error en la peticion' });
                } else {
                    if (!guard) {
                        res.status(500).json({ message: 'hubo un error al guardar el curso' });
                    } else {
                        let strgData = JSON.stringify({ data: { registro: true } });
                        crypto.encode(strgData).then((enc) => {
                            res.json({
                                d: enc
                            })
                        })
                    }
                }
            })
        } else {
            let strgData = JSON.stringify({ data: { registro: false, error: 900, menss: "Esta Otec ya se encuentra registrada" } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc,
                    strg: strgData
                })
            })
        }
    })

    console.log({ otec: otec });
}

function registroUsuario(req, res) {
    /**
     * Registra usuarios para las otecs
     */
    let identificador = req.body.data.usuario.identificador;
    console.log({ identificador: identificador });

    mgbOtecs.find({ "identificador.key": identificador }, (err, resOtec) => {
        if (resOtec.length == 0) {
            let guardUser = new mgbOtecs();

        }
    })


}



function getRegisteredAlertsMensajes(req, res) {
    console.log('get register alertas aquí');
    mgbfrontPageModel.find({}, (err, respuesta) => {
        if (err == null) {
            let strgData = JSON.stringify({ data: { alertas: respuesta[0].alertasMensajes } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc
                })
            })
        } else {
            let strgData = JSON.stringify({ data: { alertas: [] } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc
                })
            })
        }
    })
}
function registerAlertsMesaje(req, res) {
    let item = req.body.data;
    console.log({ itemRegister: item });
    mgbfrontPageModel.find({}, (err, respons) => {
        if (respons[0].alertasMensajes.length == 0) {
            console.log('ejecutando alertas mensajes');
            respons[0].alertasMensajes.push(item);
            mgbfrontPageModel.update({ "_id": respons[0]._id }, {
                $set: {
                    "alertasMensajes": respons[0].alertasMensajes
                }
            }, (err, raw) => {
                mgbfrontPageModel.find({ "_id": respons[0]._id }, (err, resItem) => {
                    if (err == null) {
                        let strgData = JSON.stringify({ data: { registro: true, alertas: resItem[0].alertasMensajes } });
                        crypto.encode(strgData).then((enc) => {
                            res.json({
                                d: enc
                            })
                        })
                    }
                })

            })



        } else {

            respons[0].alertasMensajes.forEach((mensajes, index) => {
                if (item.dataMess.posicion == mensajes.dataMess.posicion) {
                    respons[0].alertasMensajes[index].dataMess.activo = false;
                }
            })
            respons[0].alertasMensajes.push(item);
            mgbfrontPageModel.update({ "_id": respons[0]._id }, {
                $set: {
                    "alertasMensajes": respons[0].alertasMensajes
                }
            }, (err, raw) => {
                mgbfrontPageModel.find({ "_id": respons[0]._id }, (err, resItem) => {
                    if (err == null) {
                        let strgData = JSON.stringify({ data: { registro: true, alertas: resItem[0].alertasMensajes } });
                        crypto.encode(strgData).then((enc) => {
                            res.json({
                                d: enc
                            })
                        })
                    }
                })

            })



            console.log({ itemRegister: item });

            respons[0].alertasMensajes.push(item);

            console.log({ response: respons });
            mgbfrontPageModel.update({ '_id': respons[0]._id }, {
                $set: {
                    'alertasMensajes': respons[0].alertasMensajes
                }
            }, (err, raw) => {
                if (err == null) {
                    mgbfrontPageModel.find({}, (err, respos) => {
                        let strgData = JSON.stringify({ data: { registro: true, alertas: respos[0].alertasMensajes } });
                        crypto.encode(strgData).then((enc) => {
                            res.json({
                                d: enc
                            })
                        })
                    })

                }

            })
        }
        //console.log({respuestaBD:respons});
    })
    //console.log({itemMessajeRecibe:item});
}

function getPosiciones(req, res) {
    mgbfrontPageModel.find({}, (err, respos) => {
        let strgData = JSON.stringify({ data: { posiciones: respos[0].posiciones } });
        crypto.encode(strgData).then((enc) => {
            res.json({
                d: enc
            })
        })
    })
}

function deleteAlertMesaje(req, res) {
    let item = req.body.data;
    mgbfrontPageModel.find({ "alertasMensajes.dataMess.cod": item.dataMess.cod }, (err, respAlert) => {
        let indexMess = _.findIndex(respAlert[0].alertasMensajes, function (o) { return o.dataMess.cod == item.dataMess.cod; })
        respAlert[0].alertasMensajes.splice(indexMess, 1);
        mgbfrontPageModel.update({ "_id": respAlert[0]._id }, {
            $set: {
                "alertasMensajes": respAlert[0].alertasMensajes
            }
        }, (err, raw) => {
            if (err == null) {
                mgbfrontPageModel.find({ "_id": respAlert[0]._id }, (err, resAlert) => {
                    if (err == null) {
                        let strgData = JSON.stringify({ data: { delete: true, alertas: resAlert[0].alertasMensajes } });
                        crypto.encode(strgData).then((enc) => {
                            res.json({
                                d: enc
                            })
                        })
                    } else {
                        let strgData = JSON.stringify({ data: { delete: true, alertas: [] } });
                        crypto.encode(strgData).then((enc) => {
                            res.json({
                                d: enc
                            })
                        })
                    }


                })

            } else {
                let strgData = JSON.stringify({ data: { delete: false, alertas: [] } });
                crypto.encode(strgData).then((enc) => {
                    res.json({
                        d: enc
                    })
                })
            }
        })
        console.log({ alertFind: respAlert });
    })
    console.log({ deleteAlertId: item });
}

function updateAlertMess(req, res) {
    let item = req.body.data;
    mgbfrontPageModel.find({ "alertasMensajes.dataMess.cod": item.dataMess.cod }, (err, respAlert) => {
        if (respAlert.length > 0) {
            let indexMess = _.findIndex(respAlert[0].alertasMensajes, function (o) { return o.dataMess.cod == item.dataMess.cod; })

            respAlert[0].alertasMensajes[indexMess] = item;
            mgbfrontPageModel.update({ "_id": respAlert[0]._id }, {
                $set: {
                    "alertasMensajes": respAlert[0].alertasMensajes
                }
            }, (err, raw) => {
                if (err == null) {
                    mgbfrontPageModel.find({ "_id": respAlert[0]._id }, (err, resAlert) => {
                        if (err == null) {
                            let strgData = JSON.stringify({ data: { update: true, alertas: resAlert[0].alertasMensajes } });
                            crypto.encode(strgData).then((enc) => {
                                res.json({
                                    d: enc
                                })
                            })
                        } else {
                            let strgData = JSON.stringify({ data: { update: true, alertas: [] } });
                            crypto.encode(strgData).then((enc) => {
                                res.json({
                                    d: enc
                                })
                            })
                        }


                    })

                } else {
                    let strgData = JSON.stringify({ data: { update: false, alertas: [] } });
                    crypto.encode(strgData).then((enc) => {
                        res.json({
                            d: enc
                        })
                    })
                }
            })
        }
    })
    console.log({ updateAlert: item });

}


function peticionCurso(req, res) {
    mgbPeticionCurso.find({}, (err, resPetQuery) => {
        console.log({ petionCurso: resPetQuery[0] });
    })
}

function loginAdminstracion(req, res) {
    let data = req.body.data;
    mgbOtecs.find({ "usuarios.usuario.username": data.userr, "usuarios.usuario.password": data.pass }, (err, resOtec) => {
        if (resOtec.length != 0) {
            let usuariosOtec = resOtec[0].usuarios;
            let userIndex = _.findIndex(usuariosOtec, (o) => { return o.usuario.username == data.userr && o.usuario.password == data.pass })
            if (userIndex > -1) {
                let strgData = JSON.stringify({ data: { usuario: { idnt: resOtec[0].identificador.key, user: usuariosOtec[userIndex] }, cod: 1500, menss: "bienvenido", ty: 'success', hed: ':)', r: true } });
                crypto.encode(strgData).then((enc) => {
                    res.json({
                        d: enc
                    })
                })
            } else {
                let strgData = JSON.stringify({ data: { usuario: null, cod: 780, menss: "Usuario no encontrado", ty: 'negative', hed: 'Error al iniciar sección', r: false } });
                crypto.encode(strgData).then((enc) => {
                    res.json({
                        d: enc
                    })
                })
            }
        } else {
            let strgData = JSON.stringify({ data: { usuario: null, cod: 780, menss: "Usuario no encontrado", ty: 'negative', hed: 'Error al iniciar sección', r: false } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc
                })
            })
        }

    })
    console.log({ loginAdministracion: data });

}

function añadirEstudiante(req, res) {


    try {
        let data = req.body.data;
        mgbClientesOtecModel.find({ "identificador.key": data.oc.idnt, "cliente.rut": data.client.rut }, (err, resClientOtec) => {
            if (err == null && resClientOtec.length == 0) {
                console.log({ cliente: 'no hay cliente' });
                //buscar curso,
                mgbCursosModel.find({ "curso.cod_curso": data.client.curso }, (err, resCursos) => {
                    if (err == null && resCursos.length > 0) {
                        let clienteOtec = new mgbClientesOtecModel();
                        let modelObjectCursoSuscrito = {
                            curso: {
                                data: resCursos[0].curso

                            },
                            esquema: resCursos[0].esquema,
                            avances: [],
                            pruebasContestadas: [

                            ],


                            fechaInscripcion: { fecha: moment().format('MMMM Do YYYY, h:mm:ss a') },
                            terminoCurso: {
                                fecha: ""
                            }
                        }

                        /**
                         * Registro estudiante a otec
                         * 
                         */

                        let arrayCursoSuscrito = [modelObjectCursoSuscrito];
                        clienteOtec.identificador = { key: data.oc.idnt };
                        clienteOtec.rol = { type: 'estudiante' };
                        clienteOtec.cliente = {
                            rut: data.client.rut, nombreCompleto: data.client.nombreCompleto,
                            direccion: data.client.direccion, telefono: data.client.telefono, email: data.client.email, password: data.client.password
                        };

                        clienteOtec.cursosSuscrito = arrayCursoSuscrito;
                        clienteOtec.save((err, resSaveCliente) => {
                            if (err == null) {
                                let strgData = JSON.stringify({ data: { registro: true, error: false, menss: "Usuario registrado con exito" } });
                                crypto.encode(strgData).then((enc) => {
                                    res.json({
                                        d: enc,
                                        strg: strgData
                                    })
                                })
                            } else {
                                let strgData = JSON.stringify({ data: { registro: false, error: true, menss: "Hubo un error al registrar el usuario" } });
                                crypto.encode(strgData).then((enc) => {
                                    res.json({
                                        d: enc,
                                        strg: strgData
                                    })
                                })
                            }
                            console.log({ errSaveClient: err, resSaveCliente: resSaveCliente });
                        })


                    }



                })
                /*let newClienteOtec= new mgbClientesOtecModel();
     
                newClienteOtec.save((err,resNewCliente)=>{
                     console.log({registroCliente:err,nuevoCliente:resNewCliente});
                })*/
            } else {
                let strgData = JSON.stringify({ data: { registro: false, error: true, menss: "El usuario ingresado ya se encuentra registrado" } });
                crypto.encode(strgData).then((enc) => {
                    res.json({
                        d: enc,
                        strg: strgData
                    })
                })
            }
        })


    } catch (e) {

    }

    console.log({ añadirEstudiante: req.body });
}

function registrarPrueba(req, res) {
    let identificador = { key: req.body.data.identificador };
    let registroPrueba = "error1000";
    let codigoItem = req.body.data.form.tipoCodigoItem;
    let dataItem = req.body.data;
    let form = req.body.data.form;
    console.log({ dataItem: dataItem });
    let pruebaDeclaration = {
        prueba: Object,
        preguntasAlternativas: []
    }
    //primero en definir
    let cursoDeclaration = {
        activo: Boolean,
        curso: Object,
        modulos: new Array(),
        pruebasCurso: new Array(),
        esquema: Object,
        identificador: Object
    }
    let modulos = [

    ]
    let moduloDeclaration = {
        modulo: Object,
        pruebasModulo: new Array(),
        clases: new Array()

    }

    let clases = new Array();

    let claseDeclaration = {
        clase: Object,
        pruebasClase: new Array(),
        contenidos: new Array()
    }


    //esquema

    let esqCurso = {

        curso: Object,
        completado: Boolean,
        modulosRequisito: new Array(),
        pruebas: new Array(),

        modulos: new Array(),

    }



    let esqModulo = {

        modulo: Object,
        moduloRequisito: new Array(),
        completado: Boolean,
        clases: new Array(),
        pruebas: new Array(),

    }

    let esqClase = {
        clase: Object,
        contenidos: new Array(),
        claseRequisito: new Array(),
        completado: Boolean,
        pruebas: new Array(),

    }

    let esqPrueba = {
        prueba: Object,
        pruebasRequisito: new Array(),
        preguntasAlternativas: new Array(),
        completado: Boolean

    }


    //comienzo funciones

    mgbCNDModel.findOne({ 'curso.cursoDefinicion.curso.cod_curso': form.cod_curso }, (error, itemCND) => {

        let modulosAll = itemCND.curso.modulos;
        let cursoDefinicionItem = itemCND.curso.cursoDefinicion.curso;
        // console.log({mgbCNDModel:{error:error,cursoItem:cursoItem}});
        if (itemCND != null) {
            //cuenta las pruebas
            let pruebas = 0;
            Object.keys(itemCND.curso.pruebasCurso).forEach((pruebasLeft, idxKey) => {
                if (pruebasLeft == 'pruebasCurso') {
                    //console.log({pruebasCursoObjetKeyArray:Object.keys(cursoItem.curso.pruebasCurso)[idxKey]});
                    pruebas = pruebas + itemCND.curso.pruebasCurso.pruebasCurso.length;
                } else if (pruebasLeft == 'pruebasModulo') {
                    pruebas = pruebas + itemCND.curso.pruebasCurso.pruebasModulo.length;
                } else if (pruebasLeft == 'pruebasClases') {
                    pruebas = pruebas + itemCND.curso.pruebasCurso.pruebasClases.length;
                }
            })


            let funciones = {

                registroPrueba: (param) => {
                    //update curso
                    mgbCursosModel.update(param.update, {
                        $set: param.updateSet
                    }, (err, raw) => {
                        if (err == null) {
                            //update cursos no definidas
                            mgbCNDModel.update(param.cndUpdate, {
                                $set: param.cndUpdateSet
                            }, (err, cndRes) => {
                                if (err == null) {
                                    pruebas = pruebas - 1;
                                    if (pruebas == 0) {
                                        funciones.addEsquema(param.curso);
                                    } else {
                                        let registroPrueba = "registrada"
                                        let registro = { data: { registro: registroPrueba, cursoObten: itemCND } };
                                        funciones.respuestaServidor({ registro: registro })
                                        //enviar respuesta
                                    }
                                }
                            })
                        } else {
                            //hubo un error al actualizar el curso;
                        }
                    })
                },
                registroPruebaNoCurso: (param) => {
                    console.log({registroPruebaNoCurso:{param:param}});
                    mgbCNDModel.update(param.cndUpdate, {
                        $set: param.cndUpdateSet
                    }, (err, cndRes) => {
                        if (err == null) {
                            pruebas = pruebas - 1;
                            if (pruebas == 0) {
                                funciones.addEsquema(param.curso);
                            } else {
                                let registroPrueba = "registrada"
                                let registro = { data: { registro: registroPrueba, cursoObten: itemCND } };
                                funciones.respuestaServidor({ registro: registro })
                                //enviar respuesta
                            }
                        }
                    })
                },
                addEsquema: (curso) => {
                    
                    let esquema= funciones.generateEsquema(curso);
                    mgbCursosModel.update({"curso.cod_curso": itemCND.curso.cursoDefinicion.curso.cod_curso},{
                        $set:{"esquema":esquema}
                    },(err,raw)=>{
                        if(err==null){
                            mgbCNDModel.deleteOne({"curso.cursoDefinicion.curso.cod_curso": itemCND.curso.cursoDefinicion.curso.cod_curso},(err)=>{
                                if(err==null){
                                    let registroPrueba = "registrada"
                                let registro = { data: { registro: registroPrueba, cursoObten: itemCND } };
                                funciones.respuestaServidor({ registro: registro })
                                }
                            })
                        }
                    })


                },
                generateEsquema:(curso)=>{
                    console.log({generateEsquema:{curso:curso}});
                    esqCurso.curso=curso.curso;
                    esqCurso.completado=false;
                    
                    
                    curso.modulos.forEach((modulo)=>{
                        esqModulo.modulo=modulo.modulo;
                        esqModulo.completado=false;
                        modulo.clases.forEach((clase)=>{
                            esqClase.clase=clase.clase;
                            esqClase.completado=false;
                            esqClase.contenidos=clase.contenidos
                            clase.pruebasClase.forEach((prueba)=>{
                                esqPrueba.prueba=prueba.prueba;
                                esqPrueba.preguntasAlternativas=prueba.preguntasAlternativas;
                                esqPrueba.completado=false;
                                esqClase.pruebas.push(esqPrueba);
                                esqPrueba = {
                                    prueba: Object,
                                    pruebasRequisito: new Array(),
                                    preguntasAlternativas: new Array(),
                                    completado: Boolean
                            
                                }
                            })
                            esqModulo.clases.push(esqClase);
                            esqClase = {
                                clase: Object,
                                contenidos: new Array(),
                                claseRequisito: new Array(),
                                completado: Boolean,
                                pruebas: new Array(),
                        
                            }
                        })
                        modulo.pruebasModulo.forEach((prueba)=>{
                            esqPrueba.prueba=prueba.prueba;
                            esqPrueba.preguntasAlternativas= prueba.preguntasAlternativas;
                            esqPrueba.completado=false;
                            esqModulo.pruebas.push(esqPrueba);
                            esqPrueba = {
                                prueba: Object,
                                pruebasRequisito: new Array(),
                                preguntasAlternativas: new Array(),
                                completado: Boolean
                        
                            }
                        })

                        esqCurso.modulos.push(esqModulo);
                        esqModulo = {

                            modulo: Object,
                            moduloRequisito: new Array(),
                            completado: Boolean,
                            clases: new Array(),
                            pruebas: new Array(),
                    
                        }
                    })

                    curso.pruebasCurso.forEach((prueba)=>{
                        esqPrueba.prueba=prueba.prueba;
                        esqPrueba.preguntasAlternativas=prueba.preguntasAlternativas;
                        esqPrueba.completado=false;
                        esqCurso.pruebas.push(esqPrueba);
                        esqPrueba = {
                            prueba: Object,
                            pruebasRequisito: new Array(),
                            preguntasAlternativas: new Array(),
                            completado: Boolean
                    
                        }
                    })

                    return esqCurso;
                },
                addModulos: (modulos) => {
                    let modulosArray = new Array();
                    itemCND.curso.modulos.forEach((modulo) => {

                        modulo.clases.forEach((clase) => {
                            claseDeclaration.clase = clase.claseDefinicion;
                            clase.contenidos.forEach((contenido) => {
                                claseDeclaration.contenidos.push(contenido);
                            })
                            moduloDeclaration.clases.push(claseDeclaration);
                        })

                        moduloDeclaration.modulo = modulo.moduloDefinicion;
                        modulosArray.push(moduloDeclaration);
                    })

                    return modulosArray;
                },
                addInitCurso: (cursoSave) => {


                    cursoSave.cursoSave.save((error, guardResult) => {
                        if (guardResult != null) {
                            funciones.registroPruebaNoCurso({
                                cndUpdate: cursoSave.paramUpdate.cndUpdate,
                                cndUpdateSet: cursoSave.paramUpdate.cndUpdateSet,
                                curso:cursoSave.curso
                            });
                   

                        } else {
                            //no se puede registrar la prueba porque no se registro el curso
                        }

                    })
                },
                respuestaServidor: (param) => {
                    let strgData = JSON.stringify(param.registro);
                    crypto.encode(strgData).then((enc) => {
                        res.json({
                            d: enc
                        })
                    })
                }

            }

            if (pruebas != 0) { //----> evalua cantidad de pruebas
                //registrar pruebas
                //buscar si esta definido el esquema

                mgbCursosModel.findOne({ "curso.cod_curso": itemCND.curso.cursoDefinicion.curso.cod_curso }, (error, curso) => {


                    if (curso != null) {
                        let cursoSave = new mgbCursosModel();

                        //esquema registrado ya
                        console.log({ mgbCursosModelIF: { curso: curso } });
                        console.log({ mgbCNDModel: { itemCND: itemCND } });
                        console.log({ mgbCursosModelIF: { codigoItem: codigoItem } });

                        if (codigoItem == 'cod_curso_item') {

                            pruebaDeclaration.prueba = form;
                            pruebaDeclaration.preguntasAlternativas = dataItem.palt;
                            curso.pruebasCurso.push(pruebaDeclaration);
                            let paramUpdate = {
                                update: { "curso.cod_curso": itemCND.curso.cursoDefinicion.curso.cod_curso },
                                updateSet: { "pruebasCurso": curso.pruebasCurso },
                                cndUpdate: { "curso.cursoDefinicion.curso.cod_curso": itemCND.curso.cursoDefinicion.curso.cod_curso },
                                cndUpdateSet: Object
                            }
                            let findPruebaCurso = _.findIndex(itemCND.curso.pruebasCurso.pruebasCurso, (o) => { return o.cod == form.codPrueba });
                            if (findPruebaCurso > -1) {
                                itemCND.curso.pruebasCurso.pruebasCurso.splice(findPruebaCurso, 1);
                                paramUpdate.cndUpdateSet = { "curso.pruebasCurso.pruebasCurso": itemCND.curso.pruebasCurso.pruebasCurso };
                                funciones.registroPrueba({
                                    update: paramUpdate.update,
                                    updateSet: paramUpdate.updateSet,
                                    cndUpdate: paramUpdate.cndUpdate,
                                    cndUpdateSet: paramUpdate.cndUpdateSet,
                                    curso:curso
                                });
                            } else {
                                //prueba no encontrada en pruebasCurso enviar error
                                let registroPrueba = "error1000"
                                let registro = { data: { registro: registroPrueba, cursoObten: itemCND } };
                                funciones.respuestaServidor({ registro: registro })
                            }

                        } else if (codigoItem == 'cod_modulo_curso_item') {

                            pruebaDeclaration.prueba = form;
                            pruebaDeclaration.preguntasAlternativas = dataItem.palt;

                            let idxModulo = _.findIndex(curso.modulos, (o) => { return o.modulo.cod_modulo_curso == form.cod_item });
                            if (idxModulo > -1) {
                                curso.modulos[idxModulo].pruebasModulo.push(pruebaDeclaration);
                                let paramUpdate = {
                                    update: { "curso.cod_curso": itemCND.curso.cursoDefinicion.curso.cod_curso },
                                    updateSet: { "modulos": curso.modulos },
                                    cndUpdate: { "curso.cursoDefinicion.curso.cod_curso": itemCND.curso.cursoDefinicion.curso.cod_curso },
                                    cndUpdateSet: Object
                                    
                                }
                                let findPruebaModulo = _.findIndex(itemCND.curso.pruebasCurso.pruebasModulo, (o) => { return o.cod == form.codPrueba });
                                if (findPruebaModulo > -1) {
                                    itemCND.curso.pruebasCurso.pruebasModulo.splice(findPruebaModulo, 1);
                                    paramUpdate.cndUpdateSet = { "curso.pruebasCurso.pruebasModulo": itemCND.curso.pruebasCurso.pruebasModulo };
                                    funciones.registroPrueba({
                                        update: paramUpdate.update,
                                        updateSet: paramUpdate.updateSet,
                                        cndUpdate: paramUpdate.cndUpdate,
                                        cndUpdateSet: paramUpdate.cndUpdateSet,
                                        curso:curso
                                    });
                                } else {
                                    //prueba no encontrada en pruebasCurso enviar error
                                    let registroPrueba = "error1000"
                                    let registro = { data: { registro: registroPrueba, cursoObten: itemCND } };
                                    funciones.respuestaServidor({ registro: registro })
                                }

                            } else {
                                //no se encontro el modulo
                                let registroPrueba = "error1000"
                                let registro = { data: { registro: registroPrueba, cursoObten: itemCND } };
                                funciones.respuestaServidor({ registro: registro })
                            }



                        } else if (codigoItem == 'cod_clases_item') {
                            // funciones.registroPrueba();
                            pruebaDeclaration.prueba = form;
                            pruebaDeclaration.preguntasAlternativas = dataItem.palt;
                            curso.modulos.forEach((modulo, idxModulo) => {
                                modulo.clases.forEach((clase, idxClase) => {
                                    if (clase.clase.cod_clases == form.cod_item) {
                                        curso.modulos[idxModulo].clases[idxClase].pruebasClase.push(pruebaDeclaration);
                                        let paramUpdate = {
                                            update: { "curso.cod_curso": itemCND.curso.cursoDefinicion.curso.cod_curso },
                                            updateSet: { "modulos": curso.modulos },
                                            cndUpdate: { "curso.cursoDefinicion.curso.cod_curso": itemCND.curso.cursoDefinicion.curso.cod_curso },
                                            cndUpdateSet: Object
                                        }

                                        let findPruebaClase = _.findIndex(itemCND.curso.pruebasCurso.pruebasClases, (o) => { return o.cod == form.codPrueba });
                                        if (findPruebaClase > -1) {
                                            itemCND.curso.pruebasCurso.pruebasClases.splice(findPruebaClase, 1);
                                            paramUpdate.cndUpdateSet = { "curso.pruebasCurso.pruebasClases": itemCND.curso.pruebasCurso.pruebasClases };
                                            funciones.registroPrueba({
                                                update: paramUpdate.update,
                                                updateSet: paramUpdate.updateSet,
                                                cndUpdate: paramUpdate.cndUpdate,
                                                cndUpdateSet: paramUpdate.cndUpdateSet,
                                                curso:curso
                                            });
                                        } else {
                                            //prueba no encontrada en pruebasCurso enviar error
                                            let registroPrueba = "error1000"
                                            let registro = { data: { registro: registroPrueba, cursoObten: itemCND } };
                                            funciones.respuestaServidor({ registro: registro })
                                        }

                                    }
                                })
                            })
                        }


                    } else {
                        /**
                         * Si curso == null entonces hay que definirlo
                         */
                        let cursoSave = new mgbCursosModel();
                        cursoSave.activo = false;
                        cursoSave.curso = itemCND.curso.cursoDefinicion.curso;
                        cursoSave.modulos = new Array();
                        cursoSave.modulos = funciones.addModulos();
                        //init modulos
                        //end init modulos
                        cursoSave.pruebasCurso = new Array();
                        cursoSave.esquema = {};
                        cursoSave.identificador = itemCND.identificador;
                        //cursoSave.identificador=
                        //definir esquema y registrar prueba
                        if (codigoItem == 'cod_curso_item') {

                            pruebaDeclaration.prueba = form;
                            pruebaDeclaration.preguntasAlternativas = dataItem.palt;
                            cursoSave.pruebasCurso.push(pruebaDeclaration);
                            let paramUpdate = {
                                cndUpdate: { "curso.cursoDefinicion.curso.cod_curso": itemCND.curso.cursoDefinicion.curso.cod_curso },
                                cndUpdateSet: Object
                            }
                            let findPruebaCurso = _.findIndex(itemCND.curso.pruebasCurso.pruebasCurso, (o) => { return o.cod == form.codPrueba });
                            if (findPruebaCurso > -1) {
                                itemCND.curso.pruebasCurso.pruebasCurso.splice(findPruebaCurso, 1);
                                paramUpdate.cndUpdateSet = { "curso.pruebasCurso.pruebasCurso": itemCND.curso.pruebasCurso.pruebasCurso };
                                funciones.addInitCurso({ cursoSave: cursoSave, paramUpdate: paramUpdate,
                                    curso:cursoSave });
                            } else {
                                //prueba no encontrada en pruebasCurso enviar error
                                let registroPrueba = "error1000"
                                let registro = { data: { registro: registroPrueba, cursoObten: itemCND } };
                                funciones.respuestaServidor({ registro: registro })
                            }




                        } else if (codigoItem == 'cod_modulo_curso_item') {

                            //moduloDeclaration
                            pruebaDeclaration.prueba = form;
                            pruebaDeclaration.preguntasAlternativas = dataItem.palt;
                            let idxModulo = _.findIndex(cursoSave.modulos, (o) => { return o.modulo.cod_modulo_curso == form.cod_item });
                            if (idxModulo > -1) {
                                cursoSave.modulos[idxModulo].pruebasModulo.push(pruebaDeclaration);

                                let paramUpdate = {
                                    cndUpdate: { "curso.cursoDefinicion.curso.cod_curso": itemCND.curso.cursoDefinicion.curso.cod_curso },
                                    cndUpdateSet: Object
                                }
                                let findPruebaModulo = _.findIndex(itemCND.curso.pruebasCurso.pruebasModulo, (o) => { return o.cod == form.codPrueba });
                                if (findPruebaModulo > -1) {
                                    itemCND.curso.pruebasCurso.pruebasModulo.splice(findPruebaModulo, 1);
                                    paramUpdate.cndUpdateSet = { "curso.pruebasCurso.pruebasModulo": itemCND.curso.pruebasCurso.pruebasModulo };
                                    funciones.addInitCurso({ cursoSave: cursoSave, paramUpdate: paramUpdate,
                                        curso:cursoSave });
                                } else {
                                    //prueba no encontrada en pruebasCurso enviar error
                                    let registroPrueba = "error1000"
                                    let registro = { data: { registro: registroPrueba, cursoObten: itemCND } };
                                    funciones.respuestaServidor({ registro: registro })
                                }



                            } else {
                                let registroPrueba = "error1000"
                                    let registro = { data: { registro: registroPrueba, cursoObten: itemCND } };
                                    funciones.respuestaServidor({ registro: registro })
                            }

                        } else if (codigoItem == 'cod_clases_item') {
                            pruebaDeclaration.prueba = form;
                            pruebaDeclaration.preguntasAlternativas = dataItem.palt;
                            cursoSave.modulos.forEach((modulo, idxModulo) => {
                                modulo.clases.forEach((clase, idxClase) => {
                                    if (clase.clase.cod_clases == form.cod_item) {
                                        cursoSave.modulos[idxModulo].clases[idxClase].pruebasClase.push(pruebaDeclaration);


                                        let paramUpdate = {
                                            cndUpdate: { "curso.cursoDefinicion.curso.cod_curso": itemCND.curso.cursoDefinicion.curso.cod_curso },
                                            cndUpdateSet: Object
                                        }

                                        let findPruebaClase = _.findIndex(itemCND.curso.pruebasCurso.pruebasClases, (o) => { return o.cod == form.codPrueba });
                                        if (findPruebaClase > -1) {
                                            itemCND.curso.pruebasCurso.pruebasClases.splice(findPruebaClase, 1);
                                            paramUpdate.cndUpdateSet = { "curso.pruebasCurso.pruebasClases": itemCND.curso.pruebasCurso.pruebasClases };
                                            funciones.addInitCurso({ cursoSave: cursoSave, paramUpdate: paramUpdate,
                                                curso:cursoSave });
                                        } else {
                                            //prueba no encontrada en pruebasCurso enviar error
                                            let registroPrueba = "error1000"
                                            let registro = { data: { registro: registroPrueba, cursoObten: itemCND } };
                                            funciones.respuestaServidor({ registro: registro })
                                        }



                                    }
                                })
                            })

                        }
                    }
                })
            } else {
                //ya no hay pruebas definir los contenidos
                let registroPrueba = "error1000"
                let registro = { data: { registro: registroPrueba, cursoObten: itemCND } };
                funciones.respuestaServidor({ registro: registro })
            }

        } else {
            //no encontrado curso no definido
            let registroPrueba = "error1000"
            let registro = { data: { registro: registroPrueba, cursoObten: itemCND } };
            funciones.respuestaServidor({ registro: registro })
        }
    })

}

function sendDataCursos(req, res) {
    try {

        let data = req.body.data;
        let identificador = data.idnt;
        let modelInfoCurso = {
            curso: Object,
            totalAlumnos: Number,

        }
        let arrayInforCurso = [];
        mgbCursosModel.find({ "identificador.key": data.idnt }, (err, resCursos) => {
            if (err == null && resCursos.length > 0) {
                mgbClientesOtecModel.find({ "identificador.key": identificador }, (errCli, resClients) => {
                    if (errCli == null && resClients.length > 0) {

                        resCursos.forEach((curso) => {
                            let contadorAlumnos = 0;
                            resClients.forEach((cliente) => {
                                console.log({ clienteConMantecol: cliente });
                                let idxCurso = _.findIndex(cliente.cursosSuscrito, (o) => {
                                    return o.esquema.curso.cod_curso == curso.curso.cod_curso;
                                })
                                console.log({ busqyedaDeAlumnos: idxCurso });
                                if (idxCurso != -1) {
                                    contadorAlumnos = contadorAlumnos + 1;
                                }
                            })
                            modelInfoCurso.curso = curso.curso;
                            modelInfoCurso.totalAlumnos = contadorAlumnos;
                            arrayInforCurso.push(modelInfoCurso);
                            modelInfoCurso = {
                                curso: Object,
                                totalAlumnos: Number,

                            };
                            contadorAlumnos = 0;
                        })

                        let strgData = JSON.stringify({ data: { cursos: resCursos, err: false, mensaje: null, infoCurso: arrayInforCurso } });
                        crypto.encode(strgData).then((enc) => {
                            res.json({
                                d: enc
                            })
                        })
                    } else {
                        resCursos.forEach((curso) => {
                            let contadorAlumnos = 0;

                            modelInfoCurso.curso = curso.curso;
                            modelInfoCurso.totalAlumnos = contadorAlumnos;
                            arrayInforCurso.push(modelInfoCurso);
                            modelInfoCurso = {
                                curso: Object,
                                totalAlumnos: Number,

                            };
                            contadorAlumnos = 0;
                        })
                        let strgData = JSON.stringify({ data: { cursos: resCursos, err: false, mensaje: null, infoCurso: arrayInforCurso } });
                        crypto.encode(strgData).then((enc) => {
                            res.json({
                                d: enc
                            })
                        })
                    }
                })
                console.log("ejecutandose el if de sendDataCursos");


            } else {
                let strgData = JSON.stringify({ data: { cursos: [], err: true, mensaje: "No hay cursos para poder registrar un usuario", infoCurso: [] } });
                crypto.encode(strgData).then((enc) => {
                    res.json({
                        d: enc
                    })
                })
            }
        })

    } catch (e) {
        let strgData = JSON.stringify({ data: { cursos: [], err: true, mensaje: "Ocurrio un error intentalo en otro momento o contacta con el administrador del sitio" } });
        crypto.encode(strgData).then((enc) => {
            res.json({
                d: enc
            })
        })
    }

    //console.log({dataCurso:data});

}

function sendPruebasRegistradas(req, res) {
    admQuery.administracionBack.administracionCursos.administracionPruebas.SendPruebasRegistradas().then((r) => {
        let strgData = JSON.stringify(r);
        crypto.encode(strgData).then((enc) => {
            res.json({
                d: enc
            })
        })
    })
}

function deletePrueba(req, res) {
    console.log('ejecutandose deletePrueba');
    admQuery.administracionBack.administracionCursos.administracionPruebas.deletePrueba(req.body.data).then((r) => {
        let strgData = JSON.stringify(r);
        crypto.encode(strgData).then((enc) => {
            res.json({
                d: enc
            })
        })
    })
}

function editarPrueba(req, res) {
    admQuery.administracionBack.administracionCursos.administracionPruebas.editarPrueba(req.body.data).then((r) => {
        console.log('se ejecuto editarPrueba');
        let strgData = JSON.stringify(r);
        crypto.encode(strgData).then((enc) => {
            res.json({
                d: enc
            })
        })
    })
}

function registrarPruebaEditada(req, res) {

}

// TRABAJANDO EN REGISTROCURSO--1

function registroCurso(req, res) {

    let strgData;
    let noDefinidoSave = new mgbCNDModel();
    noDefinidoSave.curso = req.body.data.curso;
    noDefinidoSave.identificador = { key: req.body.data.identificador };

    /**
     * Buscar existencia del curso a registrar
     */
    mgbCNDModel.find({ "curso.cursoDefinicion.curso.cod_curso": req.body.data.curso.cursoDefinicion.curso.cod_curso }, (error, findCurso) => {
        if (error) {
            res.status(500).json({ message: 'hubo un error en la peticion 500' });
        } else {
            if (!findCurso) {
                res.status(500).json({ message: 'hubo un error 500' });
            } else {
                if (findCurso.length == 0) {
                    noDefinidoSave.save((error, guard) => {
                        if (error) {
                            res.status(500).json({ message: 'hubo un error en la peticion' });
                        } else {
                            if (!guard) {
                                res.status(500).json({ message: 'hubo un error al guardar el curso' });
                            } else {
                                strgData = JSON.stringify({ data: { registro: true } });
                                crypto.encode(strgData).then((enc) => {
                                    res.json({
                                        d: enc
                                    })
                                })
                            }
                        }
                    })
                } else {
                    strgData = JSON.stringify({ data: { registro: 'existente' } });
                    crypto.encode(strgData).then((enc) => {
                        res.json({
                            d: enc
                        })
                    })
                }
                console.log({ RegistroCursocursoEncontrado: findCurso });
            }
        }
    })

}

function registroArea(req, res) {

    try {
        console.log({ areaDataRecibe: req.body.data });
        let areas = req.body.data;
        mgbComplDataCurso.find({}, (err, areaResponse) => {
            if (areaResponse.length == 0) {
                let guardCurso = new mgbComplDataCurso();
                guardCurso.areas = areas;
                guardCurso.save((error, ResponseBD) => {
                    if (error) {
                        res.status(500).json({ message: 'hubo un error en la peticion' });
                    } else {
                        if (!ResponseBD) {
                            res.status(500).json({ message: 'hubo un error' });
                        } else {
                            mgbComplDataCurso.find({}, (err, areaResponse) => {
                                let strgData = JSON.stringify({ data: { registro: true, areas: areaResponse[0].areas } });
                                crypto.encode(strgData).then((enc) => {
                                    res.json({
                                        d: enc
                                    })
                                })
                            })
                        }
                    }
                })

            } else {

                areas.forEach((area, index) => {
                    let findItem = _.findIndex(areaResponse[0].areas, function (o) { return o.nombre_area == area.nombre_area; });
                    if (findItem == -1) {
                        areaResponse[0].areas.push(area);

                    }

                })


                mgbComplDataCurso.update({ "_id": areaResponse[0]._id }, {
                    $set: {
                        "areas": areaResponse[0].areas
                    }
                }, (err, raw) => {
                    mgbComplDataCurso.find({}, (err, areaResponse) => {
                        if (err == null) {

                            let strgData = JSON.stringify({ data: { registro: true, areas: areaResponse[0].areas } });
                            crypto.encode(strgData).then((enc) => {
                                res.json({
                                    d: enc
                                })
                            })



                        } else {
                            let strgData = JSON.stringify({ data: { registro: false, areas: areaResponse[0].areas } });
                            crypto.encode(strgData).then((enc) => {
                                res.json({
                                    d: enc
                                })
                            })
                        }

                    })
                })
            }
        })


    } catch (e) {
        let strgData = JSON.stringify({ data: { registro: false, areas: [] } });
        crypto.encode(strgData).then((enc) => {
            res.json({
                d: enc
            })
        })


    }






}

function deleteCursos(req, res) {

    try {
        let data = req.body.data;
        let identificador = data.i.usuario.idnt;
        let curso = data.u;

        mgbCursosModel.find({ "identificador.key": identificador }, (err, resCurso) => {
            if (err == null && resCurso.length > 0) {
                let idxCurso = _.findIndex(resCurso, (o) => {
                    return o.curso.cod_curso == curso.cod_curso;
                });

                if (idxCurso != -1) {
                    mgbCursosModel.remove({ "curso.cod_curso": curso.cod_curso }, (err) => {
                        if (err == null) {
                            mgbCursosModel.find({ "identificador.key": identificador }, (err, resCurso) => {
                                if (err == null && resCurso.length > 0) {
                                    method.respuesta({ cursos: resCurso, error: false, mensaje: 'Curso eliminado con exito' });
                                } else {
                                    method.respuesta({ cursos: resCurso, error: true, mensaje: 'No se pudo cargar el curso' });
                                }
                            })


                        } else {
                            method.respuesta({ cursos: resCurso, error: true, mensaje: 'No se pudo eliminar el curso' });

                        }
                    })

                } else {
                    method.respuesta({ cursos: resCurso, error: true, mensaje: 'No se pudo encontrar el curso' });
                }
            } else {
                method.respuesta({ cursos: resCurso, error: true, mensaje: 'No borro ningun cuso' });
            }
        })

    } catch (e) {
        method.respuesta({ cursos: [], error: true, mensaje: 'No borro ningun cuso' });
    }


    let method = {
        respuesta: (item) => {
            let strgData = JSON.stringify({ data: { cursos: item.cursos, err: item.error, mensaje: item.mensaje } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc
                })
            })
        }
    }
    /*
    admQuery.administracionBack.administracionCursos.curso.delete.deleteCurso(req.body.data).then((r) => {
        let strgData = JSON.stringify(r);
        crypto.encode(strgData).then((enc) => {
            res.json({
                d: enc
            })
        })
    })*/
}

function deleteArea(req, res) {
    let data = req.body.data;
    let identificador = data.i;
    let deleteArea = data.u.cod_area;
    mgbComplDataCurso.find({ "identificador.key": identificador }, (err, areasResp) => {
        if (err == null && areasResp.length) {
            let idxArea = _.findIndex(areasResp[0].areas, (o) => {
                return o.cod_area == deleteArea;
            })
            if (idxArea != -1) {
                areasResp[0].areas.splice(idxArea, 1);
                mgbComplDataCurso.update({ "identificador.key": identificador }, {
                    $set: {
                        "areas": areasResp[0].areas
                    }
                }, (err, resUpdateArea) => {
                    if (err == null) {
                        let strgData = JSON.stringify({ data: { areas: areasResp[0].areas, err: false, mensaje: "Área eliminada con éxito" } });
                        crypto.encode(strgData).then((enc) => {
                            res.json({
                                d: enc
                            })
                        })
                    } else {
                        let strgData = JSON.stringify({ data: { areas: areasResp[0].areas, err: true, mensaje: "No se pudo eliminar el área seleccionada" } });
                        crypto.encode(strgData).then((enc) => {
                            res.json({
                                d: enc
                            })
                        })
                    }
                })

            } else {
                let strgData = JSON.stringify({ data: { areas: areasResp[0].areas, err: true, mensaje: "No se pudo eliminar el área seleccionada" } });
                crypto.encode(strgData).then((enc) => {
                    res.json({
                        d: enc
                    })
                })
            }
        } else {
            let strgData = JSON.stringify({ data: { areas: areasResp[0].areas, err: true, mensaje: "No se pudo eliminar el área seleccionada" } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc
                })
            })
        }
    })

    console.log({ deleteArea: data });
}

function dataArea(req, res) {
    try {
        let data = req.body.data;
        let identificador = data.i.idnt;
        console.log({ dataArea: data });

        mgbComplDataCurso.find({ "identificador.key": identificador }, (err, areasResp) => {

            if (err == null && areasResp.length > 0) {
                let strgData = JSON.stringify({ data: { area: areasResp[0].areas, err: false, mensaje: null } });
                crypto.encode(strgData).then((enc) => {
                    res.json({
                        d: enc
                    })
                })

            } else {
                let strgData = JSON.stringify({ data: { area: [], err: true, mensaje: 'No se pudieron cargar las áreas de los cursos' } });
                crypto.encode(strgData).then((enc) => {
                    res.json({
                        d: enc
                    })
                })
            }

        })


    } catch (e) {
        let strgData = JSON.stringify({ data: { area: [], err: true, mensaje: 'No se pudieron cargar las áreas de los cursos' } });
        crypto.encode(strgData).then((enc) => {
            res.json({
                d: enc
            })
        })
    }

}

function cursosNoDefinidos(req, res) {
    /**
                        * Cambios para mongo db,
                        * Obtiene la data de los cursos no definidos
                        */
    console.log({ cursosNoDefinidos: req.body.data.usuario });
    try {

        let identificador = req.body.data.usuario.idnt;

        mgbCNDModel.find({ "identificador.key": identificador }, (error, resCND) => {

            if (error == null && resCND.length != 0) {
                let strgData = JSON.stringify({ data: { cursos: resCND } });
                crypto.encode(strgData).then((enc) => {
                    res.json({
                        d: enc
                    })
                })
            } else {
                let strgData = JSON.stringify({ data: { cursos: [] } });
                crypto.encode(strgData).then((enc) => {
                    res.json({
                        d: enc
                    })
                })
            }




        })

    } catch (e) {
        let strgData = JSON.stringify({ data: { cursos: [] } });
        crypto.encode(strgData).then((enc) => {
            res.json({
                d: enc
            })
        })
    }

}

function dataCursos(req, res) {
}

function updateArea(req, res) {
    console.log('UPDATE AREA CON MANTECOL');
    let data = req.body;
    let identificador = data.data.i;
    let areaUpdate = data.data.u.area;
    let valorEdicion = data.data.u.valorEdicion;
    mgbComplDataCurso

    console.log({ dataUpdateArea: data.data.u });
    mgbComplDataCurso.find({ "identificador.key": identificador }, (err, resUpdateArea) => {
        if (err == null && resUpdateArea.length > 0) {

            let idxArea = _.findIndex(resUpdateArea[0].areas, (o) => {
                return o.cod_area == areaUpdate.cod_area;
            })
            resUpdateArea[0].areas[idxArea].nombre_area = valorEdicion;

            mgbComplDataCurso.update({ "identificador.key": identificador }, {
                $set: {
                    "areas": resUpdateArea[0].areas
                }
            }, (err, resUpdateAreas) => {
                if (err == null) {
                    let strgData = JSON.stringify({ data: { areas: resUpdateArea[0].areas, mensaje: 'Actualización realizada con exito', err: false } });
                    crypto.encode(strgData).then((enc) => {
                        res.json({
                            d: enc
                        })
                    })
                } else {
                    let strgData = JSON.stringify({ data: { areas: resUpdateArea[0].areas, mensaje: 'No se pudo actualizar', err: true } });
                    crypto.encode(strgData).then((enc) => {
                        res.json({
                            d: enc
                        })
                    })
                }
            })
        } else {
            let strgData = JSON.stringify({ data: { areas: [], mensaje: 'No se pudo actualizar', err: true } });
            crypto.encode(strgData).then((enc) => {
                res.json({
                    d: enc
                })
            })
        }
    })
    /*
    admQuery.administracionBack.administracionCursos.curso.update.updateArea(req.body.data).then((r) => {
        let strgData = JSON.stringify(r);
        crypto.encode(strgData).then((enc) => {
            res.json({
                d: enc
            })
        })
    })*/
}




module.exports = adminbackend;