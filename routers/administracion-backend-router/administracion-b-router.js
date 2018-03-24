'use strict'

var express = require('express');
var administracionBController = require('../../controllers/administracion-backend-controller/administracion-b-controller');
var tokenImpl = require('../../util-implements/token-implement');
var secureRouter = express.Router();
var api = express.Router();
secureRouter.use(tokenImpl.tokenImpl.tokenImpl);

//use urls
/**
 * identificacion 
 * insert
 */
//342b1
secureRouter.post('/F2qQ6rgUgVHRFwVuFIgXPxiQdy4TpkHMMpsSDqKLeELICY5g1S', administracionBController.loginAdminstracion);
//342b2
secureRouter.post('/dLlLiAGtyOux7x0xTU7FcVs7dfyttQ6EAG2fXvCkYYK0zZdrXZ', administracionBController.administracionCursos.administracionPruebas.registrarPrueba);
//342b3
secureRouter.post('/RZDPQ0KdfV6EpcWe45joymxXiGREa8ufQfkZ8fOmPzM9NzuN1h', administracionBController.administracionCursos.administracionPruebas.sendDataCursos);
//342b4
secureRouter.post('/KuNIsRBFbXyomPY39xeYBwlqpPKyZpM9xtphYufkwRPdnuLZmg', administracionBController.administracionCursos.administracionPruebas.sendPruebasRegistradas);
//342b5
secureRouter.post('/13Q1KJyb8exZsHLFwUGLDXNd9UdZikWNuzXnedPeuT2HcTM6w5', administracionBController.administracionCursos.administracionPruebas.deletePrueba);
//342b6
secureRouter.post('/r33xluhgn81oTmnZoW8oGzGxriDg8rB1GYOG4IAbKEHIaF4gdt', administracionBController.administracionCursos.administracionPruebas.editarPrueba);
//342b7
secureRouter.post('/zuU7hBgAdwvcQArZnrcxZWyIvvb1n0GvJc61243iMKyPsTr3Ak', administracionBController.administracionCursos.administracionPruebas.registrarPruebaEditada);
//313c1
secureRouter.post('/rV2Ni0ID7yQnThxrA6iAxYduIt6grLzgBWWoQGkX4TRTuMVhII', administracionBController.administracionCursos.cursos.select.area.dataArea);
//415a1
secureRouter.post('/pS43L28cSjsraHntrEblz0KpRlT8bTJ5ERiWXEGRbEpfbBlDud', administracionBController.administracionCursos.registro.registroCurso);
//671a1
secureRouter.post('/rY2v29wg0WyNkvN2nqqGwvroeeBmCTUpV9CeWOgDdHpRHC57Z5', administracionBController.administracionCursos.registro.registroArea);
//415a2 copia de 415a4
secureRouter.post('/RLzE8wWSxOaFiT6hNuwUmWjPqbWWP46yaOn0CJvUhzDVGkd8ct', administracionBController.administracionCursos.cursos.select.cursos.cursosNoDefinidos);
//415a3
secureRouter.post('/XGj4xjDH8sWurgL66G3RlNs6XxsmxCYypvyjMstFPAGUT6HaiN', administracionBController.administracionCursos.cursos.delete.deleteCursos);
//415a4
secureRouter.post('/NS12LDwd5pC5AsrEqkrLpP6MoBcaGz1VWD9rKOfIaGM1VAgd60', administracionBController.administracionCursos.cursos.select.cursos.cursosNoDefinidos);
//672a2
secureRouter.post('/5pgIv1JF92VnmNhUQQYe5rhVm6n03wZffftdmwUtaM4UOzqET6', administracionBController.administracionCursos.cursos.delete.deleteArea);
//673a5
secureRouter.post('/NZZrE0PfDY80PRuCOyUyjRdKBNq8K5O7fklRLQc81dRbNLmcpn', administracionBController.administracionCursos.cursos.update.updateArea);
//900a1
secureRouter.post('/T8lTtrvV3oMreEBDVsDlkBxYdySX1XOM6E5GtXYr9SNtQSYKZs',administracionBController.gestionClientesOtec.estudiantes.añadirEstudiante);
//4202at1
secureRouter.post('/555Np2qp18cM75aPgH9RkIlEvwHMAGIfwQjhoxMFe4ZOnqPcJq',administracionBController.frontPageAdministracion.alertasMensajes.getRegisteredAlertsMensajes);
//4202at2
secureRouter.post('/JSQljBGbwbXTBvRiehbART57Z4dAsbsz9/r77iCjQlAm3oXzgC',administracionBController.frontPageAdministracion.alertasMensajes.registerAlertsMesaje);
//4202at3
secureRouter.post('/nCtGIsdGzljC5JE3ODMIrxn15Xff3nGtLtMpDW8HwFnc4OKrn',administracionBController.frontPageAdministracion.getPosiciones);
//4202at4
secureRouter.post('/no5VANfz3oz50MHaUzytBrNuOXrCvPdinG0FJjGixCZHtNmo0h',administracionBController.frontPageAdministracion.alertasMensajes.deleteAlertMesaje);
//4202at5
secureRouter.post('/loAFN46mgaLnOF7Zh9caRqNtY3xOIrUVoemJoCrWgPIs9JkVj8',administracionBController.frontPageAdministracion.alertasMensajes.updateAlertMess);
//4200ba1
secureRouter.post('/ysq7wG2XGcNyh3eeCpGdW0uC9gzcYom25YoWIAqljJWsBBzxEr',administracionBController.genericUse.peticionCurso);
//4200ba2

//4200ua1
secureRouter.post('/nmNhUQQYe5rhVm6n03wZffftdmwUtaM4UOzqETmmAOvswjyBrx',administracionBController.administracionCursos.cursos.update.updateCursoSendData);
//4200ua2
secureRouter.post('/I9O7AsyBRwztQN3d1HHmlvcc5Hz8le5qdhLeZfDmjUpPIbhQnfg',administracionBController.administracionCursos.cursos.update.updateCurso);
//4200uab01
secureRouter.post('/w6j6nd5zfk36FnGgU2AOFPDV3yUHoa7En3rChFTUUJ5TLpCtczd',administracionBController.gestionClientesOtec.estudiantes.buscarEstudiante);
//4200uab02
secureRouter.post('/BP6ZrObv0pGs8zKhyUUMruSIl4Y4tljpHqw1eGNrDZGXMewfvvd',administracionBController.gestionClientesOtec.estudiantes.deleteUsuario);
//4200uab21
secureRouter.post('/U2IJ2VqrFJHrD5ok8FrPNbwTBEls8WMTk1NzeMvEfwkxWpyrInS',administracionBController.administracionCursos.cursos.delete.deleteCursoND);
//4200uab30
secureRouter.post('/Y3xOIrUVoemJoCrWgPIs9JkVj83Xbj3DumSSTtWiwa3dgJSEooT',administracionBController.frontPageAdministracion.pagos.addBtnPay);
//4200uab31
secureRouter.post('/Vaoo2Rdd0PiT1mJqopdRjjsPLxuq9ij4qZu5IlgX4O52VYAWKTX',administracionBController.frontPageAdministracion.pagos.getBtnPay);
//4200uab32
secureRouter.post('/yMuuynq2AYthjF4h2CQxCk3HkyYKt3yHv30eeKx9zDdIhvRfwwp',administracionBController.gestionClientesOtec.estudiantes.inscribirEstudianteCurso);
//4200uab52
secureRouter.post('/HgpPLfL0numbKFFUi9Q1JJCqr2p9rAH/PgROetSJF1oMN3ZPAyi',administracionBController.frontPageAdministracion.pagos.updateBtnPay);
//4200uab53
secureRouter.post('/RBFbXyomPY39xeYBwlqpPKyZpM9xtphYufkwRPdnuLZmg7GL1Df',administracionBController.frontPageAdministracion.pagos.deleteBtnPay);
//4200uab54
secureRouter.post('/rFJHrD5ok8FrPNbwTBEls8WMTk1NzeMvEfwkxWpyrInSq6ATpR3',administracionBController.administracionCursos.cursos.update.actualizarCurso);
//4200uab55
secureRouter.post('/bXOBPRc35pSY5lyw3nlKAEyupCmDDPcYeEWDeByYvfDl29Eyvne',administracionBController.administracionCursos.cursos.registrar.registrarOpcion);
//4200uab56
secureRouter.post('/IZ6k4hLUcvOdztSJjeYNoegASqpdu3HolVasbrnwRCdCDy82Dlx',administracionBController.administracionCursos.cursos.genericMethodCurso.genericAccionCurso);
//4200uab57
secureRouter.post('/BgAdwvcQArZnrcxZWyIvvb1n0GvJc61243iMKyPsTr3AkFr8jp3',administracionBController.administracionCursos.cursos.update.updateParamCurso);
module.exports = secureRouter;