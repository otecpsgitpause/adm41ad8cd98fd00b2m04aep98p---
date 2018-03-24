'use strict'
var express = require('express');
var administracionPOController = require('../../controllers/plataforma-online-controller/administracion-po-controller');
var tokenImpl = require('../../util-implements/token-implement');
var secureRouter = express.Router();

secureRouter.use(tokenImpl.tokenImpl.tokenImpl);

//urls

secureRouter.post('/J6p8R6wryfOiySEUpCcoT8lTtrvV3oMreEBDVsDlkBxYdySX1XO', administracionPOController.cursos.select.cursosAlumno);

module.exports = secureRouter;