import {mande} from 'mande';

const baseURLV1 = 'https://api.hospitalmetropolitano.org/t/v1';
const baseURLV2 = 'https://api.hospitalmetropolitano.org/v2';
export function misFacturasPendientes(filter) {
    const patients = mande(`${baseURLV2}/medicos/mis-facturas-pendientes?typeFilter=${filter}`);
    return patients.post({});
}
export function misFacturasPagadas(payload) {
    let url = `${baseURLV2}/medicos/mis-facturas-pagadas?typeFilter=${payload.type}&start=${payload.start}&length=${payload.end}`;
    if(payload.startDate && payload.type === 3){
        url += `&fechaDesde=${payload.startDate}`;
    }
    if(payload.endDate && payload.type === 3){
        url += `&fechaHasta=${payload.endDate}`;
    }
    console.log('url', url);
    const patients = mande(url);
    return patients.post(payload);
}
export function facturaPagada(data) {
    const patients = mande(  `${baseURLV2}/medicos/honorarios/reportes?idReport=PP`);
    return patients.post(data);
}
export function transaccion(data) {
    const patients = mande(  `${baseURLV2}/medicos/honorarios/reportes?idReport=PPM`);
    return patients.post(data);
}
export function estadoDeCuenta(data) {
    const patients = mande(  `${baseURLV2}/medicos/honorarios/reportes?idReport=EC`);
    return patients.post(data);
}

export function misTransacciones(filter, start, length, payload) {
    const patients = mande(`${baseURLV2}/medicos/mis-transferencias?typeFilter=${filter}&start=${start}&length=${length}`);
    return patients.post(payload);
}

export function misTransaccionesPorFecha(filter, start, length, dateStart, dateEnd, payload) {
    const patients = mande(`${baseURLV2}/medicos/mis-transferencias?typeFilter=${filter}&start=${start}&length=${length}&fechaDesde=${dateStart}&fechaHasta=${dateEnd}`);
    return patients.post(payload);
}

export function misHonorariosAuditados(payload) {
    console.log('pauload', payload);
    let url = `${baseURLV2}/medicos/honorarios/auditados?typeFilter=${payload.typeFilter}&start=${payload.start}&length=${payload.length}`;
    console.log('url', url);
    if(payload.startDate){
        url += `&fechaDesde=${payload.startDate}`
    }
    if(payload.endDate){
        url += `&fechaHasta=${payload.endDate}`
    }
    if(payload.searchField){
        url += `&searchField=${payload.searchField}`
    }
    if(payload.searchFilter){
        url += `&searchFilter=${payload.searchFilter}`
    }
    const patients = mande(url);
    return patients.post(payload);
}



export function misHonorariosAuditadosDetalle(payload) {
    const patients = mande(`${baseURLV2}/medicos/honorarios/detalle-auditados`);
    return patients.post(payload);
}

export function misHonorariosAuditadosAtencion(payload) {
    const patients = mande(`${baseURLV2}/medicos/honorarios/detalle-atencion`);
    return patients.post(payload);
}

// export function svPacienteEmergencia(nhc) {
//     const data = {
//         numeroHistoriaClinica: nhc
//     };
//   const patients = mande(  `${baseURLV1}/sv-paciente-emergencia`);
//   return patients.post(data);
// }
//
// export function evPacienteEmergencia(nhc) {
//     const data = {
//         numeroHistoriaClinica: nhc
//     };
//   const patients = mande(  `${baseURLV1}/ev-paciente-emergencia`);
//   return patients.post(data);
// }
//
// export function resultadosLaboratorioPaciente(nhc) {
//   const patients = mande(  `${baseURLV2}/pacientes/resultados-laboratorio`);
//   return patients.get(`${nhc}`);
// }
//
// export function resultadosImagenPaciente(nhc) {
//   const patients = mande(  `${baseURLV2}/pacientes/resultados-img`);
//   return patients.get(`${nhc}`);
// }
//
// export function formularioPaciente(nhc, adm) {
//   const patients = mande(  `${baseURLV2}/medicos`);
//   return patients.get(`formulario?nhcl=${nhc}&adm=${adm}`);
// }
//
// export function urlDocumento(url) {
//   const patients = mande(  url);
//   return patients.get('');
// }
// export function urlCurva(data) {
//   const patients = mande(  `${baseURLV2}/medicos/reportes`);
//   return patients.post(data);
// }

