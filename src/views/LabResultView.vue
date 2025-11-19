<script setup>
import FooterMedico from "../components/FooterMedico.vue";
//import { useAuthStore } from "../stores/auth";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { statusPacienteEmergencia, urlDocumento } from "../services/patient";
import PdfViewer from "../components/PdfViewer.vue";
import { useNotification } from "@kyvg/vue3-notification";
import {screenview} from "vue-gtag";
import {decryptId} from "../services/security";

// const authStore = useAuthStore();
// const user = computed(() => authStore.user);
// const type = computed(() => authStore.type);

const route = useRoute();
const router = useRouter();
const { notify } = useNotification();
const isLoading = ref(false);
const isAvailable = ref(false);
const props = defineProps(["nhc", "url"]);
const src = ref(null);
const statusPaciente = ref(null);
const encryptedNHC = ref(props.nhc);
console.log('encryptedNHC', encryptedNHC.value);
const nhc = ref(decryptId(encryptedNHC.value));
console.log('nhc', nhc.value);
const url = ref(props.url);
const title = ref("Resultado de Laboratorio - Metrovirtual - Hospital Metropolitano");

onMounted(() => {
  screenview('Resultado de Laboratorio');
  getUrl(url.value);
  getPatientDetails(nhc.value);

});
const getPatientDetails = (nhc) => {
  try {
    // get patient status
    statusPacienteEmergencia(nhc).then((response) => {
      if (response.status) {
        statusPaciente.value = response.data;
        title.value = `Resultado de Laboratorio ${statusPaciente.value.NOMBRE_PACIENTE} - MetroVirtual - Hospital Metropolitano`;
      }
    }).catch((e) => {
      console.log("error", e);
    });

  } catch (e) {
    console.log("error", e);
  }
};
const goBack = () => {
    console.log("route query", route.query);
    if (window.history.state.back === null) {
      if (route.query.prev === "detalle-paciente") {
        router.replace({ name: "detalle-paciente", params: { nhc: encryptedNHC.value } });
      } else if (route.query.prev === "resultados") {
        router.replace({ name: "resultados-paciente-imagen-y-laboratorio-medicos", params: { nhc: encryptedNHC.value } });
      } else {
        router.replace({ name: "dashboard" });
      }
    } else {
      router.back();
    }
  }
;

const getUrl = async (url) => {
  try {
    if (url) {
      isLoading.value = true;
      let response = await urlDocumento(`https://api.hospitalmetropolitano.org/v2/pacientes/resultado/l/?id=${url}`);
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
    }
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
                  <img class="img-header-icon my-3 my-md-1 ml-3" src="@/assets/resultados.png" alt=" icon">
                </div>
                <h4 class="d-flex text-headerv2 mt-2" style="text-align:left; color: #05305d;
                                    font-weight: 600;">
                  Resultado de Laboratorio <br>
                  {{ statusPaciente?.NOMBRE_PACIENTE }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
      <div class="container m-auto d-block " style="background: #f8f9fc;">
        <div class="row my-2 pb-5 pt-1">
          <div class="col-sm-12">
            <template v-if="isLoading">
              <div class="d-flex justify-content-center">
                <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
              </div>
            </template>
            <template v-else>
              <template v-if="isAvailable">
                <pdf-viewer :url="src" :nhc="nhc" :name="'resultado_laboratorio'" :id="url"
                            :type="'laboratorio'" :share="false"/>
              </template>
              <template v-else>
                <p class="center text-search">Resultado de laboratorio no disponible</p>
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
