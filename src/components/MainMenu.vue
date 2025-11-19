<script setup>
import {useRouter} from "vue-router";
import {useAuthStore} from "../stores/auth";
import {computed, onMounted, ref} from "vue";

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const language = ref("es");
const opened = ref(false);

const logout = async () => {
  try {
    opened.value = !opened.value;
    await authStore.logout();
    await router.replace({name: "ingreso"});
  } catch (e) {
    console.log("error", e);
  }
};
const goTo = async (name) => {
  opened.value = !opened.value;
  await router.replace({
    name: name
  }).catch((e) => {
    console.log("e", e);
  });
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
onMounted(() => {

});
</script>

<template>
  <div class="inside-menu text-white">
    <div @click="goTo('mi-perfil-medico')"
         class="cursor-pointer p-3 d-flex justify-content-center item-first">
      <img class="icon icon--small mx-2"
           src="@/assets/icon-medicos-blanco.png" width="24" height="22"
           alt="perfil">
      <span
          class="">{{
          language === "es" ? "Mi Perfil" : "My Profile"
        }}</span>
    </div>
    <template v-if="user">
      <div @click="goTo('mis-pacientes')"
           v-if="authStore.hasRole('PERFIL_MEDICO_PACIENTES') || authStore.hasRole('PERFIL_MEDICO_RESIDENTES')"
           class="cursor-pointer p-2 d-flex justify-content-end item-header">
        <img class="icon icon--small my-2 mx-2"
             src="@/assets/icon-menu-pacientes.png"
             width="30" height="32" alt="Phone">
        <span class="inside-item p-2 mx-2">{{
            language === "es" ? "Mis Pacientes" : "My Patients"
          }}</span>
      </div>
      <div @click="goTo('resultados-imagen-y-laboratorio-medicos')"
           v-if="authStore.hasRole('PERFIL_MEDICO_RESULTADOS')"
           class="cursor-pointer p-2 d-flex justify-content-end item-header">
        <img class="icon icon--small my-3 mx-2"
             src="@/assets/icon-menu-rersultados.png"
             width="22" height="25" alt="Phone">
        <span class="inside-item p-2 mx-2">{{
            language === "es" ? "Resultados de Imagen y Laboratorio" : "Image and Lab Results"
          }}</span>
      </div>
      <div v-if="authStore.hasRole('PERFIL_MEDICO_BDOCU')"
           @click="goTo('biblioteca-de-credenciales')"
           class="cursor-pointer p-2 d-flex justify-content-end item-header ">
        <img class="icon icon--small my-2 mx-2"

             src="@/assets/icon-menu-biblioteca.png"
             width="22" height="25" alt="Phone">
        <span class="inside-item p-2 mx-2">{{
            language === "es" ? "Biblioteca de Credenciales" : "Credential Library"
          }}</span>
      </div>
      <div @click="goTo('honorarios')" v-if="authStore.hasRole('PERFIL_MEDICO_HONORARIOS')"
           class="cursor-pointer p-2 d-flex justify-content-end item-header">
        <img class="icon icon--small my-2 mx-2"
             src="@/assets/icon-menu-honorarios.png"
             width="25" height="28" alt="Phone">
        <span
            class="inside-item p-2 mx-2">{{
            language === "es" ? "Mis Honorarios" : "My Fees"
          }}</span>
      </div>
      <div @click="logout()"
           class="cursor-pointer p-2 d-flex justify-content-end item-header"
           style="border-bottom-right-radius: 15px; border-bottom-left-radius: 15px;">
        <img class="icon icon--small my-2 mx-2"
             src="@/assets/icon-menu-logout.png"
             width="22" height="25" alt="Phone">
        <span class="inside-item p-2 mx-2">{{
            language === "es" ? "Cerrar Sesión" : "Log Out"
          }}</span>
      </div>
    </template>
    <template v-else>
      <div @click="goTo('mis-pacientes')"
           class="cursor-pointer p-2 d-flex justify-content-end item-header">
        <img class="icon icon--small my-2 mx-2"
             src="@/assets/icon-menu-pacientes.png"
             width="30" height="32" alt="Phone">
        <span class="inside-item p-2 mx-2">{{
            language === "es" ? "Mis Pacientes" : "My Patients"
          }}</span>
      </div>
      <div @click="goTo('resultados-imagen-y-laboratorio-medicos')"
           class="cursor-pointer p-2 d-flex justify-content-end item-header">
        <img class="icon icon--small my-3 mx-2"
             src="@/assets/icon-menu-rersultados.png"
             width="22" height="25" alt="Phone">
        <span class="inside-item p-2 mx-2">{{
            language === "es" ? "Resultados de Imagen y Laboratorio" : "Image and Lab Results"
          }}</span>
      </div>
      <div @click="goTo('biblioteca-de-credenciales')"
           class="cursor-pointer p-2 d-flex justify-content-end item-header">
        <img class="icon icon--small my-2 mx-2"
             src="@/assets/icon-menu-biblioteca.png"
             width="22" height="25" alt="Phone">
        <span class="inside-item p-2 mx-2">{{
            language === "es" ? "Biblioteca de Credenciales" : "Credential Library"
          }}</span>
      </div>
      <div @click="goTo('honorarios')"
           class="cursor-pointer p-2 d-flex justify-content-end item-header">
        <img class="icon icon--small my-2 mx-2"
             src="@/assets/icon-menu-honorarios.png"
             width="23" height="26" alt="Phone">
        <span
            class="inside-item p-2 mx-2">{{
            language === "es" ? "Mis Honorarios" : "My Fees"
          }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.wrapper {
  background-color: white;
  border-radius: 15px;
}

.item-first {
  background: #0d2c65;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.inside-item {
  border-bottom: white 1px solid;
  width: 85%
}

.inside-menu {
  background-color: #28b6e8;
  border-radius: 15px;
}

.show-dropdown {
  display: block;
}

.hide-dropdown {
  display: none;
}

.btn-header {
  background: #0d2c65;
  border-radius: 15px;
}

.dropdown-item {
  padding: 0.25rem 0.5rem;
}

.card-body {
  padding: 0.5rem !important;
}

.dropdown-item:active {
  background-color: #259ddb !important;
}

.btn:focus, .btn.focus {
  outline: 0;
  box-shadow: none !important;
}


@media screen and (max-width: 600px) {
  button.hamburger.hamburger--slider.hamburger-test {
    display: none;
  }

  .wrapper {
    min-width: 80vw;
  }

  img.icon.icon--small.mr-2.mr-md-2 {
    max-width: 23px;
    height: 26px;
    width: 23px !important;
  }

  img.icon.icon--small.mr-1.mr-md-1 {
    max-width: 24px;
    max-height: 22px;
  }
}

</style>
