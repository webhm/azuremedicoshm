import {defineStore} from 'pinia';
import {medicAuthSetToken, medicAuthClearToken} from '@/services/medicAuth';
import auth from "@/services/auth";
// searchPage
export let useAuthStore;
useAuthStore = defineStore({
    id: 'auth',
    getters: {


    },
    actions: {
        hasRole(name) {
            //get data from backend
            try {

                let roles = this.user?.idTokenClaims?.roles;
                if(!roles){
                    return false;
                }
                return roles.includes(name);
            }catch (e) {
                console.log('errpr', e);
                return false;
            }
            //this.items = [];
        },
        login(user, type, token) {
            //get data from backend
            try {

                this.user = user;
                localStorage.setItem('metrovirtualUser', JSON.stringify(user));
                this.type = type;
                localStorage.setItem('metrovirtualType', type);
                this.token = token;
                localStorage.setItem('metrovirtualToken', token);
                medicAuthSetToken(token);
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
        setUser(user) {
            //get data from backend
            try {

                this.user = user;
                localStorage.setItem('metrovirtualUser', JSON.stringify(user));
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
        setToken(token) {
            //get data from backend
            try {

                this.token = token;
                localStorage.setItem('metrovirtualToken', token);
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
        async logout () {
            //get data from backend
            try {

                medicAuthClearToken();
                this.user = null;
                this.type = null;
                this.token = null;
                localStorage.removeItem('metrovirtualUser');
                localStorage.removeItem('metrovirtualType');
                localStorage.removeItem('metrovirtualToken');
                await auth.clearLocal();
                await auth.logout();

            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
    },
    state: () => ({
        user: localStorage.getItem('metrovirtualUser') ?
            JSON.parse(localStorage.getItem('metrovirtualUser')) : null,
        type: localStorage.getItem('metrovirtualType'),
        token: localStorage.getItem('metrovirtualToken')
    }),
});
