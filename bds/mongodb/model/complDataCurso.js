var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var complementodatacurso = Schema({
    areas:[],
    identificador:Object
});
module.exports = mongoose.model('complementodatacurso', complementodatacurso);