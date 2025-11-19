import {defineStore} from 'pinia';
import {misFacturasPendientes} from '@/services/fees';
import { useNotification } from '@kyvg/vue3-notification';
const { notify }  = useNotification();
// searchPage
export let useMyPendingInvoicesStore;
useMyPendingInvoicesStore = defineStore({
    id: 'MyPendingInvoices',
    getters: {},
    actions: {
        async searchPendingInvoices(filter) {
            //get data from backend
            try {
                this.search_type = filter;
                const response = await misFacturasPendientes(filter);
                console.log('response payedInvoices', response);
                if (response.status) {
                    this.pending_invoices = response.data;
                } else {
                    this.pending_invoices = [];
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
        clearPendingInvoices() {
            //get data from backend
            try {
                this.pending_invoices = [];
                this.search_type = 2;
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
    },
    state: () => ({
        pending_invoices: [],
        search_type: 2,
    }),
});
