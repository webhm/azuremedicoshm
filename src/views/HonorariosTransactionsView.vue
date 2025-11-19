<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import { useAuthStore } from "../stores/auth";
import { useMyTransactionsStore } from "../stores/myTransactions";
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import {event, screenview} from "vue-gtag";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const myTransactionsStore = useMyTransactionsStore();
const transactions = computed(() => myTransactionsStore.transactions);
const search_type = computed(() => myTransactionsStore.search_type);
const searchTerm = ref("");
const startDate = ref(null);
const endDate = ref(null);
const searchType = ref(4);
let isLoading = ref(false);
const router = useRouter();

const search = async () => {
  isLoading.value = true;
  let payload = {
    searchField: searchTerm.value
  };
  await myTransactionsStore.searchTransactionsByDate(3, 0, 1000, startDate.value, endDate.value, payload);
  isLoading.value = false;
};

const goBack = async () => {
  await myTransactionsStore.clearTransactions();
  await router.back();
};
const goToDetail = async (item) => {
  console.log('item transaction', item);
  event('see_transaction', {
    account: item.CTA_BANCARIA,
    user_name: user.value.name
  });
  router.push({
    name: "honorarios-transaccion", params: {
      title: item.CTA_BANCARIA,
      id: item.NO_TRANSACCION,
      fecha: item.FECHA,
    }
  }).catch((e) => console.log("e", e));
};
onMounted(async () => {
  screenview('Transacciones');
  const now = dayjs();
  endDate.value = now.format('YYYY-MM-DD');
  startDate.value = now.subtract(10, 'day').format('YYYY-MM-DD');
  searchType.value = search_type.value;
  isLoading.value = true;
  let payload = {
    searchField: searchTerm.value
  };
  await myTransactionsStore.searchTransactions(searchType.value, 0, 1000, payload);
  isLoading.value = false;
});

</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Transacciones - MetroVirtual - Hospital Metropolitano</title>
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
                  <img class="img-header-icon ml-3" src="@/assets/facturas.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-3"
                    style="text-align:left; color: #05305d; font-weight: 600;">
                  Transacciones
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
          <div class="my-2 col-12">
            <div class=" d-flex flex-column flex-md-row justify-content-center">
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
              <template v-if="transactions.length > 0">
                <div class=" m-1 p-3 row text-left border-result hover-list-element"
                     v-for="(transaction, transactionKey) in transactions"
                     :key="transactionKey">
                  <div class="col-9 my-3">
                    <p class="title-results ">
                      <b>N° de Cuenta: {{ transaction?.CTA_BANCARIA }}</b>
                    </p>
                    <p class="text-results"><b>Fecha Pago:</b> {{ transaction?.FECHA }}</p>
                    <p class="text-results"><b>N° de Transacción:</b> {{ transaction?.NO_TRANSACCION }}</p>
                    <p class="text-results"><b>Monto:</b> $ {{ transaction?.MONTO }}</p>
                    <p class="text-results"><b>SubTotal:</b> $ {{ transaction?.SUBTOTAL }}</p>
                    <p class="text-results"><b>Retención:</b> $ {{ transaction?.RETENCION }}</p>
                  </div>
                  <div class="col-3 d-flex justify-content-center">
<!--                    <a-->
<!--                      :href="`https://api.hospitalmetropolitano.org/h2/v0/controlador/descarga_documentos/preparar_planilla_pago.php?proveedor=${user.username.split('@')[0]}&fecha_transaccion=${transaction.FECHA}&numero_transaccion=${transaction.NO_TRANSACCION}&tipo_imprime=PAGOS`"-->
<!--                      target="_blank" download-->
<!--                      class="cursor-pointer"-->
<!--                      :title="`Descargar factura`">-->
<!--                      <div class="p-0 p-md-4 py-md-6">-->
<!--                        <font-awesome-icon :icon="['fas', 'download']" size="2x"-->
<!--                                           class="icon-device" />-->
<!--                      </div>-->
<!--                    </a>-->
                    <div @click="goToDetail(transaction)"
                      class="cursor-pointer"
                      :title="`Descargar factura`">
                      <div class="p-0 p-md-4 py-md-6">
                        <font-awesome-icon :icon="['fas', 'eye']" size="2x"
                                           class="icon-device" />
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
        <FooterMedico />
      </div>

    </div>
  </div>
</template>

<style scoped>
</style>
