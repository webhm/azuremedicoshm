<script setup>
import FooterMedico from "../components/FooterMedico.vue";
//import {useAuthStore} from "../stores/auth";
import { usePatientsListStore } from "../stores/patientsList";
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {event, screenview} from "vue-gtag";
import {usePatientResultsStore} from "../stores/patientResults";
import {encryptId} from "../services/security";

//const authStore = useAuthStore();
// const user = computed(() => authStore.user);
// const type = computed(() => authStore.type);
const patientsListStore = usePatientsListStore();
const patient_list = computed(() => patientsListStore.patient_list);
const search_type = computed(() => patientsListStore.search_type);
const patientResultsStore = usePatientResultsStore();
const searchTerm = ref("");
const searchType = ref("pte");
let isLoading = ref(false);
//const route = useRoute();
const router = useRouter();

const search = async () => {
  isLoading.value = true;
  console.log("searchTerm", searchTerm.value);
  await patientsListStore.getPatients(searchTerm.value, searchType.value);
  isLoading.value = false;
};

const goBack = () => {
  patientsListStore.clearPatients();
  if (window.history.state.back === null) {
    router.replace({ name: "dashboard" });
  } else {
    router.back();
  }
};

const goToPatientResults = async (patient) => {
  patientResultsStore.clearPatientResults();

  event('view_patient_results', {
    patient: `${patient.APELLIDOS} ${patient.NOMBRES}`
  });
  let encryptedNHC = encryptId(patient.PK_NHCL);
  await router.push({ name: "resultados-paciente-imagen-y-laboratorio-medicos", params: { nhc: encryptedNHC } });
};

const goToPatientResultsCtrl = async (patient) => {
  patientResultsStore.clearPatientResults();

  event('view_patient_results', {
    patient: `${patient.APELLIDOS} ${patient.NOMBRES}`
  });
  let encryptedNHC = encryptId(patient.PK_NHCL);
  let url = router.resolve({
    name: "resultados-paciente-imagen-y-laboratorio-medicos",
    params: { nhc: encryptedNHC }
  });
  window.open(url.href, "_blank");
  // await router.push({name: 'medic-lab-result-view', params: {url: split[3], nhc: nhc.value}});
};


onMounted(() => {
  patientResultsStore.clearPatientResults();
  screenview('Búsqueda de Resultados de Imagen y Laboratorio');
  event('view_search_results');
  searchType.value = search_type.value;
});


</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Búsqueda de Resultados - MetroVirtual - Hospital Metropolitano</title>
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
                  <img class="img-header-icon ml-3 mt-2" src="@/assets/resultados.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-1"
                    style="text-align:left; color: #05305d; font-weight: 600;">
                  Búsqueda de <br>
                  Resultados de Imagen <br>
                  y Laboratorio
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
      <div class="container m-auto d-block" style="background: #f8f9fc;">
        <!--                <div class="row mt-3 mb-3">-->
        <!--                    <div class="d-block py-1">-->
        <!--                        <div class="d-flex justify-content-end">-->
        <!--                            <div class="img-div">-->
        <!--                                <img class="img-header-icon ml-3" src="@/assets/resultados.png" alt=" icon">-->
        <!--                            </div>-->
        <!--                            <br>-->
        <!--                            <h4 class="d-flex text-headerv2 mt-1"-->
        <!--                                style="text-align:left; color: #05305d; font-weight: 600;">-->
        <!--                                Resultados de imagen <br>-->
        <!--                                y laboratorio-->
        <!--                            </h4>-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!--                </div>-->
        <div class="row justify-content-center mt-3">
          <div class="col-12 col-md-4 col-lg-3 ">
            <label class="text-label my-1">Puedes buscar por:</label>
            <select class="form-control bg-white select-result form-select" style="border-radius: 50px"
                    v-model="searchType">
              <option :value="'pte'">Apellidos y nombres</option>
              <option :value="'cc'">Cédula</option>
              <option :value="'nhc'">Historia Clínica</option>
            </select>
          </div>
          <div class="my-3 col-12 col-md-8 col-lg-8">
            <div class=" d-flex justify-content-center">
              <div class="col-9 col-md-9 mt-3  ">
                <input type="text" v-model="searchTerm"
                       class="special form-control"
                       required
                       placeholder="Busca tus pacientes"
                       @keyup.enter="search()"
                       @input="searchTerm = $event.target.value.toUpperCase()">
              </div>
              <div class="col-3 col-md-3 mt-3  ">
                <button class="text-center cursor-pointer pt-2 btn-loginv2"
                        @click="search()">
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="row my-2 pb-5 pt-2">
          <div class="col-sm-12 ">
            <template v-if="isLoading">
              <div class="my-1 p-3 text-center">
                <img class="img-fluid" src="@/assets/loading.gif"
                     alt="Loading Hm">
              </div>
            </template>
            <template v-else>
              <template v-if="patient_list.length > 0">
                <template v-for="(patient, patientKey) in patient_list"
                          :key="patientKey">
                  <div class=" m-1 p-2 row text-left border-result hover-list-element cursor-pointer"
                       @click.exact="goToPatientResults(patient)" @click.ctrl="goToPatientResultsCtrl(patient)"
                       :title="`Ver resultados del paciente ${ patient?.APELLIDOS} ${ patient?.NOMBRES}`">
                    <div class="col-9 my-3">
                      <p class="title-results ">
                        <b>{{ patient?.APELLIDOS }} {{ patient?.NOMBRES }}</b>
                      </p>
                      <p class="text-results">NHC: {{ patient?.PK_NHCL }}</p>
                    </div>
                    <div class="col-3 d-flex justify-content-end">
                      <div class="cursor-pointer">
                        <div class="p-0 p-md-4">
                          <font-awesome-icon :icon="['fas', 'eye']" size="2x" class="icon-device" />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
              <template v-else>
                <div class=" my-1 p-3  text-center">
                  <h4 class="center text-search">
                    No se encontraron pacientes
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
