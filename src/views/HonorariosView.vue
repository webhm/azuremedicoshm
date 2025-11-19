<script setup>
//import {useAuthStore} from "../stores/auth";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import {event, screenview} from "vue-gtag";

// const authStore = useAuthStore();
// const user = computed(() => authStore.user);
// const type = computed(() => authStore.type);

const router = useRouter();

const goBack = () => {
  router.back();
};
// const items = computed(() => searchStore.items);
// const itemsCount = computed(() => searchStore.itemsCount);
const goTo = async (name) => {
  await router.push({ name: name });
};

onMounted(async () => {
  screenview('Mis Honorarios');
});
</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Mis honorarios - MetroVirtual - Hospital Metropolitano</title>
    </teleport>
    <div class="justify-content-center py-1" style="background-color: rgb(229 237 241);">
      <!--login section-->
      <div class="container m-auto d-block">
        <div class="row mb-2  mt-2 justify-content-center">
          <!--columna de text-->
          <div class=" col-6 " @click="goBack()">
            <div class="row mt-3">
              <h5 class="cursor-pointer ml-3" style=" color: #0f4470; font-size: 16px;">
                <font-awesome-icon :icon="['fas', 'chevron-left']" />
                Regresar
              </h5>
            </div>
          </div>
          <div class="col-6">
            <div class="d-block py-1">
              <div class="d-flex justify-content-end">
                <div class="img-div">
                  <img class="img-header-icon ml-3 pt-2 pt-md-1" src="@/assets/honorarios.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-3" style="text-align:center; color: #05305d; font-weight: 600;">
                  Mis honorarios
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
      <div class="container m-auto d-block" style="background: #f8f9fc;">
        <div class="row mb-5 mt-5 justify-content-center">
          <!--columna de iconos-->
          <div class=" col-6 col-md-4 d-block pb-3 ">
            <div class="icon-img cursor-pointer" @click="goTo('honorarios-facturas-pagadas')">
              <div class="row d-block img-border">
                <img class="img-icon-color" src="@/assets/facturas-pagadas-blanco.png" alt=" icon">
                <img class="img-icon-color color-margin" src="@/assets/facturas-pagadas.png" alt=" icon" >
                <br>
              </div>
              <p class="d-block text-icon-color mt-3 ">Facturas <br>Pagadas
              </p>
            </div>
          </div>
          <div class=" col-6 col-md-4 d-block pb-3 ">
            <div class="icon-img cursor-pointer" @click="goTo('honorarios-facturas-pendientes')">
              <div class="row d-block img-border">
                <img class="img-icon-color" src="@/assets/facturas-pendientes-blanco.png" alt=" icon">
                <img class="img-icon-color color-margin" src="@/assets/facturas-pendientes.png" alt=" icon" >
                <br>
              </div>
              <p class="d-block text-icon-color mt-3">Facturas <br>Pendientes
              </p>
            </div>
          </div>
          <div class=" col-6 col-md-4 d-block pb-3 ">
            <div class="icon-img cursor-pointer" @click="goTo('honorarios-transacciones')">
              <div class="row d-block img-border">
                <img class="img-icon-color" src="@/assets/facturas-blanco.png" alt=" icon">
                <img class="img-icon-color color-margin" src="@/assets/facturas.png" alt=" icon" >
                <br>
              </div>
              <p class="d-block text-icon-color mt-3">Transacciones<br>
              </p>
            </div>
          </div>
          <div class=" col-6 col-md-4 d-block pb-3 ">
            <div class="icon-img cursor-pointer" @click="goTo('honorarios-estados-de-cuenta')">
              <div class="row d-block img-border">
                <img class="img-icon-color" src="@/assets/estados-blanco.png" alt=" icon">
                <img class="img-icon-color color-margin" src="@/assets/estados.png" alt=" icon">
                <br>
              </div>
              <p class="d-block text-icon-color mt-3">Estados <br> de Cuenta
              </p>
            </div>
          </div>
          <div class=" col-6 col-md-4 d-block pb-3 ">
            <div class="icon-img cursor-pointer" @click="goTo('honorarios-auditados')">
              <div class="row d-block img-border">
                <img class="img-icon-color" src="@/assets/audited-blanco.png" alt=" icon">
                <img class="img-icon-color color-margin" src="@/assets/audited.png" alt=" icon" >
                <br>
              </div>
              <p class="d-block text-icon-color mt-3">Honorarios <br> Auditados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
