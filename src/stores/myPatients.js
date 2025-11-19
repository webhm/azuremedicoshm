import {defineStore} from 'pinia';
import {getMyPatients, searchMyPatients} from '@/services/myPatients';
import { useNotification } from '@kyvg/vue3-notification';
const { notify }  = useNotification();
// searchPage
export let useMyPatientsStore;
useMyPatientsStore = defineStore({
    id: 'myPatients',
    getters: {},
    actions: {
        async getPatients(start, length, isResident) {
            //get data from backend
            try {
                console.log('is resident', isResident);
                const response = await getMyPatients(start, length, isResident);
                console.log('response getMy patients', response);
                if (response.status) {
                    this.consulted_patients = response.dataInter;
                    this.total_consulted_patients = response.totalInter;
                    this.dealer_patients = response.dataTra;
                    this.total_dealer_patients = response.totalTra;
                } else {
                    notify({
                        title: 'hubo un error',
                        text: response.message,
                        type: 'error'
                    });
                }
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
        async searchPatients(start, length, term, isResident) {
            //get data from backend
            try {
                console.log('is resident', isResident);
                const response = await searchMyPatients(start,length, term, isResident);
                console.log('response getMy patients', response);
                if (response.status) {
                    this.consulted_patients = response.dataInter;
                    this.total_consulted_patients = response.totalInter;
                    this.dealer_patients = response.dataTra;
                    this.total_dealer_patients = response.totalTra;
                } else {
                    this.consulted_patients = [];
                    this.total_consulted_patients = 0;
                    this.dealer_patients = [];
                    this.total_dealer_patients = 0;
                    notify({
                        title: 'hubo un error',
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
                this.dealer_patients = [];
                this.total_dealer_patients = 0;
                this.consulted_patients = [];
                this.total_consulted_patients = 0;
                this.activeTab = 0;
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
    },
    state: () => ({
        dealer_patients: [],
        total_dealer_patients: 0,
        consulted_patients: [],
        total_consulted_patients: 0,
        activeTab: 0,
        activeTabPaciente: 0,
    }),
});
