'use strict'

var express = require('express');
var identificacionController = require('../../controllers/identificacion-controller/identificacion-controller');
var tokenImpl = require('../../util-implements/token-implement');
var secureRouter = express.Router();

secureRouter.use(tokenImpl.tokenImpl.tokenImpl);

//use urls
/**
 * identificacion 
 * insert
 */
secureRouter.post('/eyJ1c2VybmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3QiLCJpYXQiOjE1MDE4NzQ1NzgsImV4cCI6MTUwMTg4MTU3OH', identificacionController.identificacion.insertUser);


module.exports = secureRouter;