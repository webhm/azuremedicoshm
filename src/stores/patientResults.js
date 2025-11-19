import {defineStore} from 'pinia';
// searchPage
export let usePatientResultsStore;
usePatientResultsStore = defineStore({
    id: 'PatientResults',
    getters: {},
    actions: {
        clearPatientResults() {
            this.patient = null;
            this.lab_results = [];
            this.image_results = [];
            this.activeTab = 0;
            this.seeImages = false;
        },
    },
    state: () => ({
        patient: null,
        lab_results: [],
        image_results: [],
        activeTab: 0,
        seeImages: false,
    }),
});
