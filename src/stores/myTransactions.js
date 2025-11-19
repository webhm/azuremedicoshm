import {defineStore} from 'pinia';
import {misTransacciones, misTransaccionesPorFecha} from '@/services/fees';
import { useNotification } from '@kyvg/vue3-notification';
const { notify }  = useNotification();
// searchPage
export let useMyTransactionsStore;
useMyTransactionsStore = defineStore({
    id: 'MyTransactions',
    getters: {},
    actions: {
        async searchTransactions(filter, start, length, payload) {
            //get data from backend
            try {
                this.search_type = filter;
                const response = await misTransacciones(filter, start, length, payload );
                console.log('response transactions', response);
                if (response.status) {
                    this.transactions = response.data;
                } else {
                    this.transactions = [];
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
        async searchTransactionsByDate(filter, start, length,  dateStart, dateEnd, payload) {
            //get data from backend
            try {
                this.search_type = filter;
                const response = await misTransaccionesPorFecha(filter, start, length, dateStart, dateEnd, payload);
                console.log('response transactions', response);
                if (response.status) {
                    this.transactions = response.data;
                } else {
                    this.transactions = [];
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
        clearTransactions() {
            //get data from backend
            try {
                this.transactions = [];
                this.search_type = 4;
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
    },
    state: () => ({
        transactions: [],
        search_type: 4,
    }),
});
