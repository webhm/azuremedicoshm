<script setup>

import { useAuthStore } from "../stores/auth";
import {computed, onMounted} from "vue";
import { useRouter } from "vue-router";
import { set, screenview, event } from 'vue-gtag'
//const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const type = computed(() => authStore.type);

const goTo = async (name) => {
  await router.push({ name: name });

};
const goToLink = async (url) => {
  window.open(url, '_blank');
};
const registerCredentials = async () => {
  screenview('Biblioteca de Credenciales');
  event('see_credentials');

};
const hashCode = (string) => {
  let hash = 0,
    i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
const hash = computed(() => hashCode(user.value?.name ? user.value?.name : "123456"));

onMounted(async () => {
  console.log('user', user.value);
  set({
    user_email: user.value.username,
    user_id: user.value.username,
    user_display_name: user.value.name,
    user_type: 'AZURE AD'
  });
  screenview('Dashbooard');
  event('logged_user_email', {
    value: user.value.username,
  });
  event('logged_user_id', {
    value: user.value.username,
  });
  event('logged_user_display_name', {
    value: user.value.name,
  });
  event('logged_user_type', {
    value: 'AZURE AD',
  });
});

</script>
<template>
  <div class="justify-content-center py-1"
       style="background-color: #f8f9fc;">
    <teleport to="#page-title">
      <title>Dashboard - MetroVirtual - Hospital Metropolitano</title>
    </teleport>
    <div class="container m-auto d-block">
      <div class="row mb-2 mb-md-2 mt-2 ml-3 px-3">
        <!--columna de text-->
        <div class="row mt-4">
          <img class="img-metrovirtuald" src="@/assets/metrovirtual_logo.svg" alt="Mundometro icon"
               width="100%" height="auto ">
        </div>
        <div class="row mt-4">
          <h5 style=" color: #44bdf0; font-size: 20px; font-weight: 500;">Bienvenido/a</h5><br>
        </div>
        <div class="row">
          <p class="title-user" style=" color: #05305d; font-size: 21px; font-weight: 600;">
            Dr/a. {{ user?.name }}</p><br>
        </div>
        <div class="row my-3">
          <p class="black-colorv2" style="font-size: 18px;">!Hoy será un gran día!</p>
        </div>
      </div>
<!--      <div class="text-center ">-->
<!--        <a class="btn btn-primary d-inline-block p-3"-->
<!--           style="background-color: #0d9cde !important; font-weight: 600;"-->
<!--           href="https://hmetro.sharepoint.com/:f:/s/DM/DocumentosDM/EliOX0UxKvRFrIlhPtHQCe8BaI2mtMj98ung6wzRN0O5dQ?e=laZ8Tg"-->
<!--           target="_blank"-->
<!--           rel="noopener noreferrer">-->
<!--          Tutoriales HIS MV-->
<!--        </a>-->
<!--      </div>-->
    </div>

    <div class="container m-auto d-block">
      <div class="row my-1 my-md-5 justify-content-center">
        <!--columna de iconos-->
        <div class=" col-6 col-md-3 d-block pb-5 "
             v-if="authStore.hasRole('PERFIL_MEDICO_PACIENTES') || authStore.hasRole('PERFIL_MEDICO_RESIDENTES')">
          <div class="icon-img cursor-pointer" @click="goTo('mis-pacientes')">
            <div class="row d-block img-border">
              <img class="img-icon-color" src="@/assets/mis-pacientes-blanco.png"
                   alt=" icon">
              <img class="img-icon-color color-margin" src="@/assets/mis-pacientes.png"  alt=" icon">
              <br>
            </div>
            <p class="d-block text-icon-color mt-3 py-2">Mis Pacientes
            </p>
          </div>
        </div>
        <div class=" col-6 col-md-3 d-block pb-5 " v-if="authStore.hasRole('PERFIL_MEDICO_RESULTADOS')">
          <div class="icon-img cursor-pointer" @click="goTo('resultados-imagen-y-laboratorio-medicos')">
            <div class="row d-block img-border">
              <img class="img-icon-color" src="@/assets/resultados-blancos.png"
                   alt=" icon">
              <img class="img-icon-color color-margin" src="@/assets/resultados.png" alt=" icon">
              <br>
            </div>
            <p class="d-block mt-3 text-icon-color">Resultados de <br>
              Imagen & <br>
              Laboratorio
            </p>
          </div>
        </div>
<!--        :href="`https://appdocumentosdirmed.azurewebsites.net/app/access/${user?.username.split('@')[0]}/a29bcf0f-e889-4181-b2d5-62d630d502ee`"-->
<!--        target="_blank"-->
        <div class=" col-6 col-md-3 d-block pb-5 " v-if="authStore.hasRole('PERFIL_MEDICO_BDOCU')">
          <div class="icon-img cursor-pointer" @click="goTo('biblioteca-de-credenciales')">
            <div class="row d-block img-border">
              <img class="img-icon-color" src="@/assets/biblioteca-blancov2.png"
                   alt=" icon">
              <img class="img-icon-color color-margin" src="@/assets/bibliotecav2.png" alt=" icon">
              <br>
            </div>
            <p class="d-block mt-3 text-icon-color">Biblioteca de <br>Credenciales
            </p>
          </div>
        </div>
        <div class=" col-6 col-md-3 d-block pb-5 " v-if="authStore.hasRole('PERFIL_MEDICO_HONORARIOS')">
          <div class="icon-img cursor-pointer" @click="goTo('honorarios')">
            <div class="row d-block img-border">
              <img class="img-icon-color" src="@/assets/honorarios-blancos.png"
                   alt=" icon">
              <img class="img-icon-color color-margin" src="@/assets/honorarios.png"  alt=" icon">
              <br>
            </div>
            <p class="d-block mt-3 text-icon-color py-1">Mis Honorarios
            </p>
          </div>
        </div>
        <div class=" col-6 col-md-3 d-block pb-5 " v-if="authStore.hasRole('PERFIL_MEDICO_BDOCU')">
          <div class="icon-img cursor-pointer"
               @click="goToLink('https://hmetro.sharepoint.com/:f:/s/DM/DocumentosDM/EliOX0UxKvRFrIlhPtHQCe8BaI2mtMj98ung6wzRN0O5dQ?e=laZ8Tg')">
            <div class="row d-block img-border">
              <img class="img-icon-color" src="@/assets/tutorial-blanco.png"
                   alt=" tutoriales">
              <img class="img-icon-color color-margin" src="@/assets/tutorial.png" alt=" tutoriales">
              <br>
            </div>
            <p class="d-block mt-3 text-icon-color">Tutoriales
            </p>
          </div>
        </div>
      </div>
      <div class="row mb-4 mb-md-2 justify-content-center  pb-5 my-2">
        <!--columna de text-->
        <div class=" col-12 col-md-4 my-3">
          <div class="row mt-2 mt-md-5 justify-content-center">
            <a href="https://www.hospitalmetropolitano.org/es/terminos-condiciones-y-uso-de-medios" target="_blank">
              <h5 class="title-terminos">
                Términos y Condiciones
              </h5>
            </a>
          </div>
        </div>
        <div class=" col-12 col-md-4 my-3">
          <div class="row mt-2 mt-md-5 justify-content-center">
            <a href="https://www.hospitalmetropolitano.org/es/politicas-de-privacidad" target="_blank">
              <h5 class="title-terminos">
                Políticas de Privacidad
              </h5>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
