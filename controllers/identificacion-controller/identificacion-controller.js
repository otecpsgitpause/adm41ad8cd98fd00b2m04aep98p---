var identificacionQM = require('../../bds/mysql/querys/models/identificacion/identificacion-query');

var identificacion = {
    insertUser: function(req, res) {
        let userData = req.body;

        identificacionQM.usuario.insertUsuario().then((r) => {
            if (r.success == true) {
                console.log('insertado registro');
            } else {
                console.log('registro no insertado');
            }
        });
    }
}

/**
 * Inserción method
 */


/**
 * Inserción / method
 */



module.exports = {
    identificacion
}