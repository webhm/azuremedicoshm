
import { mande, defaults } from 'mande';
const baseURL = 'https://api.hospitalmetropolitano.org/v2/medicos';
const mainSearch = mande(baseURL);


export function medicAuthValidate(data) {
  const validate = mande(baseURL+'/vruc');
  return validate.post(data);
}
export function medicAuthLogin(data) {
    const login = mande(baseURL+'/auth');
    return login.post(data);
}
export function medicAuthRegister(data) {
    const register = mande(baseURL+'/register');
    return register.post(data);
}
export function medicAuthLostPassApplication(data) {
    const register = mande(baseURL+'/recovery');
    return register.post(data);
}
export function medicAuthLostPassValidate(data) {
    const register = mande(baseURL+'/token');
    return register.post(data);
}
export function medicAuthLostPassChange(data) {
    const register = mande(baseURL+'/lostpass');
    return register.post(data);
}

export function medicAuthSetToken(token) {
    // todos.options will be used for all requests
    defaults.headers.Authorization = token;

}

export function medicAuthClearToken() {
    delete defaults.headers.Authorization;
}
