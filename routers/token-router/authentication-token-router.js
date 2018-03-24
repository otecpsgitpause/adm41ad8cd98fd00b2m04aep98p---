'use strict'

var express = require('express');
var tokenController = require('../../controllers/token-controller/token-controller');
var api = express.Router();


//use urls
api.post('/eyJ1c2VybmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3QiLCJpYXQiOjE1MDE4NzM5NDMsImV4cCI6MTUwMTg4MDk0M3', tokenController.token.authenticate);

module.exports = api;