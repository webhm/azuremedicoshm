
import { mande, defaults } from 'mande';
const baseURL = 'https://api.hospitalmetropolitano.org/t/v1/buscar-paciente';


export function searchPatients(data) {
    const patients = mande( baseURL);
    return patients.post(data);
}

