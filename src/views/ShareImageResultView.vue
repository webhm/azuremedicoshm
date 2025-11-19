<script setup>
import { ref, onMounted } from "vue";
import { statusPacienteEmergencia, urlDocumento } from "../services/patient";
import PdfViewer from "../components/PdfViewer.vue";
import { useNotification } from "@kyvg/vue3-notification";
import {screenview} from "vue-gtag";
import {decryptId} from "../services/security";
const { notify } = useNotification();

const isLoading = ref(false);
const isAvailable = ref(false);
const props = defineProps(["url", "nhc"]);
const src = ref(null);
const encryptedNHC = ref(props.nhc);
const nhc = ref(decryptId(encryptedNHC.value));
const url = ref(props.url);
const title = ref("Resultado de Imagen - MetroVirtual - Hospital Metropolitano");
const statusPaciente = ref(null);

onMounted(() => {
  getUrl(url.value);
  getPatientDetails(nhc.value);
  screenview('Compartir Resultado de Imagen');
});
const getPatientDetails = (nhc) => {
  try {
    // get patient status
    statusPacienteEmergencia(nhc).then((response) => {
      if (response.status) {
        statusPaciente.value = response.data;
        title.value = `Resultado de Imagen ${statusPaciente.value.NOMBRE_PACIENTE} - Metrovirtual - Hospital Metropolitano`;
      }
    }).catch((e) => {
      console.log("error", e);
    });

  } catch (e) {
    console.log("error", e);
  }
};

const getUrl = (url) => {
  if (url) {
    isLoading.value = true;
    urlDocumento(`https://api.hospitalmetropolitano.org/v2/pacientes/resultado/i/?id=${url}`).then(async (response) => {
      console.log("response", response);
      if (response.status) {
        src.value = response.url;
        isAvailable.value = true;
      } else {
        notify({
          title: "El archivo no esta disponible",
          text: response.message,
          type: "error"
        });
        isAvailable.value = false;
      }
      isLoading.value = false;
      console.log("src.value", src.value);
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
          <div class=" col-6 ">
            <!--                        <div class="row mt-3">-->
            <!--                            <h5 class="cursor-pointer ml-3" style=" color: #0f4470; font-size: 16px;">-->
            <!--                                <i class="fas fa-chevron-left"></i>-->
            <!--                                Regresar-->
            <!--                            </h5>-->
            <!--                        </div>-->
          </div>
          <div class="col-6">
            <div class="d-block py-1">
              <div class="d-flex justify-content-end">
                <div class="img-div">
                  <img class="img-header-icon ml-3 my-3 my-md-1" src="@/assets/resultados.png" alt=" icon">
                </div>
                <h4 class="d-flex text-headerv2 mt-2" style="text-align:left; color: #05305d;
                                    font-weight: 600;">
                  Informe de imagen <br>
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
        <div class="row my-2 pb-5 pt-2">
          <div class="col-sm-12 mt-3">
            <template v-if="isLoading">
              <div class="d-flex justify-content-center">
                <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
              </div>
            </template>
            <template v-else>
              <template v-if="isAvailable">
                <pdf-viewer :url="src" :nhc="nhc" :name="'resultado_imagen'" :type="'imagen'"
                            :id="url" :share="true"/>
              </template>
              <template v-else>
                <p>Resultado no disponible</p>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
