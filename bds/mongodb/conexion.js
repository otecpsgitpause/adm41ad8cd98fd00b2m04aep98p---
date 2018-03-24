var mongoose = require('mongoose');
//var mail = require('../../util-implements/mail/configuracion/conf');
var crypto = require('../../util-implements/cryptojs-implement');
var conexion = {
    conectar: conectar,
    desconectar:desconectar
}

var dconect= process.env.conectString;

function conectar() {
    return new Promise((resolve, reject) => {
        mongoose.disconnect().then(()=>{
            crypto.decode(dconect).then((dd)=>{
                mongoose.connect(dd, { useMongoClient: true, promiseLibrary: global.Promise }, (err) => {
                if (err != null) {
    
                    resolve({ error: true });
    
                } else {
                    resolve({ error: false, type: err });
                }
            });
            })
        
        });
  
      
    })

}

function desconectar(){ 
}

module.exports = conexion;