<script setup>
import FooterMedico from "../components/FooterMedico.vue";
//import {useAuthStore} from "../stores/auth";
import {useMyPendingInvoicesStore} from "../stores/myPendingInvoices";
import {computed, ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import {screenview} from "vue-gtag";

// const authStore = useAuthStore();
// const user = computed(() => authStore.user);
// const type = computed(() => authStore.type);
const myPendingInvoicesStore = useMyPendingInvoicesStore();
const pending_invoices = computed(() => myPendingInvoicesStore.pending_invoices);
const search_type = computed(() => myPendingInvoicesStore.search_type);
const searchType = ref(2);
let isLoading = ref(false);
const router = useRouter();

const search = async () => {
  isLoading.value = true;
  await myPendingInvoicesStore.searchPendingInvoices(searchType.value);
  isLoading.value = false;
};

const goBack = async () => {
  await myPendingInvoicesStore.clearPendingInvoices();
  await router.push({name: "honorarios"});
};

const scrollToTop = () => {
};
onMounted(async () => {
  screenview('Facturas Pendientes');
  searchType.value = search_type.value;
  isLoading.value = true;
  await myPendingInvoicesStore.searchPendingInvoices(searchType.value);
  isLoading.value = false;
});

</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Facturas Pendientes - MetroVirtual - Hospital Metropolitano</title>
    </teleport>
    <div class="justify-content-center py-1" style="background-color: rgb(229 237 241);">
      <!--login section-->
      <div class="container m-auto d-block">
        <div class="row mb-2  mt-2 justify-content-center">
          <!--columna de text-->
          <div class=" col-6 " @click="goBack()">
            <div class="row mt-3">
              <h5 class="cursor-pointer ml-3" style=" color: #0f4470; font-size: 16px;">
                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                Regresar
              </h5>
            </div>
          </div>
          <div class="col-6">
            <div class="d-block py-1">
              <div class="d-flex justify-content-end">
                <div class="img-div">
                  <img class="img-header-icon ml-3" src="@/assets/facturas-pendientes.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-3"
                    style="text-align:left; color: #05305d; font-weight: 600;">
                  Facturas Pendientes
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
      <div class="container m-auto d-block" style="background: #f8f9fc;">
        <div class="row justify-content-center mt-3">
          <div class="col-12 col-md-5 col-lg-4 mt-1">
            <label class="my-2" style="text-align: center;display: block; color: #05305d; font-weight: 600;">Puedes
              buscar por:</label>
            <select style="text-align: center; border-radius: 50px;" class="form-control bg-white select-result"
                    v-model="searchType"
                    @change="search">
              <option :value="1">Seguros</option>
              <option :value="2">Hospital Metropolitano</option>
              <option :value="3">Entidades Publicas</option>
            </select>
          </div>
        </div>
        <div class="row my-2 pb-5 pt-2">
          <div class="col-sm-12 mt-3">
            <template v-if="isLoading">
              <div class="my-1 p-3 text-center">
                <img class="img-fluid" src="@/assets/loading.gif"
                     alt="Loading Hm">
              </div>
            </template>
            <template v-else>
              <template v-if="pending_invoices.length > 0">
                <div class=" m-1 p-3 row text-left border-result hover-list-element"
                     v-for="(pendingInvoice, pendingInvoiceKey) in pending_invoices"
                     :key="pendingInvoiceKey">
                  <div class="col-12 my-3">
                    <p class="title-results ">
                      <b>N° de Prefactura: {{ pendingInvoice?.PREFACTURA }}</b>
                    </p>
                    <p class="text-results"><b>Fecha:</b> {{ pendingInvoice?.FECHA }}</p>
                    <p class="text-results"><b>N° de Factura:</b> {{ pendingInvoice?.FACTURA }}</p>
                    <p class="text-results"><b>NHC:</b> {{ pendingInvoice?.HISTORIA_CLINICA }}</p>
                    <p class="text-results"><b>Paciente:</b> {{ pendingInvoice?.PACIENTE }}</p>
                    <p class="text-results"><b>Monto:</b> $ {{ pendingInvoice?.MONTO }}</p>
                    <p class="text-results"><b>Saldo:</b> $ {{ pendingInvoice?.SALDO }}</p>
                    <p class="text-results"><b>Cliente:</b> {{ pendingInvoice?.CLIENTE }}</p>
                  </div>
                  <!--                                                      <div class="col-3 d-flex justify-content-center">-->
                  <!--                                                          <a  :href="`https://api.hospitalmetropolitano.org/h2/v0/controlador/descarga_documentos/preparar_planilla_pago.php?proveedor=${user.codMedico}&fecha_transaccion=${pendingInvoice.FECHA}&numero_transaccion=${pendingInvoice.NO_TRANSACCION}&tipo_imprime=PAGOS`"-->
                  <!--                                                              target="_blank" download-->
                  <!--                                                              class="cursor-pointer"-->
                  <!--                                                              :title="`Descargar factura`">-->
                  <!--                                                              <div class="p-0 p-md-4 py-md-6">-->
                  <!--                                                                <font-awesome-icon :icon="['fas', 'download']" size="2x"-->
                  <!--                                                                                   class="icon-device" />-->
                  <!--                                                              </div>-->
                  <!--                                                          </a>-->
                  <!--                                                      </div>-->

                </div>
              </template>
              <template v-else>
                <div class=" my-1 p-3  text-center">
                  <h4 class="center text-search">
                    No tienes facturas pendientes
                  </h4>
                </div>
              </template>
            </template>

          </div>
        </div>
        <FooterMedico/>
      </div>

    </div>
  </div>
</template>

<style scoped>
</style>
