<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import {useAuthStore} from "../stores/auth";
import {useMyPatientsStore} from "../stores/myPatients";
import {computed, ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import {event, screenview} from 'vue-gtag';
import {usePatientDetailStore} from "../stores/patientDetail";
import {encryptId} from "../services/security";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
// const type = computed(() => authStore.type);
const myPatientsStore = useMyPatientsStore();
const patientDetailStore = usePatientDetailStore();
const dealer_patients = computed(() => myPatientsStore.dealer_patients);
const total_dealer_patients = computed(() => myPatientsStore.total_dealer_patients);
const consulted_patients = computed(() => myPatientsStore.consulted_patients);
const total_consulted_patients = computed(() => myPatientsStore.total_consulted_patients);
const searchTerm = ref("");
let isLoadingDealers = ref(false);
let isLoadingConsulted = ref(false);
const router = useRouter();


const search = async () => {
  if (isLoadingDealers.value || isLoadingConsulted.value) return;
  isLoadingDealers.value = true;
  isLoadingConsulted.value = true;
  console.log('user', user.value);
  console.log('authStore', authStore.hasRole('PERFIL_MEDICO_RESIDENTES'));
  await myPatientsStore.searchPatients(0, 1000, searchTerm.value, authStore.hasRole('PERFIL_MEDICO_RESIDENTES'));
  isLoadingDealers.value = false;
  isLoadingConsulted.value = false;
};

const goBack = async () => {
  await myPatientsStore.clearPatients();
  if (window.history.state.back === null) {
    await router.replace({name: "dashboard"});
  } else {
    router.back();
  }
};


const goToPatientDetail = async (patient) => {
  try {
    patientDetailStore.clearPatient();
    // console.log('see_patient', {
    //   patient_name: patient.NOMBRE_PACIENTE,
    //   patient_nhc: patient.HC,
    //   user_name: user.value.name
    // });
    event('see_patient', {
      patient_name: patient.NOMBRE_PACIENTE,
      patient_nhc: patient.HC,
      user_name: user.value.name
    });
    let encryptedNHC = encryptId(patient.HC);
    router.push({name: "detalle-paciente", params: {nhc: encryptedNHC}}).catch((e) => console.log("e", e));
  } catch (e) {
    console.log("e", e);
  }
};

onMounted(async () => {
  screenview('Mis Pacientes');
  event('search_patients');
  if (dealer_patients.value.length < 1) {
    isLoadingDealers.value = true;
  }
  if (consulted_patients.value.length < 1) {
    isLoadingConsulted.value = true;
  }
  console.log('user', user.value);
  console.log('authStore', authStore.hasRole('PERFIL_MEDICO_RESIDENTES'));
  await myPatientsStore.getPatients(0, 1000, authStore.hasRole('PERFIL_MEDICO_RESIDENTES'));
  isLoadingDealers.value = false;
  isLoadingConsulted.value = false;
});

</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Mis Pacientes - MetroVirtual - Hospital Metropolitano</title>
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
                  <img class="img-header-icon ml-3 mx-1 pt-2 pt-md-0" src="@/assets/mis-pacientes.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-2"
                    style="
                            color: #05305d;
                            text-align:left;
                            font-weight: 600;">
                  Mis Pacientes
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
      <div class="container m-auto d-block " style="background: #f8f9fc;">
        <!--                <div class="row mt-3 mb-3">-->
        <!--                    <div class="d-flex justify-content-end">-->
        <!--                        <div class="img-div">-->
        <!--                            <img class="img-header-icon ml-3" src="@/assets/mis-pacientes.png" alt=" icon">-->
        <!--                        </div>-->
        <!--                        <br>-->
        <!--                        <h4 class="d-flex text-headerv2 mt-3"-->
        <!--                            style="-->
        <!--                            color: #05305d;-->
        <!--                            text-align:left;-->
        <!--                            font-weight: 600;">-->
        <!--                            Mis pacientes-->
        <!--                        </h4>-->
        <!--                    </div>-->
        <!--                </div>-->

        <div class="my-5">
          <div class="d-flex justify-content-center">
            <div class="col-9 col-md-7 col-lg-6 ">
              <input type="text" v-model="searchTerm"
                     class=" special form-control"
                     required
                     placeholder="Busca por apellidos y nombres"
                     @keyup.enter="search()"
                     @input="searchTerm = $event.target.value.toUpperCase()">
            </div>
            <div class="col-3 col-md-5 col-lg-2 ">
              <button class="text-center cursor-pointer pt-2 btn-loginv2"
                      @click="search()">
                Buscar
              </button>
            </div>
          </div>
        </div>
        <div class="row my-2 pb-5 pt-2">
          <div class="col-sm-12 mt-3">
            <div class="row">
              <div class="col-10">
                <ul class="nav nav-tabs" id="ResultsTab" role="tablist">
                  <li class="nav-item tab-hm" role="presentation">
                    <button class="nav-link nav-hm pl-0" id="lab-tab" data-toggle="tab"
                            :class="{'active': myPatientsStore.activeTab === 0}" @click="myPatientsStore.activeTab = 0"
                            data-target="#lab" type="button" role="tab" aria-controls="lab"
                            aria-selected="true">{{
                        authStore.hasRole("PERFIL_MEDICO_RESIDENTES") ? "Emergencia" : "Tratante"
                      }} <span class="bg-number">{{ total_dealer_patients }}</span>
                    </button>
                  </li>
                  <li class="nav-item tab-hm" role="presentation">
                    <button class="nav-link nav-hm pl-0" id="image-tab" data-toggle="tab"
                            :class="{'active': myPatientsStore.activeTab === 1}" @click="myPatientsStore.activeTab = 1"
                            data-target="#image" type="button" role="tab" aria-controls="image"
                            aria-selected="false">
                      {{ authStore.hasRole("PERFIL_MEDICO_RESIDENTES") ? "Hospitalización" : "Interconsultado" }}
                      <span class="bg-number">{{ total_consulted_patients }}</span>
                    </button>
                  </li>

                </ul>
              </div>
              <div class="col-2 d-flex justify-content-end">
                <h5 class="cursor-pointer p-3" style=" color: #0f4470; font-size: 16px;" @click="search()">
                  <font-awesome-icon :icon="['fas', 'refresh']" class="mx-1"/>
                  <p class="m-0 d-none d-md-inline-block">Actualizar</p>
                </h5>
              </div>
            </div>

            <div class="tab-content" id="ResultsTabContent">
              <div class="tab-pane fade" id="lab" role="tabpanel"
                   :class="{'active': myPatientsStore.activeTab === 0, 'show': myPatientsStore.activeTab === 0}"
                   aria-labelledby="lab-tab">
                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-12">
                      <template v-if="isLoadingDealers">
                        <div class="d-flex justify-content-center">
                          <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
                        </div>
                      </template>
                      <template v-else>
                        <template v-if="dealer_patients.length > 0">
                          <template
                              v-for="(dealerPatient, dealerPatientKey) in dealer_patients"
                              :key="dealerPatientKey">
                            <div @click="goToPatientDetail(dealerPatient)"
                                 title="Ver Paciente"
                                 class=" my-1 py-2 row cursor-pointer text-left border-result hover-list-element">
                              <div class="col-10">
                                <p class="title-pacientes">
                                  <b>{{ dealerPatient?.NOMBRE_PACIENTE }}</b>
                                </p>
                                <p class="text-pacientes">
                                  <b>Especialidad:</b> {{
                                    dealerPatient?.ESPECIALIDAD ? dealerPatient?.ESPECIALIDAD : "No registrado"
                                  }}
                                  <b>Médico:</b>
                                  {{ dealerPatient?.NOMBRE_MEDICO ? dealerPatient?.NOMBRE_MEDICO : "No registrado" }}
                                </p>
                                <p class="text-pacientes">
                                  <b>Diagnóstico:</b>
                                  {{ dealerPatient?.DG_PRINCIPAL ? dealerPatient?.DG_PRINCIPAL : "No registrado" }}
                                </p>
                                <p class="text-pacientes">
                                  <b>Fecha de Atención:</b>
                                  {{
                                    dealerPatient?.FECHA_ADMISION ? dealerPatient?.FECHA_ADMISION + " " + dealerPatient?.HORA_ADMISION : "No registrado"
                                  }}
                                </p>
                                <p class="text-pacientes">
                                  <b>Edad:</b> {{
                                    dealerPatient?.EDAD ? dealerPatient?.EDAD + ' Años' : "No registrado"
                                  }}
                                  <b>Habitación:</b> {{
                                    dealerPatient?.NRO_HABITACION ? dealerPatient?.NRO_HABITACION : "No registrado"
                                  }}
                                </p>
                              </div>
                              <div class="col-2 d-flex row justify-content-end">
                                <div class="p-0 p-md-4 my-0 my-md-4">
                                  <font-awesome-icon :icon="['fas', 'eye']" :size="'2x'"
                                                     class="icon-device"/>
                                </div>
                              </div>
                            </div>
                          </template>
                        </template>
                        <template v-else>
                          <div class=" my-3 py-3  text-center">
                            <h4 class="center text-search">
                              <template v-if="searchTerm === ''">
                                No tienes pacientes
                                {{ authStore.hasRole("PERFIL_MEDICO_RESIDENTES") ? "en emergencia" : "tratantes" }}
                              </template>
                              <template v-else>
                                No hay resultados para el criterio de busqueda
                              </template>

                            </h4>
                          </div>
                        </template>
                      </template>

                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="image" role="tabpanel"
                   :class="{'active': myPatientsStore.activeTab === 1, 'show': myPatientsStore.activeTab === 1}"
                   aria-labelledby="image-tab">
                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-12">
                      <template v-if="isLoadingConsulted">
                        <div class="d-flex justify-content-center">
                          <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
                        </div>
                      </template>
                      <template v-else>
                        <template v-if="consulted_patients.length > 0">
                          <template
                              v-for="(consultedPatient, consultedPatientKey) in consulted_patients"
                              :key="consultedPatientKey">
                            <div @click="goToPatientDetail(consultedPatient)"
                                 title="Ver Paciente"
                                 class=" my-1 py-2 row cursor-pointer text-left border-result hover-list-element">
                              <div class="col-10">
                                <p class="title-pacientes">
                                  <b>{{ consultedPatient?.NOMBRE_PACIENTE }}</b>
                                </p>
                                <p class="text-pacientes">
                                  <b>Especialidad:</b> {{
                                    consultedPatient?.ESPECIALIDAD
                                  }}
                                  <b>Médico:</b> {{ consultedPatient?.NOMBRE_MEDICO }}
                                </p>
                                <p class="text-pacientes">
                                  <b>Diagnóstico:</b>
                                  {{ consultedPatient?.DG_PRINCIPAL }}
                                </p>
                                <p class="text-pacientes">
                                  <b>Fecha de Atención:</b>
                                  {{ consultedPatient?.FECHA_ADMISION }} {{ consultedPatient?.HORA_ADMISION }}
                                </p>
                                <p class="text-pacientes">
                                  <b>Edad:</b> {{ consultedPatient?.EDAD }} Años
                                  <b>Habitación:</b> {{
                                    consultedPatient?.NRO_HABITACION
                                  }}
                                </p>
                              </div>
                              <div class="col-2 d-flex row justify-content-end">
                                <div class="p-0 p-md-4 my-0 my-md-4">
                                  <font-awesome-icon :icon="['fas', 'eye']" :size="'2x'"
                                                     class="icon-device"/>
                                </div>
                              </div>
                            </div>
                          </template>

                        </template>
                        <template v-else>
                          <div class=" my-3 py-3  text-center">
                            <h4 class="center text-search">
                              <template v-if="searchTerm === ''">
                                No tienes pacientes {{
                                  authStore.hasRole("PERFIL_MEDICO_RESIDENTES") ? "en hospitalización" : "interconsultados"
                                }}
                              </template>
                              <template v-else>
                                No hay resultados para el criterio de busqueda
                              </template>

                            </h4>
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
@media screen and (max-width: 600px) {
  .nav-tabs {
    overflow-x: auto;
    overflow-y: hidden;
    flex-wrap: nowrap !important;
  }

  .nav-tabs li {
    white-space: nowrap;
  }

  li.nav-item.tab-hm button {
    font-size: 16px;
  }

  .nav-tabs .nav-link.active {
    font-size: 16px;
  }
}
</style>
