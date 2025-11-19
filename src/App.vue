<script setup>
import { RouterView, useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import MainHeader from "@/components/MainHeader.vue";
import auth from "@/services/auth";
const route = useRoute();
const routeName = computed(() => route.name);
onMounted(async () => {
  let loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = 'none';
  }
  auth.configure('b9e99752-fbd6-4237-9e5e-661e01a45db2', false);
  // // Basic setup of MSAL helper with client id, or give up
  // if (process.env.VUE_APP_CLIENT_ID) {
  //
  //   // Restore any cached or saved local user
  //   this.user = auth.user()
  //   console.log(`configured ${auth.isConfigured()}`)
  // } else {
  //   this.error = 'VUE_APP_CLIENT_ID is not set, the app will not function! 😥'
  // }
});
</script>
<template>
  <div class="d-flex flex-column">
    <div class="view-content">
      <notifications :pauseOnHover="true" :duration="5000" />
      <main-header v-if="routeName !== 'share-medic-patient-zerofootprint-view'
      && routeName !== 'medic-patient-zerofootprint-view'
      && routeName !== 'medic-patient-zerofootprint-item-view'
      && routeName !== 'share-medic-patient-zerofootprint-item-view'">
      </main-header>
      <RouterView/>
    </div>
    <div class="footer" v-if="routeName !== 'share-medic-patient-zerofootprint-view'
    && routeName !== 'medic-patient-zerofootprint-view'
    && routeName !== 'share-medic-patient-zerofootprint-item-view'
    && routeName !== 'medic-patient-zerofootprint-item-view'">
      <div class="d-flex justify-content-center text-footer" >
        <p class="text-white p-3 text-copyright">Todos los derechos reservados. Hospital Metropolitano - 2023</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-content {
  min-height: 93vh;
  background: #f8f9fc;
}

.text-footer {
  background-color: #0d2c65;
}
.text-copyright {
  background-color: #0d2c65;
  text-align: center;
}
.footer{
  max-height: 20vh;
}


</style>
