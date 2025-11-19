import {defineStore} from 'pinia';
import {searchPatients} from '@/services/searchPatients';
import { useNotification } from '@kyvg/vue3-notification';
const { notify }  = useNotification();
// searchPage
export let usePatientsListStore;
usePatientsListStore = defineStore({
    id: 'PatientsList',
    getters: {},
    actions: {
        async getPatients(searchTerm, searchType) {
            //get data from backend
            try {
                this.search_type = searchType;
                let data = {
                    pte: searchTerm,
                    tipoBusqueda: searchType
                };
                const response = await searchPatients(data);
                console.log('response searchPatients', response);
                if (response.status) {
                    this.patient_list = response.data;
                    notify({
                        title: 'Búsqueda correcta',
                        text: response.message,
                        type: 'success'
                    });
                } else {
                    this.patient_list = [];
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
        clearPatients() {
            //get data from backend
            try {
                this.patient_list = [];
                this.search_type = 'pte';
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
    },
    state: () => ({
        patient_list: [],
        search_type: 'pte',
        activeTab: 0,
    }),
});
