import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './assets/main.css';
import 'core-js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
//import './registerServiceWorker';
import VueGtag from 'vue-gtag';
import router from './router';
import { createPinia } from 'pinia';
import Notifications from '@kyvg/vue3-notification';
library.add(fas, far, fab);

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(Notifications);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(VueGtag, {
    appName: 'MetroVirtual Médicos',
    pageTrackerScreenviewEnabled: true,
    config: { id: 'G-1LBKDPD80P' },
    enabled: true
}, router);
app.mount('#app');
