import { mande } from 'mande';
const baseURLV1 = 'https://api.hospitalmetropolitano.org/t/v1';
const baseURLV2 = 'https://api.hospitalmetropolitano.org/v2';

export function statusPacienteEmergencia(nhc) {
    const data = {
        numeroHistoriaClinica: nhc
    };
  const patients = mande(  `${baseURLV1}/status-paciente-emergencia`);
  return patients.post(data);
}

export function svPacienteEmergencia(nhc) {
    const data = {
        numeroHistoriaClinica: nhc
    };
  const patients = mande(  `${baseURLV1}/sv-paciente-emergencia`);
  return patients.post(data);
}

export function evPacienteEmergencia(nhc) {
    const data = {
        numeroHistoriaClinica: nhc
    };
  const patients = mande(  `${baseURLV1}/ev-paciente-emergencia`);
  return patients.post(data);
}

export function resultadosLaboratorioPaciente(nhc) {
  const patients = mande(  `${baseURLV2}/pacientes/resultados-laboratorio`);
  return patients.get(`${nhc}`);
}

export function resultadosImagenPaciente(nhc) {
  const patients = mande(  `${baseURLV2}/pacientes/resultados-img`);
  return patients.get(`${nhc}`);
}

export function formularioPaciente(nhc, adm) {
  const patients = mande(  `${baseURLV2}/medicos`);
  return patients.get(`formulario?nhcl=${nhc}&adm=${adm}`);
}

export function urlDocumento(url) {
  const patients = mande(  url);
  return patients.get('');
}

export function postDocumento(url) {
  const patients = mande(  url);
  return patients.post({});
}
export function urlCurva(data) {
  const patients = mande(  `${baseURLV2}/medicos/reportes`);
  return patients.post(data);
}

