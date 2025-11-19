<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const goTo = async (name) => {
  await router.replace({
    name: name
  }).catch((e) => {
    console.log("e", e);
  });
};
</script>

<template>
  <div class="row my-5 justify-content-center">
    <!--columna de iconos-->
    <div class=" col-6 col-md-3 d-block pb-5"
         v-if="authStore.hasRole('PERFIL_MEDICO_PACIENTES') || authStore.hasRole('PERFIL_MEDICO_RESIDENTES')">
      <div class="icon-img cursor-pointer" @click="goTo('mis-pacientes')">
        <div class="row d-block img-border">
          <img class="img-icon-color" src="@/assets/mis-pacientes-blanco.png" alt=" icon">
          <img class="img-icon-color color-margin" src="@/assets/mis-pacientes.png"
               alt=" icon">
          <br>
        </div>
        <p class="d-block mt-3 text-icon-color py-2">Mis Pacientes
        </p>
      </div>
    </div>
    <div class=" col-6 col-md-3 d-block pb-5" v-if="authStore.hasRole('PERFIL_MEDICO_RESULTADOS')">
      <div class="icon-img cursor-pointer"
           @click="goTo('resultados-imagen-y-laboratorio-medicos')">
        <div class="row d-block img-border">
          <img class="img-icon-color" src="@/assets/resultados-blancos.png"
               alt=" icon">
          <img class="img-icon-color color-margin" src="@/assets/resultados.png"
               alt=" icon">
          <br>
        </div>
        <p class="d-block mt-3 text-icon-color">Resultados de <br>
          Imagen & <br>
          Laboratorio
        </p>
      </div>
    </div>
    <div class=" col-6 col-md-3 d-block pb-5 " v-if="authStore.hasRole('PERFIL_MEDICO_BDOCU')">
      <div class="icon-img cursor-pointer" style="text-decoration: none"
           @click="goTo('biblioteca-de-credenciales')"
        >
        <div class="row d-block img-border">
          <img class="img-icon-color" src="@/assets/biblioteca-blancov2.png" alt=" icon">
          <img class="img-icon-color color-margin" src="@/assets/bibliotecav2.png"
               alt=" icon">
          <br>
        </div>
        <p class="d-block mt-3 text-icon-color">Biblioteca de<br>Credenciales
        </p>
      </div>
    </div>
    <div class=" col-6 col-md-3 d-block pb-5 " v-if="authStore.hasRole('PERFIL_MEDICO_HONORARIOS')">
      <div class="icon-img cursor-pointer" @click="goTo('honorarios')">
        <div class="row d-block img-border">
          <img class="img-icon-color" src="@/assets/honorarios-blancos.png" alt=" icon">
          <img class="img-icon-color color-margin" src="@/assets/honorarios.png"
               alt=" icon">
          <br>
        </div>
        <p class="d-block mt-3 text-icon-color py-2">Mis Honorarios
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
