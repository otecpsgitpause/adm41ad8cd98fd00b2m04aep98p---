var mysql = require('../../../mysql-config');

/**
 * Indentificación package
 */
var usuario = {
        insertUsuario: function(userData) {
            return new Promise((resolve, reject) => {

                if (mysql) {

                    mysql.query('INSERT INTO usuario SET ?', userData, (error, result) => {
                        if (error) {
                            //throw error;
                            resolve({ success: false, error: error });
                        } else {
                            //devolvemos la última id insertada
                            //callback(result);
                            resolve({ success: true, result: result });
                            mysql.end();
                        }
                    })
                }
            })
        }

    },
    rol = {},
    detail_usuario_rol = {},
    organizacion = {},
    usuario_organizacion = {},
    sistema = {
        identificationSistema: function(sistemaReq) {
            let jData = JSON.parse(sistemaReq);
            /** format
             * { domain: 'localhost',
                urlBase: 'http://localhost:4200/',
                appPortRun: '4200',
                appProtocolRun: 'http:',
                identification: 'a946306bedfdf139e73a425881d1644ca50a7de22914' }
             */
            return new Promise((resolve, reject) => {
                let sql = 'SELECT * FROM sistema WHERE cod_app=? and url_use=? and protocol=? and port=? and domain=?';
                mysql.query(sql, [jData.identification, jData.urlBase, jData.appProtocolRun, jData.appPortRun, jData.domain], (error, result) => {
                    if (error) {
                        resolve({ error: true });
                    } else {
                        resolve({ error: false });
                    }

                })
            }).catch(() => {
                console.log('algo paso en la identificación del sistema');
            })
        }
    };




module.exports = {
    usuario,
    rol,
    detail_usuario_rol,
    organizacion,
    usuario_organizacion,
    sistema
}