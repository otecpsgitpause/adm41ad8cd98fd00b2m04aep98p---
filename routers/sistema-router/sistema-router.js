'use strict'

var express = require('express');
var sistemaController = require('../../controllers/sistema-controller/sistema-controller');
var tokenImpl = require('../../util-implements/token-implement');
var secureRouter = express.Router();

secureRouter.use(tokenImpl.tokenImpl.tokenImpl);

//use urls
/**
 * sistema
 * getUrls
 */



module.exports = secureRouter;