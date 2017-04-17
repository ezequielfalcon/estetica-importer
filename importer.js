/**
 * Created by eze on 13/04/17.
 */
var fs = require('fs');
var pgp = require("pg-promise")();
var cn = {
    host: 'localhost',
    port: 5432,
    database: 'estetica2',
    user: 'eze',
    password: 'Narrowamof14!'
};
var db = pgp(cn);

var modulos = require('./modulos/import')(db, pgp);

var archivo = process.argv[2];
console.log("Leyendo archivo: " + archivo);
var tipoImport = process.argv[3];
console.log("Tipo de import: " + tipoImport);
if (archivo && tipoImport){
    var array = fs.readFileSync(archivo).toString().split("\n");
    for (var i = 0; i < (array.length -1); i++){
        var campos = array[i].toString().split(",");
        switch (tipoImport){
            case 'pacientes':
                modulos.pacientes(campos, i);
                break;
            case 'medicos':
                modulos.medicos(campos);
                break;
            case 'os':
                modulos.os(campos);
                break;
        }

    }
}
else{
    console.log("Error, debe especificar el archivo a importar y el método!");
}

