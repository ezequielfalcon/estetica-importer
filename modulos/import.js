/**
 * Created by eze on 13/04/17.
 */
module.exports = function(db, pgp) {
    var module = {};
    var qrm = pgp.queryResult;

    module.pacientes = pacientes;
    module.medicos = medicos;
    module.os = os;

    function os(lineaPaciente){
        var os = lineaPaciente[7]|| "SIN OS";
        var osTrimmed = os.trim();
        var osUpper = osTrimmed.toUpperCase();
        var osFinal = normalizarOs(osUpper);
        db.func('obra_social_crear', osFinal).catch(function (err){
           //ignore
        });
    }

    function pacientes(lineaPaciente, idAux){
        var dni = lineaPaciente[0] || idAux;
        var nombre = lineaPaciente[1] || "";
        var apellido = lineaPaciente[6] || "";
        var fechaNac = lineaPaciente[2] || "1901-01-01";
        var sexoActual = lineaPaciente[3] || "";
        var sexoFinal;
        switch (sexoActual){
            case 'Masculino':
                sexoFinal = 'M';
                break;
            case 'Femenino':
                sexoFinal = 'F';
                break;
            default:
                sexoFinal = 'N';
                break;
        }
        var domicilio = lineaPaciente[4] || "";
        var telefono = lineaPaciente[9] || lineaPaciente[5] || "";
        var os = lineaPaciente[7]|| "SIN OS";
        var num_os = lineaPaciente[10] || "";
        var fechaAlta = lineaPaciente[11] || "1901-01-01";
        var mail = lineaPaciente[13] || "";
        var observaciones = lineaPaciente[8] || "";
        var osTrimmed = os.trim();
        var osUpper = osTrimmed.toUpperCase();
        var osFinal = normalizarOs(osUpper);
        if (!(fechaNac.substr(0,5).indexOf('/') > -1)){
            fechaNac = "1901-01-01";
        }
        if (!(fechaAlta.substr(0,5).indexOf('/') > -1)){
            fechaAlta = "1901-01-01";
        }
        db.func("paciente_crear_v2", [nombre.trim(), apellido.trim(), dni, fechaNac, telefono, mail, sexoFinal, osFinal, num_os, domicilio, observaciones, fechaAlta], qrm.one)
            .then(function (data){
                if (data.paciente_crear_v2 === 'error-paciente'){
                    console.log("Línea con error: " + idAux);
                    console.log(nombre + " " + apellido);
                }
                else if (data.paciente_crear_v2 === 'error-os'){
                    console.log("error OS!!!!!")
                }
            })
            .catch(function(err){
                console.log("Línea con error: " + idAux);
                console.log(nombre + " " + apellido);
                console.log(err);
        })

    }

    function medicos(lineaMedico){

    }

    function normalizarOs(osUpper){
        if (osUpper === "IIOMA" || osUpper === "IOMIA" || osUpper === "IOMNA" || osUpper === "IOMS" || osUpper === "IONA") osUpper = "IOMA";
        if (osUpper === '0SDE') osUpper = "OSDE";
        if (osUpper === 'BCO. PROVINCIA' || osUpper === 'BANCO POVINCIA') osUpper = 'BANCO PROVINCIA';
        if (osUpper === '0') osUpper = 'SIN OS';
        if (osUpper === 'PART.-' || osUpper === 'PARICULAR' || osUpper === 'PARTICULAR.-') osUpper = 'PARTICULAR';
        if (osUpper === 'SWIIS MEDICAL') osUpper = 'SWISS MEDICAL';
        if (osUpper === "PARTICULAR - PAMI" || osUpper === "PARTICULAR- PAMI") osUpper = 'PAMI - PARTICULAR';
        if (osUpper.indexOf("OSDE") > -1) osUpper = "OSDE";
        if (osUpper.indexOf("ACCORD") > -1) osUpper = "ACCORD SALUD";
        if (osUpper === 'ACA SALUD PLAN INTEGRAL') osUpper = 'ACA SALUD';
        if (osUpper === 'AMEP PLENO 2') osUpper = 'AMEP';
        if (osUpper === 'NO') osUpper = "SIN OS";
        if (osUpper.indexOf("APRES") > -1) osUpper = "APRES";
        if (osUpper.indexOf("ASOME") > -1) osUpper = "ASOME";
        if (osUpper.indexOf("COMEI ") > -1) osUpper = "COMEI";
        if (osUpper.indexOf("GALENO") > -1) osUpper = "GALENO";
        if (osUpper.indexOf("IOMA ") > -1) osUpper = "IOMA";
        if (osUpper.indexOf("MEDIFE ") > -1) osUpper = "MEDIFE";
        if (osUpper.indexOf("OSPE ") > -1) osUpper = "OSPE";
        if (osUpper.indexOf("OSPEA ") > -1) osUpper = "OSPE";
        if (osUpper.indexOf("OSPER ") > -1) osUpper = "OSPE";
        if (osUpper.indexOf("OSPE-") > -1) osUpper = "OSPE";
        if (osUpper.indexOf("OSPOCE ") > -1) osUpper = "OSPOCE";
        if (osUpper.indexOf("OSSEG ") > -1) osUpper = "OSSEG";
        if (osUpper.indexOf("OSTEL ") > -1) osUpper = "OSTEL";
        if (osUpper.indexOf("PRIMEDIC ") > -1) osUpper = "PRIMEDIC";
        if (osUpper.indexOf("LUIS PASTEUR ") > -1) osUpper = "LUIS PASTEUR";
        if (osUpper.indexOf("OSAP ") > -1) osUpper = "OSAP";
        if (osUpper.indexOf("OSAPM ") > -1) osUpper = "OSAPM";
        if (osUpper.indexOf("OSMEBA ") > -1) osUpper = "OSMEBA";
        if (osUpper.indexOf("SCIS ") > -1) osUpper = "SCIS";
        if (osUpper.indexOf("SWISS MEDICAL ") > -1) osUpper = "SWISS MEDICAL";
        if (osUpper.indexOf("UNION PERSONAL ") > -1) osUpper = "UNION PERSONAL";
        if (osUpper.indexOf("UP ") > -1) osUpper = "UNION PERSONAL";
        if (osUpper === 'UP') osUpper = "UNION PERSONAL";
        if (osUpper === 'I MEDICAL' || osUpper === 'I-MEDICAL' || osUpper === 'IMEDICAL SILVER') osUpper = 'IMEDICAL';
        var osNum = osUpper.replace('/', '');
        osNum = osNum.replace('-', '');
        osNum = osNum.replace('A', '');
        if (+osNum){
            osUpper = "SIN OS";
        }
        return osUpper;
    }

    return module;
};