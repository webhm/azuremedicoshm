import {defineStore} from 'pinia';
import {misFacturasPagadas} from '../services/fees';
import { useNotification } from '@kyvg/vue3-notification';
const { notify }  = useNotification();
// searchPage
export let useMyPayedInvoicesStore;
useMyPayedInvoicesStore = defineStore({
    id: 'MyPayedInvoices',
    getters: {},
    actions: {
        async searchPayedInvoices(payload) {
            //get data from backend
            try {
                this.search_type = payload.type;
                const response = await misFacturasPagadas(payload );
                console.log('response payedInvoices', response);
                if (response.status) {
                    this.payed_invoices = response.data;
                } else {
                    this.payed_invoices = [];
                    notify({
                        title: 'Hubo un error',
                        text: response.message,
                        type: 'error'
                    });
                }

            } catch (e) {
                this.payed_invoices = [];
                console.log('error', e);
                notify({
                    title: 'Hubo un error',
                    text: e,
                    type: 'error'
                });
            }
            //this.items = [];
        },
        clearPayedInvoices() {
            //get data from backend
            try {
                this.payed_invoices = [];
                this.search_type = 4;
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
    },
    state: () => ({
        payed_invoices: [],
        search_type: 4,
    }),
});
