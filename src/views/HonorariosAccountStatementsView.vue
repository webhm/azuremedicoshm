<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import { useAuthStore } from "../stores/auth";
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import {event, screenview} from 'vue-gtag';
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const startDate = ref(null);
const endDate = ref(null);
const isLoading = ref(false);
const router = useRouter();


const goBack = async () => {
  await router.back();
};

onMounted(async () => {
  screenview(`Estados de Cuenta`);
  const now = dayjs();
  endDate.value = now.format('YYYY-MM-DD');
  startDate.value = now.subtract(10, 'day').format('YYYY-MM-DD');
});
const goToDetail = async () => {
  event('see_account_statement', {
    startDate: startDate.value,
    endDate: endDate.value,
    user_name: user.value.name
  });
  router.push({
    name: "honorarios-account-statement", params: {
      start: startDate.value,
      end: endDate.value,
    }
  }).catch((e) => console.log("e", e));
};

</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Estados de Cuenta - MetroVirtual - Hospital Metropolitano</title>
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
                  <img class="img-header-icon ml-3" src="@/assets/facturas-pagadas.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-3"
                    style="text-align:left; color: #05305d; font-weight: 600;">
                  Estados de Cuenta
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
      <div class="container m-auto d-block" style="background: #f8f9fc;">
        <div class="row justify-content-center">
          <div class="my-3 col-12 ">
            <div class=" d-flex flex-column flex-md-row  justify-content-center">
              <div class="col-12 col-md-9 mt-3">
                <div class="row">
                  <div class="col-12 col-md-6">
                    <label class="text-label mb-1" style="margin-top: -30px; display: block;">Desde:</label>
                    <input type="date" v-model="startDate" style="border-radius: 50px;"
                           class="special special-mobile form-control"
                           required>
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="text-label mb-1" style="margin-top: -30px; display: block;">Hasta:</label>
                    <input type="date" v-model="endDate"
                           class="special special-mobile form-control"
                           required>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-3 mt-3">
<!--                <a class="text-center cursor-pointer pt-2 btn-logindownload btn-logindownloadmobile"-->
<!--                   :href="`https://api.hospitalmetropolitano.org/h2/v0/controlador/descarga_documentos/preparar_estado_cuenta.php?proveedor=${user.username.split('@')[0]}&fecha_desde=${startDate}&fecha_hasta=${endDate}&tipo_imprime=PAGOS`"-->
<!--                   target="_blank" download>-->
<!--                  Descargar-->
<!--                </a>-->
                <div class="text-center cursor-pointer pt-2 btn-logindownload btn-logindownloadmobile"
                @click="goToDetail()">
                  Visualizar
                </div>
              </div>
            </div>
            <p class="my-1" style="color: red;">
              Esta consulta puede tomar varios minutos dependiendo del rango de fechas seleccionado.</p>
          </div>
        </div>

        <FooterMedico />
      </div>

    </div>
  </div>
</template>

<style scoped>
</style>
