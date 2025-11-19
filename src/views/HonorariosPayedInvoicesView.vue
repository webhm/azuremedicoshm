<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import {useAuthStore} from "../stores/auth";
import {useMyPayedInvoicesStore} from "../stores/myPayedInvoices";
import {computed, ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import dayjs from "dayjs";
import {event, screenview} from "vue-gtag";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
//const type = computed(() => authStore.type);
const myPayedInvoicesStore = useMyPayedInvoicesStore();
const payed_invoices = computed(() => myPayedInvoicesStore.payed_invoices);
const search_type = computed(() => myPayedInvoicesStore.search_type);
const searchTerm = ref("");
const startDate = ref(null);
const endDate = ref(null);
const searchType = ref(4);
let isLoading = ref(false);
//const route = useRoute();
const router = useRouter();
const search = async () => {
  isLoading.value = true;
  let payload = {
    searchField: searchTerm.value,
    type: searchType.value,
    start: 0,
    end: 1000,
    startDate: startDate.value,
    endDate: endDate.value,
  };
  await myPayedInvoicesStore.searchPayedInvoices(payload);
  isLoading.value = false;
};

const goBack = async () => {
  await myPayedInvoicesStore.clearPayedInvoices();
  await router.back();
};


const goToDetail = async (item) => {
  console.log('item invoice', item);
  event('see_payed_invoice', {
    invoice: item.FACTURA,
    user_name: user.value.name
  });
  router.push({
    name: "honorarios-factura-pagada", params: {
      title: item.FACTURA,
      id: item.NO_TRANSACCION,
      fecha: item.FECHA,
    }
  }).catch((e) => console.log("e", e));
};

onMounted(async () => {
  screenview('Facturas Pagadas');
  searchType.value = search_type.value;
  isLoading.value = true;
  const now = dayjs();
  endDate.value = now.format('YYYY-MM-DD');
  startDate.value = now.subtract(10, 'day').format('YYYY-MM-DD');
  let payload = {
    searchField: searchTerm.value,
    type: searchType.value,
    start: 0,
    end: 1000,
    startDate: startDate.value,
    endDate: endDate.value,
  };
  await myPayedInvoicesStore.searchPayedInvoices(payload);
  isLoading.value = false;
});

</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Facturas Pagadas - MetroVirtual - Hospital Metropolitano</title>
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
                  <img class="img-header-icon ml-3" src="@/assets/facturas-pagadas.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-3"
                    style="text-align:left; color: #05305d; font-weight: 600;">
                  Facturas Pagadas
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
          <div class="col-12 col-md-4 col-lg-3 mt-1">
            <label class="text-label my-1" style="color: #05305d; font-weight: 600;">Puedes buscar por:</label>
            <select class="form-control bg-white select-result " style="border-radius: 50px;"
                    v-model="searchType">
              <option :value="4">Por Apellidos y Nombres</option>
              <option :value="2">Por No. de Factura</option>
              <option :value="3">Por Fechas</option>
            </select>
          </div>
          <div class="my-3 col-12 col-md-8 col-lg-8">
            <div class=" d-flex flex-column flex-md-row justify-content-center">
              <div class="col-12 col-md-9 mt-3 ">
                <template v-if="searchType === 3">
                  <div class="row">
                    <div class="col-12 col-md-6">
                      <label class="text-label " style="margin-top: -30px; display: block;">Desde:</label>
                      <input type="date" v-model="startDate"
                             class="mt-1 special special-mobile form-control"
                             required>
                    </div>
                    <div class="col-12 col-md-6">
                      <label class="text-label " style="margin-top: -30px; display: block;">Hasta:</label>
                      <input type="date" v-model="endDate"
                             class="mt-1 special special-mobile form-control"
                             required>
                    </div>
                  </div>


                </template>
                <template v-else>

                  <input type="text" v-model="searchTerm"
                         class="special special-mobile form-control"
                         required
                         placeholder="Busca facturas pendientes"
                         @keyup.enter="search()"
                         @input="searchTerm = $event.target.value.toUpperCase()">
                </template>
              </div>
              <div class="col-12 col-md-3 mt-3 ">
                <button class="text-center cursor-pointer pt-2 btn-loginv2 btn-loginv2mobile"
                        @click="search()">
                  Buscar
                </button>
              </div>
            </div>
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
              <template v-if="payed_invoices.length > 0">
                <div class=" m-1 p-3 row text-left border-result hover-list-element"
                     v-for="(payedInvoice, payedInvoiceKey) in payed_invoices"
                     :key="payedInvoiceKey">
                  <div class="col-9 my-3">
                    <p class="title-results ">
                      <b>N° de Factura: {{ payedInvoice?.FACTURA }}</b>
                    </p>
                    <p class="text-results"><b>Fecha Pago:</b> {{ payedInvoice?.FECHA }}</p>
                    <p class="text-results"><b>Paciente:</b> {{ payedInvoice?.PACIENTE }}</p>
                    <p class="text-results"><b>Detalle Pago:</b> {{ payedInvoice?.DETALLE }}</p>
                    <p class="text-results"><b>Factura Total:</b> $ {{ payedInvoice?.MONTO }}</p>
                    <p class="text-results"><b>Monto Pago:</b> $ {{ payedInvoice?.CANCELA }}</p>
                  </div>
                  <div class="col-3 d-flex justify-content-center">
                    <!--                    <a-->
                    <!--                      :href="`https://api.hospitalmetropolitano.org/h2/v0/controlador/descarga_documentos/preparar_planilla_pago.php?proveedor=${user.username.split('@')[0]}&fecha_transaccion=${payedInvoice.FECHA}&numero_transaccion=${payedInvoice.NO_TRANSACCION}&tipo_imprime=PAGOS`"-->
                    <!--                      target="_blank" download-->
                    <!--                      class="cursor-pointer"-->
                    <!--                      :title="`Descargar factura`">-->
                    <!--                      <div class="p-0 p-md-4 py-md-6">-->
                    <!--                        <font-awesome-icon :icon="['fas', 'download']" size="2x"-->
                    <!--                                           class="icon-device" />-->
                    <!--                      </div>-->
                    <!--                    </a>-->
                    <div class="cursor-pointer" @click="goToDetail(payedInvoice)"
                         :title="`Descargar factura`">
                      <div class="p-0 p-md-4 py-md-6">
                        <font-awesome-icon :icon="['fas', 'eye']" size="2x"
                                           class="icon-device"/>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class=" my-1 p-3  text-center">
                  <h4 class="center text-search">
                    No tienes facturas pagadas
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
