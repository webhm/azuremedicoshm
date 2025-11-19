
import { mande, defaults } from 'mande';
const baseURL = 'https://api.hospitalmetropolitano.org/v2/medicos/bdm';
const baseURL2 = 'https://api.hospitalmetropolitano.org/v2/medicos';

export function getFolders(data) {
    const patients = mande( `${baseURL}/list`);
    return patients.post(data);
}
export function checkFolder(data) {
    const patients = mande( `${baseURL}/folder`);
    return patients.post(data);
}
export function checkMedic() {
    const patients = mande( `${baseURL2}/check-point`);
    return patients.post({});
}
export function deleteFile(url) {
    const patients = mande( `${url}`);
    return patients.post({});
}
export function createFolder(data) {
    const patients = mande( `${baseURL}/addfolder`);
    return patients.post(data);
}
export function uploadFile(data) {
    const patients = mande( `${baseURL}/upload`);
    return patients.post(data);
}

