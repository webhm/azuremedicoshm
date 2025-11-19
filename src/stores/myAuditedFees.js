import {defineStore} from 'pinia';
import {misHonorariosAuditados} from '../services/fees';
import { useNotification } from '@kyvg/vue3-notification';
const { notify }  = useNotification();
// searchPage
export let useMyAuditedFeesStore;
useMyAuditedFeesStore = defineStore({
    id: 'MyAuditedFees',
    getters: {},
    actions: {
        async getAuditedFees(payload) {
            //get data from backend
            try {
                this.search_type = payload.typeFilter;
                this.start = payload.start;
                this.length = payload.length;
                const response = await misHonorariosAuditados(payload );
                console.log('response transactions', response);
                if (response.status) {
                    this.audited_fees = response.data;
                } else {
                    this.audited_fees = [];
                    notify({
                        title: 'Hubo un error',
                        text: response.message,
                        type: 'error'
                    });
                }

            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
        clearAuditedFees() {
            //get data from backend
            try {
                this.audited_fees = [];
                this.search_type = 3;
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
    },
    state: () => ({
        audited_fees: [],
        search_type: 1,
        start: 0,
        length: 1000,
    }),
});
