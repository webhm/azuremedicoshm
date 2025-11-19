<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import {useAuthStore} from "../stores/auth";
import {ref, computed, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {resultadosImagenPaciente, resultadosLaboratorioPaciente, urlDocumento} from "../services/patient";
import {searchPatients} from "../services/searchPatients";
import {useNotification} from "@kyvg/vue3-notification";
import dayjs from "dayjs";
import {event, screenview} from "vue-gtag";
import {usePatientResultsStore} from "../stores/patientResults";
import {decryptId, encryptId} from "../services/security";


const {notify} = useNotification();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const patient = computed(() => patientResultsStore.patient);
const patientResultsStore = usePatientResultsStore();
const lab_results = computed(() => patientResultsStore.lab_results);
const image_results = computed(() => patientResultsStore.image_results);
let isLoadingLab = ref(false);
let isLoadingImage = ref(false);
const router = useRouter();
const route = useRoute();
const props = defineProps(["nhc"]);
const encryptedNHC = ref(props.nhc);
const nhc = ref(decryptId(encryptedNHC.value));
const title = ref("Resultados de Imagen y Laboratorio - MetroVirtual - Hospital Metropolitano");

const getLabResults = (nhc) => {
  // get patient lab results
  if (lab_results.value.length < 1) {
    isLoadingLab.value = true;
  }

  resultadosLaboratorioPaciente(nhc).then((response) => {
    isLoadingLab.value = false;
    if (response.status) {
      patientResultsStore.lab_results = response.data;
    } else {
      patientResultsStore.lab_results = [];
      notify({
        title: "¡Atención!",
        text: "No existen resultados de laboratorio disponibles para este paciente",
        type: "info"
      });
    }
  });
};
const getImageResults = (nhc) => {
  // get patient lab results
  if (image_results.value.length < 1) {
    isLoadingImage.value = true;
  }
  resultadosImagenPaciente(nhc).then((response) => {
    isLoadingImage.value = false;
    if (response.status) {
      // image_results.value = response.data.map((image_result) => {
      //   let newIr = image_result;
      //   newIr.fecha_ = `${image_result.FECHA.substring(6, 10)}-${image_result.FECHA.substring(3, 5)}-${image_result.FECHA.substring(0, 2)}`;
      //   return newIr;
      // });
      patientResultsStore.image_results = response.data;
    } else {
      patientResultsStore.image_results = [];
      notify({
        title: "¡Atención!",
        text: "No existen resultados de imagen disponibles para este paciente",
        type: "info"
      });
    }
  });
};
const getPatientDetails = (nhc) => {
  let data = {
    pte: nhc,
    tipoBusqueda: "nhc"
  };
  searchPatients(data).then((response) => {
    if (response.status) {
      patientResultsStore.patient = response.data[0];
      title.value = `Resultados de ${patient.value?.NOMBRES} ${patient.value?.APELLIDOS} - MetroVirtual - Hospital Metropolitano`;
      screenview(`Resultados Imagen y Laboratorio de ${patient.value?.NOMBRES} ${patient.value?.APELLIDOS}`);
    } else {
      notify({
        title: "El paciente no existe",
        text: response.message,
        type: "error"
      });
      // TODO: regresar de pantalla
    }
  });
};

const getWord = (key) => {
  switch (key) {
    case "true":
    case true:
      return "Nuevo";
    default:
      return "Solicitado";
  }
};
const isWithin24Hours = (date) => {
  const dateForm = dayjs(date);
  const now = dayjs(); // Obtiene la fecha y hora actual
  const yesterday = now.subtract(24, "hour"); // Resta 24 horas a la fecha y hora actual
  return dateForm.isAfter(yesterday) && dateForm.isBefore(now); // Compara la fecha deseada con la fecha y hora actual y la fecha y hora de hace 24 horas
};

const goBack = () => {
  patientResultsStore.clearPatientResults();
  if (window.history.state.back === null) {
    router.replace({name: "resultados-imagen-y-laboratorio-medicos"});
  } else {
    router.back();
  }
};
const goToLabResult = async (result) => {
  let split = result.deep_link.split("/");
  // let url = router.resolve({
  //   name: "medic-lab-result-view",
  //   params: { url: split[3], nhc: nhc.value },
  //   query: { prev: "resultados" }
  // });
  // window.open(url.href, "_blank");

  event('see_lab_result', {
    nhc: nhc.value,
    uuid: split[3]
  });

  await router.push({
    name: "medic-lab-result-view",
    params: {url: split[3], nhc: encryptedNHC.value},
    query: {prev: "resultados"}
  });
};
const goToLabResultCtrl = async (result) => {
  let split = result.deep_link.split("/");
  event('see_lab_result', {
    nhc: nhc.value,
    uuid: split[3]
  });

  let url = router.resolve({
    name: "medic-lab-result-view",
    params: {url: split[3], nhc: encryptedNHC.value},
    query: {prev: "resultados"}
  });
  window.open(url.href, "_blank");
  // await router.push({name: 'medic-lab-result-view', params: {url: split[3], nhc: nhc.value}});
};
const goToZero = async () => {
  // let url = router.resolve({
  //   name: "medic-patient-zerofootprint-view",
  //   params: { nhc: nhc.value },
  //   query: { prev: "resultados" }
  // });
  // window.open(url.href, "_blank");
  await router.push({
    name: "medic-patient-zerofootprint-view",
    params: {nhc: nhc.value},
    query: {prev: "resultados"}
  });
};
const goToZeroCtrl = async () => {
  event('see_zerofootprint', {
    nhc: nhc.value
  });
  let url = router.resolve({
    name: "medic-patient-zerofootprint-view",
    params: {nhc: encryptedNHC.value},
    query: {prev: "resultados"}
  });
  window.open(url.href, "_blank");
  //await router.push({name: 'medic-patient-curva-view', params: {type, na, nhc: nhc.value}});
};
const goToZeroCtrlItem = async (item) => {
  event('see_zerofootprint', {
    nhc: nhc.value,
    id: item.ID_ESTUDIO
  });
  const encryptedId = encryptId(item.ID_ESTUDIO);
  let url = router.resolve({
    name: "medic-patient-zerofootprint-item-view",
    params: {id: encryptedId },
    query: {prev: "resultados"}
  });
  window.open(url.href, "_blank");
  //await router.push({name: 'medic-patient-curva-view', params: {type, na, nhc: nhc.value}});
};
const goToImageResult = async (result) => {
  let split = result.deep_link.split("/");
  event('see_image_result', {
    nhc: nhc.value,
    uuid: split[3]
  });
  // let url = router.resolve({
  //   name: "medic-image-result-view",
  //   params: { url: split[3], nhc: nhc.value },
  //   query: { prev: "resultados" }
  // });
  // window.open(url.href, "_blank");

  await router.push({
    name: "medic-image-result-view",
    params: {url: split[3], nhc: encryptedNHC.value },
    query: {prev: "resultados"}
  });
};
const goToImageResultCtrl = async (result) => {
  let split = result.deep_link.split("/");
  event('see_image_result', {
    nhc: nhc.value,
    uuid: split[3]
  });

  let url = router.resolve({
    name: "medic-image-result-view",
    params: {url: split[3], nhc: encryptedNHC.value},
    query: {prev: "resultados"}
  });
  window.open(url.href, "_blank");
  // await router.push({
  //   name: "medic-image-result-view",
  //   params: { url: split[3], nhc: nhc.value },
  //   query: { prev: "resultados" }
  // });
};

const downloadImageFile = (imageResult) => {
  if (imageResult.urlPdf) {
    notify({
      title: "Listo",
      text: "Se procederá con la descarga en unos segundos",
      type: "info"
    });
    urlDocumento(imageResult.urlPdf).then(async (response) => {
      if (response.status) {
        const link = document.createElement("a");
        link.setAttribute("href", response.url);
        link.setAttribute("target", "_blank");
        const d = new Date();
        link.setAttribute("download", `${imageResult.NHC}_${d.getTime()}.pdf`);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        notify({
          title: "Listo",
          text: "Resultado de imagen descargado",
          type: "success"
        });
        event('file_download', {
          value: 'imagen'
        });
      } else {
        notify({
          title: "El archivo no esta disponible",
          text: response.message,
          type: "error"
        });
      }
    });
  }
};
const downloadLabFile = (labResult) => {
  if (labResult.urlPdf) {
    notify({
      title: "Listo",
      text: "Se procederá con la descarga en unos segundos",
      type: "info"
    });
    urlDocumento(labResult.urlPdf).then(async (response) => {
      if (response.status) {
        const link = document.createElement("a");
        link.setAttribute("href", response.url);
        link.setAttribute("target", "_blank");
        link.setAttribute("download", `${labResult.ID_STUDIO}.pdf`);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        notify({
          title: "Listo",
          text: "Resultado de imagen descargado",
          type: "success"
        });
        event('file_download', {
          value: 'laboratorio'
        });
      } else {
        notify({
          title: "El archivo no esta disponible",
          text: response.message,
          type: "error"
        });
      }
    });
  }
};

onMounted(async () => {
  if (nhc.value) {
    getPatientDetails(nhc.value);
    getLabResults(nhc.value);
    getImageResults(nhc.value);
  }
});

</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>{{title}}</title>
    </teleport>
    <div class="justify-content-center py-1" style="background-color: rgb(229 237 241);">
      <!--header section-->
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
                  <img class="img-header-icon ml-3" src="@/assets/resultados.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-1"
                    style="text-align:left; color: #05305d; font-weight: 600;">
                  Resultados de Imagen y Laboratorio<br>
                  {{ patient?.NOMBRES }} {{ patient?.APELLIDOS }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
      <div class="container m-auto d-block" style="background: #f8f9fc;">
        <!--        <div class="row mt-3 mb-3">-->
        <!--          <div class="d-block py-1">-->
        <!--            <div class="d-flex justify-content-end">-->
        <!--              <div class="img-div">-->
        <!--                <img class="img-header-icon ml-3" src="@/assets/resultados.png" alt=" icon">-->
        <!--              </div>-->
        <!--              <br>-->
        <!--              <h4 class="d-flex text-headerv2 mt-1"-->
        <!--                  style="text-align:left; color: #05305d; font-weight: 600;">-->
        <!--                Resultados de imagen y laboratorio<br>-->
        <!--                {{ patient?.NOMBRES }} {{ patient?.APELLIDOS }}-->
        <!--              </h4>-->
        <!--              <br>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="row my-2 pb-5 pt-2">
          <div class="col-sm-12 ">
            <ul class="nav nav-tabs" id="ResultsTab" role="tablist">
              <li class="nav-item tab-hm" role="presentation">
                <button class="nav-link nav-hm" id="lab-tab" data-toggle="tab"
                        :class="{'active': patientResultsStore.activeTab === 0}"
                        @click="patientResultsStore.activeTab = 0"
                        data-target="#lab" type="button" role="tab" aria-controls="lab"
                        aria-selected="true">Laboratorio <span class="bg-number">{{ lab_results.length }}</span>
                </button>
              </li>
              <li class="nav-item tab-hm" role="presentation">
                <button class="nav-link nav-hm" id="image-tab" data-toggle="tab"
                        :class="{'active': patientResultsStore.activeTab === 1}"
                        @click="patientResultsStore.activeTab = 1"
                        data-target="#image" type="button" role="tab" aria-controls="image"
                        aria-selected="false">Imagen <span class="bg-number">{{ image_results.length }}</span>
                </button>
              </li>

            </ul>
            <div class="tab-content" id="ResultsTabContent">
              <div class="tab-pane fade" id="lab" role="tabpanel"
                   :class="{'active': patientResultsStore.activeTab === 0, 'show': patientResultsStore.activeTab === 0}"
                   aria-labelledby="lab-tab">
                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-12 p-4">
                      <template v-if="isLoadingLab">
                        <div class="d-flex justify-content-center">
                          <img class="img-fluid" src="@/assets/loading.gif"
                               alt="Loading Hm">

                        </div>
                      </template>
                      <template v-else>
                        <template v-if="lab_results.length > 0">
                          <div
                              class=" my-1 py-2 row text-left border-result hover-list-element"
                              v-for="(labResult, labResultKey) in lab_results"
                              :key="labResultKey">
                            <div class="col-9">
                              <p class="title-results"><b>{{ labResult?.ORIGEN }}</b>
                                <span class="p-2 mx-2 pill" v-if="isWithin24Hours(labResult?.fecha_)"
                                      :class="{
                                  'gray':labResult?.IsOrderValidated === 'false' || !labResult?.IsOrderValidated || labResult?.IsOrderValidated === false,
                                   'orange':labResult?.IsOrderValidated === true || labResult?.IsOrderValidated === 'true'
                                }">
                                  {{ getWord(labResult?.IsOrderValidated) }}
                                </span>
                              </p>
                              <p class="text-results">{{ labResult?.FECHA }}</p>
                              <p class="text-results">
                                <b>Médico:</b> {{ labResult?.MEDICO }}
                              </p>
                              <div class="flex cursor-pointer" @click="labResult.isOpen = !labResult.isOpen">
                                <font-awesome-icon class="px-1"
                                                   :icon="['fas', 'list' ]"/>
                                Exámenes Solicitados
                                <font-awesome-icon class="px-2"
                                                   :icon="['fas', labResult.isOpen ?  'chevron-up':'chevron-down' ]"/>
                              </div>
                              <template v-if="labResult.isOpen">
                                <hr class="my-1">
                                <div class="row px-3 py-1">
                                  <ul class="col-12 col-md-6 m-0"
                                      v-for="(exam, key) in labResult.examenes" v-bind:key="key">
                                    <li class="m-0 small-font">{{ exam }}</li>
                                  </ul>
                                </div>
                              </template>
                              <p style="color: #ff8201;">Laboratorio</p>
                            </div>
                            <div class="col-3 d-flex flex-column flex-md-row justify-content-end">
                              <div class="cursor-pointer" title="Ver resultado"
                                   style="display: inline-block;"
                                   @click.exact="goToLabResult(labResult)"
                                   @click.ctrl="goToLabResultCtrl(labResult)">
                                <div class="p-2 p-md-4">
                                  <font-awesome-icon :icon="['fas', 'eye']" size="2x"
                                                     class="icon-device"/>
                                </div>

                              </div>
                              <div @click="downloadLabFile(labResult)"
                                   class="cursor-pointer"
                                   title="Descargar resultado">
                                <div class="p-2 p-md-4">
                                  <font-awesome-icon :icon="['fas', 'download']" size="2x"
                                                     class="icon-device"/>
                                </div>

                              </div>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <div class=" my-3 py-3  text-center">
                            <h4 class="center text-search">
                              No existen resultados de laboratorio disponibles para este paciente.
                            </h4>
                          </div>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="image" role="tabpanel"
                   :class="{'active': patientResultsStore.activeTab === 1, 'show': patientResultsStore.activeTab === 1}"
                   aria-labelledby="image-tab">
                <div class="container">

                  <div class="row justify-content-center">
                    <div class="col-12 p-4">
                      <template v-if="isLoadingImage">
                        <div class="d-flex justify-content-center">
                          <img class="img-fluid" src="@/assets/loading.gif"
                               alt="Loading Hm">

                        </div>
                      </template>
                      <template v-else>
                        <template v-if="patientResultsStore.seeImages">
                          <div class="flex" @click="patientResultsStore.seeImages = false;">
                            <div class="row mt-3">
                              <h5 class="cursor-pointer ml-3"
                                  style=" color: #0f4470; font-size: 16px;">
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                                Regresar
                              </h5>
                            </div>
                          </div>
                          <template v-if="image_results.length > 0">
                            <div
                                class=" my-1 py-2 row text-left border-result hover-list-element"
                                v-for="(imageResult, imageResultKey) in image_results"
                                :key="imageResultKey">
                              <div class="col-9">
                                <p class="title-results"><b>{{ imageResult?.ESTUDIO }}</b>
                                  <span class="p-2 mx-2 pill orange" v-if="isWithin24Hours(imageResult?.fecha_)">
                                    Nuevo</span>
                                </p>
                                <p class="text-results">{{ imageResult?.FECHA }}</p>
                                <p class="text-results">
                                  <b>Médico:</b> {{ imageResult?.MEDICO }}
                                </p>
                                <p class="text-results" style="color: #ff8201;">Imagen</p>
                              </div>
                              <div class="col-3 d-flex flex-column flex-md-row justify-content-end">
                                <div class="cursor-pointer" title="Ver imagen" style="display: inline-block;"
                                     @click.exact="goToZeroCtrlItem(imageResult)"
                                     @click.ctrl="goToZeroCtrlItem(imageResult)">
                                  <div class="p-2 p-md-4">
                                    <font-awesome-icon :icon="['fas', 'desktop']" size="2x"
                                                       class="icon-device"/>
                                  </div>
                                </div>
                                <div class="cursor-pointer" title="Ver informe"
                                     style="display: inline-block;"
                                     @click.exact="goToImageResult(imageResult)"
                                     @click.ctrl="goToImageResultCtrl(imageResult)">
                                  <div class="p-2 p-md-4">
                                    <font-awesome-icon :icon="['fas', 'eye']" size="2x"
                                                       class="icon-device"/>
                                  </div>
                                </div>
                                <div class="cursor-pointer" title="Descargar informe"
                                     v-if="imageResult.urlPdf"
                                     style="display: inline-block;"
                                     @click="downloadImageFile(imageResult)">
                                  <div class="p-2 p-md-4">
                                    <font-awesome-icon :icon="['fas', 'download']" size="2x"
                                                       class="icon-device"/>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            <div class=" my-3 py-3  text-center">
                              <h4 class="center text-search">
                                No existen resultados de imagen disponibles para este paciente.
                              </h4>
                            </div>
                          </template>
                        </template>
                        <template v-else>
                          <div @click.exact="goToZeroCtrl()" @click.ctrl="goToZeroCtrl()"
                               class=" my-1 p-4 row text-left border-result hover-list-element cursor-pointer">
                            <p class="title-results m-4"><b>Ver Exámenes (Zero FootPrint GE)</b>
                            </p>
                          </div>
                          <div @click="patientResultsStore.seeImages = true;"
                               class=" my-1 p-4 row cursor-pointer text-left border-result hover-list-element">
                            <p class="title-results m-4"><b>Ver Informes</b>
                            </p>
                          </div>
                        </template>

                      </template>


                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterMedico/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-link {
  padding: 0.5rem 1rem 0.4rem 0 !important;
}

.pill {
  border-radius: 15px;
  background-color: #ff8201;
  color: white;
  font-weight: 500
}

.select-result {
  height: 50px;
  border: 1px solid #e6eaee;
  box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
}

.cursor-pointer {
  cursor: pointer;
}

p.text-results {
  color: #6b6969;
  margin-bottom: 4px;
}

p.title-results {
  color: #05305d;
}

img.img-metrovirtual {
  width: 160px;
  height: 20px;
}

.text-icon-color {
  text-align: center;
  color: #05305d;
  font-weight: 600;
  line-height: 18px;
}

.border-result {
  border: 1px solid #e6eaee;
  box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
  border-radius: 6px;
  margin-top: 25px !important;
  background: white;
  padding-top: 15px !important;
  padding-left: 7px;
}

.row.d-block:hover {
  background: #0B72D8 !important;
}


.img-icon-color {
  width: 105px;
  height: 105px;
  margin: 0 auto;
  display: block;
  padding: 20px;
  margin-top: 1px;
}

.img-border {
  background: #E9EDF8;
  padding: 20px 5px;
  width: 145px;
  height: 145px;
  margin: 0px auto;
  border-radius: 100%;
  text-align: center;
  border: 2px solid white;
  box-shadow: -6px 4px 13px 3px #e4e5e7;
}

.nav-tabs .nav-link.active {
  color: #05305d !important;
  background-color: #f8f9fc;
  border-color: #f8f9fc;
  font-size: 18px;
  font-weight: 700;
  border-bottom: 3px solid #2392da !important;
}

.nav-tabs .nav-link {
  color: #818181 !important;
  background-color: #f8f9fc;
  border-color: #f8f9fc;
  font-size: 18px;
  font-weight: 700;
  border-radius: 2px;
}

h4.text-header {
  padding-left: 10%;
  margin-top: 14%;
}

h4.center.text-search {
  color: #818181 !important;
  font-weight: 500 !important;
  margin-top: 12%;
  padding-bottom: 8%;
}

.text-search span {
  color: #1d74d4;
  font-size: 1.8rem;
  font-weight: 600;
}

h3.title-search {
  color: #1d74d4;
}

input.search {
  height: 55px;
  width: 100%;
  border-radius: 20px;
  border: 2px solid #989899;
}

.icon-device {
  color: #05305d;
  cursor: pointer;
}


a:hover {
  text-decoration: none;
}

.img-border > img {
  position: absolute;
  top: calc(44% - 100px);
  left: 33%;
}

.img-border > img:last-of-type {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  -moz-transition: opacity 0.3s ease-in-out;
  -webkit-transition: opacity 0.3s ease-in-out;
}

/*
 * Hide the last image on hover
*/
.img-border:hover > img:last-of-type {
  opacity: 0;
}

.text-headerv2 {
  font-size: 16px;
}

.hover-list-element:hover {
  background-color: #edf6fb;
  box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
}

.small-font {
  font-size: small;
}
</style>
