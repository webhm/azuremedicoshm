import {defineStore} from 'pinia';
import {useNotification} from '@kyvg/vue3-notification';
import {getFolders} from "../services/library";

const {notify} = useNotification();
// searchPage
export let useMyLibraryStore;
useMyLibraryStore = defineStore({
    id: 'myLibrary',
    getters: {},
    actions: {
        async getFolders(year, userName) {
            this.isLoading = true;
            this.total = 0;
            let data = {
                path: `${year}/${userName}`
            };
            console.log('data', data);
            let response = await getFolders(data);
            console.log('response', response);
            if (response.status) {
                this.folders.forEach((folder) => {
                    folder.data = response.data.filter((item) => item.Path.toLowerCase() === folder.name.toLowerCase());
                });
                this.total = response.data.length;
                console.log('total', this.total);
            }
            this.isLoading = false;
        },
        clearFolders() {
            //get data from backend
            try {
                this.folders = [
                    {
                        name: 'BLS',
                        label: 'BLS',
                        data: [],
                        isLoading: false,
                    },
                    {
                        name: 'Cursos-Certificados',
                        label: 'Cursos/Certificados',
                        data: [],
                        isLoading: false,
                    },
                    {
                        name: 'Credenciales',
                        label: 'Credenciales',
                        data: [],
                        isLoading: false,
                    },
                    {
                        name: 'Poliza-Responsabilidad-Civil',
                        label: 'Póliza de Responsabilidad Civil',
                        data: [],
                        isLoading: false,
                    },
                    {
                        name: 'Publicaciones',
                        label: 'Publicaciones',
                        data: [],
                        isLoading: false,
                    },
                ];
                this.total = 0;
                this.activeTab = 0;
                this.isLoading = false;
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
    },
    state: () => ({
        folders: [
            {
                name: 'BLS',
                label: 'BLS',
                data: [],
                isLoading: false,
            },
            {
                name: 'Cursos-Certificados',
                label: 'Cursos/Certificados',
                data: [],
                isLoading: false,
            },

            {
                name: 'Credenciales',
                label: 'Credenciales',
                data: [],
                isLoading: false,
            },
            {
                name: 'Poliza-Responsabilidad-Civil',
                label: 'Póliza de Responsabilidad Civil',
                data: [],
                isLoading: false,
            },
            {
                name: 'Publicaciones',
                label: 'Publicaciones',
                data: [],
                isLoading: false,
            },
        ],
        total: 0,
        activeTab: 0,
        isLoading: false,
    }),
});
