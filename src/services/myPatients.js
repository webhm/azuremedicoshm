
import { mande, defaults } from 'mande';
const baseURL = 'https://api.hospitalmetropolitano.org/v2/medicos';
const mainSearch = mande(baseURL);


export function getMyPatients(start, length, isResident) {
    console.log('is resident service', isResident);
  const patients = mande(  baseURL);
    let url;
  if(isResident){
      url = `mv/mis-pacientes-residentes?start=${start}&length=${length}`
  }else{
      url = `mv/mis-pacientes?start=${start}&length=${length}`;
  }
    console.log('url', url);
  return patients.get(url);
}
export function searchMyPatients(start, length, search, isResident) {
    console.log('is resident search service', isResident);
    const patients = mande(  baseURL);
    let url;
    if(isResident){
        url = `mv/mis-pacientes-residentes?start=${start}&length=${length}&searchField=${search}`
    }else{
        url = `mv/mis-pacientes?start=${start}&length=${length}&searchField=${search}`;
    }
    console.log('url', url);
    return patients.get(url);
}

