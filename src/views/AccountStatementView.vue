<script setup>
import FooterMedico from "../components/FooterMedico.vue";
//import {useAuthStore} from "../stores/auth";
import {ref, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import pdf from "@jbtje/vite-vue3pdf";
import {useNotification} from "@kyvg/vue3-notification";
import {event, screenview} from "vue-gtag";
import {estadoDeCuenta} from "../services/fees";
import printJS from "print-js";

// const authStore = useAuthStore();
// const user = computed(() => authStore.user);
// const type = computed(() => authStore.type);
const route = useRoute();
const router = useRouter();
const {notify} = useNotification();
const numPagesEvent = (e) => {
  console.log("numPagesEvent", e);
  numPages.value = e;
};
const pageLoadedEvent = (e) => {
  console.log("currentPage", e);
  currentPage.value = e;
};
const currentPage = ref(1);
const numPages = ref(1);
const isLoading = ref(false);
const isAvailable = ref(false);
const props = defineProps(["start", "end"]);
const pdfRef = ref(null);
const src = ref(null);
const start = ref(props.start);
const end = ref(props.end);
const title = ref(`Estado de cuenta ${start.value} ${end.value} - MetroVirtual - Hospital Metropolitano`);


onMounted(() => {
  screenview(`Estado de cuenta ${start.value} ${end.value}`);
  getUrl();
});
const goBack = () => {
  console.log("route query", route.query);
  if (window.history.state.back === null) {
    router.replace({name: "honorarios-estados-de-cuenta"});
  } else {
    router.back();
  }
};
const previousPage = () => {
  currentPage.value = currentPage.value - 1;
};
const nextPage = () => {
  currentPage.value = currentPage.value + 1;
};

const getUrl = async () => {
  try {
    let payload = {
      start: start.value,
      end: end.value,
    };
    isLoading.value = true;
    console.log("payload", payload);
    let response = await estadoDeCuenta(payload);
    console.log("response", response);
    if (response.status) {
      src.value = response.url;
      isAvailable.value = true;
    } else {
      isAvailable.value = false;
      notify({
        title: "El archivo no esta disponible",
        text: response.message,
        type: "error"
      });
    }
    isLoading.value = false;
    console.log("src.value", src.value);
  } catch (e) {
    console.log("error", e);
    isLoading.value = false;
    isAvailable.value = false;
    notify({
      title: "El archivo no esta disponible",
      text: e.message,
      type: "error"
    });
  }
};
const printPdf = async () => {
  try {
    console.log("src", src.value);
    let resPrint = await printJS({printable: src.value, type: "pdf", showModal: true});
    console.log("res", resPrint);
    event('print');
  } catch (e) {
    console.log("e", e);
    notify({
      title: "Hubo un error al imprimir",
      type: "error"
    });
  }
};


</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>{{title}}</title>
    </teleport>
    <div class="justify-content-center py-1" style="background-color: rgb(229 237 241);">
      <!--login section-->
      <div class="container m-auto d-block">
        <div class="row my-1 justify-content-center">
          <!--columna de text-->
          <div class=" col-6 " @click="goBack()">
            <div class="row mt-2">
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
                  <img class="img-header-icon my-3 my-md-2 ml-3" src="@/assets/facturas.png" alt=" icon">
                </div>
                <h4 class="d-flex text-headerv2 mt-1" style="text-align:left; color: #05305d;
                                    font-weight: 600;">
                  Estado de Cuenta<br>
                  {{ start }} - {{ end }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
      <div class="container m-auto d-block " style="background: #f8f9fc;">
        <!--        <div class="row my-2">-->
        <!--          <div class=" d-flex justify-content-end">-->
        <!--            <div class="img-div">-->
        <!--              <img class="img-header-icon ml-3" src="@/assets/mis-pacientes.png" alt=" icon">-->
        <!--            </div>-->
        <!--            <br>-->
        <!--            <h4 class="d-flex text-headerv2 mt-3" style="text-align:left; color: #05305d;-->
        <!--                                    font-weight: 600;">-->
        <!--              {{ name }}-->
        <!--            </h4>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="d-flex paginator mt-2">
          <button class="prevew" v-if="currentPage > 1" @click="previousPage()">Atrás</button>
          <p class="text-paginator">{{ currentPage }} / {{ numPages }} Páginas</p>
          <button class="prevew" v-if="currentPage < numPages" @click="nextPage()">Siguiente</button>
        </div>

        <div class="row my-2 pb-5 pt-2">
          <div class="col-sm-12 mt-3">
            <template v-if="isLoading">
              <div class="d-flex justify-content-center">
                <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
              </div>
            </template>
            <template v-else>
              <template v-if="isAvailable">
                <div class="container">
                  <div class="row justify-content-end my-1 row-img">

                    <div class="col-2 col-md-1 col-img">
                      <a class="icon-img cursor-pointer" @click="printPdf()" title="Imprimir documento">
                        <div class="row img-borderv4">
                          <img class="img-icon-colorv3" src="@/assets/imprimir.png" alt=" icon">
                          <img class="img-icon-colorv3" src="@/assets/imprimir-blanco.png" alt=" icon"
                               style="margin-top: -35px;">
                        </div>
                      </a>
                    </div>
                    <div class="col-2 col-md-1 col-img">
                      <a class="icon-img cursor-pointer" :download="`${name}.pdf`" :href="`${src}`"
                         title="Descargar documento">
                        <div class="row img-borderv4">
                          <img class="img-icon-colorv3" src="@/assets/descargar.png" alt=" icon">
                          <img class="img-icon-colorv3" src="@/assets/descargar-blanco.png" alt=" icon"
                               style="margin-top: -35px;">
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
                <pdf
                    ref="pdfRef"
                    :src="src"
                    @num-pages="numPagesEvent"
                    @page-loaded="pageLoadedEvent"
                    :page="currentPage"
                ></pdf>
              </template>
              <template v-else>
                <p class="text-center text-search">Estado de Cuenta {{ start }} - {{ end }} no disponible</p>
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


.col-img {
  width: 60px;
  max-width: 60px;
}

.img-icon-colorv3 {
  width: 26px;
  height: 26px;
  margin: 0 auto;
  display: block;
  margin-top: 1px;
  padding: 0;
}

.img-borderv4 {
  background: linear-gradient(90deg, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 100%) !important;
  transition: all .30s linear;
  /*padding: 5px 5px;*/
  width: 50px;
  height: 50px;
  border-radius: 100%;
  text-align: center;
  border: 2px solid white;
  box-shadow: -6px 4px 13px 3px #e4e5e7;
}

.img-borderv4 > img {
  position: relative;
  top: 8px;
  /*left: 12px;*/
}

.img-borderv4 > img:last-of-type {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  -moz-transition: opacity 0.3s ease-in-out;
  -webkit-transition: opacity 0.3s ease-in-out;
}

/*
 * Hide the last image on hover
*/
.img-borderv4:hover > img:last-of-type {
  opacity: 0;
}

.paginator {
  text-align: center;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  -webkit-align-items: center;
}

p.text-paginator {
  margin-bottom: 0px;
  padding: 10px;
}

button.prevew {
  border: none;
  color: #2392da;
}

.row.share {
  text-align: right;
  justify-content: end;
}

.img-borderv4:hover {
  background: #E9EDF8 !important;
  border: 2px solid white;
  box-shadow: -6px 4px 13px 3px #e4e5e7;
}

.share button {
  border: none;
  border-right: 1px solid #d0d4d2;
  color: #6b6969;
}

@media screen and (max-width: 600px) {
  .row.share {
    display: none;
  }
}


</style>
