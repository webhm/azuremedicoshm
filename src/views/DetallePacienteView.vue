<script setup>
import FooterMedico from "../components/FooterMedico.vue";
//import {useAuthStore} from "../stores/auth";
import talla from "@/assets/talla.png";
import temperatura from "@/assets/temperatura.png";
import endoscopia from "@/assets/endoscopia.png";
import frecuencia from "@/assets/frecuencia.png";
import llenadoCapilar from "@/assets/llenado-capilar.png";
import corazon from "@/assets/corazon.png";
import tallaBlanco from "@/assets/talla-blanco.png";
import temperaturaBlanco from "@/assets/temperatura-blanco.png";
import endoscopiaBlanco from "@/assets/endoscopia-blanco.png";
import frecuenciaBlanco from "@/assets/frecuencia-blanco.png";
import llenadoCapilarBlanco from "@/assets/llenado-capilar-blanco.png";
import glicemiaBlanco from "@/assets/glicemia-blanco.png";
import glicemia from "@/assets/glicemia.png";
import corazonBlanco from "@/assets/corazon-blanco.png";
import {ref, onMounted, computed} from "vue";
import { useRouter, useRoute } from "vue-router";
import dayjs from "dayjs";
import {
  statusPacienteEmergencia,
  svPacienteEmergencia,
  evPacienteEmergencia,
  resultadosLaboratorioPaciente,
  resultadosImagenPaciente,
  formularioPaciente,
  urlDocumento
} from "../services/patient";

import { useNotification } from "@kyvg/vue3-notification";
import Form005Viewer from "../components/Form005Viewer.vue";
import { usePatientDetailStore } from "../stores/patientDetail";
import {decryptId, encryptId} from "../services/security";
import {event, screenview} from 'vue-gtag';

const { notify } = useNotification();

//const authStore = useAuthStore();
// const user = computed(() => authStore.user);
// const type = computed(() => authStore.type);
const patientDetailStore = usePatientDetailStore();
const statusPaciente = computed(() => patientDetailStore.statusPaciente);
const svPaciente = computed(() => patientDetailStore.svPaciente);
const seeImages = computed(() => patientDetailStore.seeImages);
const evPaciente = computed(() => patientDetailStore.evPaciente);
const formsPaciente = computed(() => patientDetailStore.formsPaciente);
const lab_results = computed(() => patientDetailStore.lab_results);
const image_results = computed(() => patientDetailStore.image_results);
const props = defineProps(["nhc"]);
const encryptedNHC = ref(props.nhc);
const nhc = ref(decryptId(encryptedNHC.value));

const isLoading = ref(false);
const isLoadingSV = ref(false);
const isLoadingForms = ref(false);
const isLoadingLab = ref(false);
const isLoadingImage = ref(false);
const title = ref("Detalle del Paciente - MetroVirtual - Hospital Metropolitano");
const route = useRoute();
const router = useRouter();


const getPatientDetails = (nhc) => {
  try {

    if(statusPaciente.value === null){
      isLoading.value = true;
    }

    // get patient status
    statusPacienteEmergencia(nhc).then((response) => {
      if (response.status) {
        patientDetailStore.statusPaciente = response.data;
        console.log("statusPaciente.value", statusPaciente.value);
        title.value = `Paciente ${statusPaciente.value.NOMBRE_PACIENTE} - MetroVirtual - Hospital Metropolitano`;
        screenview(`Detalle del Paciente ${statusPaciente.value.NOMBRE_PACIENTE}`);
      } else {
        notify({
          title: "No existen datos registrados para este paciente",
          text: response.message,
          type: "error"
        });
      }
      isLoading.value = false;
    }).catch((e) => {
      console.log("error", e);
      notify({
        title: "Hubo un problema al cargar los datos para este paciente",
        text: e,
        type: "error"
      });
      isLoading.value = false;
    });

  } catch (e) {
    console.log("error", e);
    notify({
      title: "Hubo un problema al cargar los datos para este paciente",
      text: e,
      type: "error"
    });
    isLoading.value = false;
  }
};
const getPatientSV = (nhc) => {
  try {
    console.log('svPaciente.value', svPaciente.value);
    console.log('svPaciente.value', svPaciente.value.length < 1);
    if(svPaciente.value.length < 1){
      isLoadingSV.value = true;
    }
    console.log('isLoadingSV.value', isLoadingSV.value);

    // get patient sv
    svPacienteEmergencia(nhc).then((response) => {
      if (response.status) {
        const items = response.data;
        const order = [
          "PRESION ARTERIAL SISTOLICA",
          "PRESION ARTERIAL DIASTOLICA",
          "FRECUENCIA CARDIACA",
          "FRECUENCIA RESPIRATORIA",
          "SATURACION OXIGENO",
          "TEMPERATURA",
          "LLENADO CAPILAR",
          "GLICEMIA CAPILAR",
          "TALLA"
        ];

        // const gc = items.find((item) => item.SIGNO === "LLENADO CAPILAR");
        // if (gc) {
        //   items.push({ ...gc, SIGNO: "GLICEMIA CAPILAR" });
        // }
        items.sort((a, b) => {
          let indexA = order.indexOf(a.SIGNO);
          let indexB = order.indexOf(b.SIGNO);
          return indexA - indexB;
        });

        // const pas = items.find((item) => item.SIGNO === "PRESION ARTERIAL SISTOLICA");
        // if (pas) {
        //   final.push(pas);
        // }
        // const pad = items.find((item) => item.SIGNO === "PRESION ARTERIAL DIASTOLICA");
        // if (pad) {
        //   final.push(pad);
        // }
        // const fc = items.find((item) => item.SIGNO === "FRECUENCIA CARDIACA");
        // if (fc) {
        //   final.push(fc);
        // }
        // const fr = items.find((item) => item.SIGNO === "FRECUENCIA RESPIRATORIA");
        // if (fr) {
        //   final.push(fr);
        // }
        // const so = items.find((item) => item.SIGNO === "SATURACION OXIGENO");
        // if (so) {
        //   final.push(so);
        // }
        // const temp = items.find((item) => item.SIGNO === "TEMPERATURA");
        // if (temp) {
        //   final.push(temp);
        // }
        // const llc = items.find((item) => item.SIGNO === "LLENADO CAPILAR");
        // if (llc) {
        //   final.push(llc);
        // }
        // const gc = items.find((item) => item.SIGNO === "GLICEMIA CAPILAR");
        // if (gc) {
        //   final.push(gc);
        //   final.push({ ...gc, SIGNO: 'GLICEMIA CAPILAR' });
        // }
        // const talla = items.find((item) => item.SIGNO === "TALLA");
        // if (talla) {
        //   final.push(talla);
        // }
        patientDetailStore.svPaciente = items;
        console.log("svPaciente.value", svPaciente.value);
      } else {
        patientDetailStore.svPaciente = [];
        notify({
          title: "¡Atención!",
          text: "No existen registros de signos vitales para este paciente",
          type: "info"
        });
      }
      isLoadingSV.value = false;
    }).catch((e) => {
      console.log("error", e);
      notify({
        title: "Hubo un problema al cargar los datos del paciente",
        text: e,
        type: "error"
      });
      isLoadingSV.value = false;
    });

  } catch (e) {
    console.log("error", e);
    notify({
      title: "Hubo un problema al cargar los datos del paciente",
      text: e,
      type: "error"
    });
    isLoadingSV.value = false;
  }
};
const getPatientEV = async (nhc) => {
  try {
    if(evPaciente.value.length < 1){
      isLoadingForms.value = true;
    }

    // get patient ev
    const evPacienteResponse = await evPacienteEmergencia(nhc);
    if (evPacienteResponse.status) {
      patientDetailStore.evPaciente = evPacienteResponse.data;
      // console.log(" evPaciente.value", evPaciente.value);
      // console.log(" evPaciente.value", evPaciente.value[0]);
      // get patient forms
      patientDetailStore.formsPaciente = await formularioPaciente(evPaciente.value[0].NHCL, evPaciente.value[0].ADM);
      console.log("formsPaciente.value", formsPaciente.value);

    } else {
      notify({
        title: "¡Atención!",
        text: "No existen registros de evoluciones-prescripciones para este paciente",
        type: "info"
      });
    }
    isLoadingForms.value = false;
  } catch (e) {
    console.log("error", e);
    notify({
      title: "Hubo un problema al cargar los registros de evoluciones-prescripciones",
      text: e,
      type: "error"
    });
    isLoadingForms.value = false;
  }
};
const getLabResults = (nhc) => {
  // get patient lab results
  if(patientDetailStore.lab_results.length < 1){
    isLoadingLab.value = true;
  }

  resultadosLaboratorioPaciente(nhc).then((response) => {
    if (response.status) {
      patientDetailStore.lab_results = response.data;
    } else {
      patientDetailStore.lab_results = [];
      notify({
        title: "¡Atención!",
        text: "No existen resultados de laboratorio disponibles para este paciente",
        type: "info"
      });
    }
    isLoadingLab.value = false;
  });
};
const getImageResults = (nhc) => {
  // get patient lab results
  if(image_results.value.length < 1){
    isLoadingImage.value = true;
  }

  resultadosImagenPaciente(nhc).then((response) => {
    isLoadingImage.value = false;
    if (response.status) {
      // image_results.value = response.data.map((image_result) => {
      //   let newIr = image_result;
      //   newIr.fecha_ = `${image_result.FECHA.substring(6, 10)}-${image_result.FECHA.substring(3, 5)}-${image_result.FECHA.substring(0, 2)}`;
      //   return newIr;
      // })
      patientDetailStore.image_results = response.data;
    } else {
      patientDetailStore.image_results = [];
      notify({
        title: "¡Atención!",
        text: "No existen resultados de imagen disponibles para este paciente",
        type: "info"
      });
    }
  });
};

const getWhiteImage = (item) => {

  switch (item.SIGNO) {
    case "TALLA":
      return tallaBlanco;
    case "TEMPERATURA":
      return temperaturaBlanco;
    case "SATURACION OXIGENO":
      return endoscopiaBlanco;
    case "FRECUENCIA RESPIRATORIA":
      return frecuenciaBlanco;
    case "LLENADO CAPILAR":
      return llenadoCapilarBlanco;
    case "GLICEMIA CAPILAR":
      return glicemiaBlanco;
    case "PRESION ARTERIAL DIASTOLICA":
    case "PRESION ARTERIAL SISTOLICA":
    case "FRECUENCIA CARDIACA":
    default:
      return corazonBlanco;
  }
};
const getImage = (item) => {
  switch (item.SIGNO) {
    case "TALLA":
      return talla;
    case "TEMPERATURA":
      return temperatura;
    case "SATURACION OXIGENO":
      return endoscopia;
    case "FRECUENCIA RESPIRATORIA":
      return frecuencia;
    case "LLENADO CAPILAR":
      return llenadoCapilar;
    case "GLICEMIA CAPILAR":
      return glicemia;
    case "PRESION ARTERIAL SISTOLICA":
    case "PRESION ARTERIAL DIASTOLICA":
    case "FRECUENCIA CARDIACA":
    default:
      return corazon;
  }
};
const getUnit = (item) => {
  switch (item.SIGNO) {
    case "TALLA":
      return "cm";
    case "TEMPERATURA":
      return "°C";
    case "SATURACION OXIGENO":
      return "%";
    case "FRECUENCIA RESPIRATORIA":
      return "RPM";
    case "FRECUENCIA CARDIACA":
      return "LPM";
    case "PRESION ARTERIAL SISTOLICA":
    case "PRESION ARTERIAL DIASTOLICA":
      return "mmHg";
    case "LLENADO CAPILAR":
      return "seg.";
    case "GLICEMIA CAPILAR":
      return "mg/dl";
    default:
      return "";
  }
};
const isWithin24Hours = (date) => {
  const dateForm = dayjs(date);
  const now = dayjs(); // Obtiene la fecha y hora actual
  const yesterday = now.subtract(24, "hour"); // Resta 24 horas a la fecha y hora actual
  return dateForm.isAfter(yesterday) && dateForm.isBefore(now); // Compara la fecha deseada con la fecha y hora actual y la fecha y hora de hace 24 horas
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
const goBack = () => {
  patientDetailStore.clearPatient();
  if (window.history.state.back === null) {
    router.replace({ name: "mis-pacientes" });
  } else {
    router.back();
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
const downloadImageFile = (imageResult) => {
  if (imageResult.urlPdf) {
    notify({
      title: "Listo",
      text: "Se procederá con la descarga en unos segundos",
      type: "warn"
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

const goToLabResult = async (result) => {
  let split = result.deep_link.split("/");
  // let url = router.resolve({
  //   name: "medic-patient-lab-result-view",
  //   params: { url: split[3], nhc: nhc.value },
  //   query: { prev: "detalle-paciente" }
  // });
  // window.open(url.href, "_blank");
  event('see_lab_result', {
    nhc: nhc.value,
    uuid: split[3]
  });
  await router.push({
    name: "medic-patient-lab-result-view",
    params: { url: split[3], nhc: encryptedNHC.value },
    query: { prev: "detalle-paciente" }
  });
};
const goToLabResultCtrl = async (result) => {
  let split = result.deep_link.split("/");
  event('see_lab_result', {
    nhc: nhc.value,
    uuid: split[3]
  });
  let url = router.resolve({
    name: "medic-patient-lab-result-view",
    params: { url: split[3], nhc: encryptedNHC.value },
    query: { prev: "detalle-paciente" }
  });
  window.open(url.href, "_blank");
  // await router.push({
  //   name: "medic-patient-lab-result-view",
  //   params: { url: split[3], nhc: nhc.value },
  //   query: { prev: "detalle-paciente" }
  // });
};
const goToGraphic = async (type, item) => {
  // let url = router.resolve({
  //   name: "medic-patient-curva-view",
  //   params: { type, na, nhc: nhc.value },
  //   query: { prev: "detalle-paciente" }
  // });
  // window.open(url.href, "_blank");
  console.log('see_graph', {
    value: item.SIGNO,
  });
  event('see_graph', {
    value: item.SIGNO,
  });
  const encryptedAttention = encryptId(item.ATENCION);
  await router.push({
    name: "medic-patient-curva-view",
    params: { type, na: encryptedAttention, nhc: encryptedNHC.value }
  });
};
const goToGraphicCtrl = async (type, item) => {
  console.log('see_graph', {
    value: item.SIGNO,
  });
  event('see_graph', {
    value: item.SIGNO,
  });
  const encryptedAttention = encryptId(item.ATENCION);
  let url = router.resolve({
    name: "medic-patient-curva-view",
    params: { type, na: encryptedAttention, nhc: encryptedNHC.value }
  });
  window.open(url.href, "_blank");
  //await router.push({name: 'medic-patient-curva-view', params: {type, na, nhc: nhc.value}});
};
const goToZero = async () => {
  // let url = router.resolve({
  //   name: "medic-patient-zerofootprint-view",
  //   params: { nhc: nhc.value },
  //   query: { prev: "detalle-paciente" }
  // });
  //window.open(url.href, "_blank");
  await router.push({
    name: "medic-patient-zerofootprint-view",
    params: { nhc: nhc.value },
    query: { prev: "detalle-paciente" }
  });
};
const goToZeroCtrl = async () => {
  event('see_zerofootprint', {
    nhc: nhc.value
  });

  let url = router.resolve({
    name: "medic-patient-zerofootprint-view",
    params: { nhc: encryptedNHC.value },
    query: { prev: "detalle-paciente" }
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
    params: { id: encryptedId },
    query: { prev: "detalle-paciente" }
  });
  window.open(url.href, "_blank");
  //await router.push({name: 'medic-patient-curva-view', params: {type, na, nhc: nhc.value}});
};


const goToImageResult = async (result) => {
  let split = result.deep_link.split("/");
  // let url = router.resolve({
  //   name: "medic-patient-image-result-view",
  //   params: { url: split[3], nhc: nhc.value },
  //   query: { prev: "detalle-paciente" }
  // });
  // window.open(url.href, "_blank");
  event('see_image_result', {
    nhc: nhc.value,
    uuid: split[3]
  });
  await router.push({
    name: "medic-patient-image-result-view",
    params: { url: split[3], nhc: encryptedNHC.value },
    query: { prev: "detalle-paciente" }
  });
};
const goToImageResultCtrl = async (result) => {
  let split = result.deep_link.split("/");
  event('see_image_result', {
    nhc: nhc.value,
    uuid: split[3]
  });
  let url = router.resolve({
    name: "medic-patient-image-result-view",
    params: { url: split[3], nhc: encryptedNHC.value },
    query: { prev: "detalle-paciente" }
  });
  window.open(url.href, "_blank");
  // await router.push({name: 'medic-patient-image-result-view', params: {url: split[3], nhc: nhc.value}});
};

onMounted(async () => {
  console.log('nhc', nhc.value);
  if (nhc.value) {
    getPatientDetails(nhc.value);
    getPatientSV(nhc.value);
    getLabResults(nhc.value);
    getImageResults(nhc.value);
    await getPatientEV(nhc.value);
  } else {
    await router.replace({ name: "mis-pacientes" });
  }
});


// const items = computed(() => searchStore.items);
// const itemsCount = computed(() => searchStore.itemsCount);

</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>{{title}}</title>
    </teleport>
    <div class="justify-content-center py-1" style="background-color: rgb(229 237 241);">

      <div class="container m-auto d-block">
        <div class="row my-1 justify-content-center">
          <!--columna de text-->
          <div class=" col-6 " @click="goBack()">
            <div class="row mt-2">
              <h5 class="cursor-pointer ml-3" style=" color: #0f4470; font-size: 16px;">
                <font-awesome-icon :icon="['fas', 'chevron-left']" />
                Regresar
              </h5>
            </div>
          </div>
          <div class="col-6">
            <div class="d-block py-1">
              <div class="d-flex justify-content-end">
                <div class="img-div ">
                  <img class="img-header-icon mx-1 ml-3"
                       src="@/assets/mis-pacientes.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-2"
                    style="
                            color: #05305d;
                            text-align:left;
                            font-weight: 600;">
                  Detalle del Paciente
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
      <div class="container m-auto d-block " style="background: #f8f9fc;">
        <div class="row mt-3">
          <div class="d-block py-1">
            <div class=" d-flex justify-content-start">
              <div class="img-div">
                <img class="img-header-icon ml-3" src="@/assets/mis-pacientes.png" alt=" icon">
              </div>
              <br>
              <h4 class="d-flex text-headerv2 text-name-paciente mt-3" style="text-align:left; color: #05305d;
                                    font-weight: 600;">
                {{ statusPaciente?.NOMBRE_PACIENTE }}
              </h4>
            </div>
            <div class="row my-2 dates-pacientes">
              <div class="col-12 col-md-5">
                <p class="descrip-paciente">
                  <b>NHC: </b>{{ statusPaciente?.HC_MV ?? statusPaciente?.HC ?? 'No registrado' }}
                </p>
                <p class="descrip-paciente">
                  <b>Diagnóstico: </b>{{ statusPaciente?.DG_PRINCIPAL ? statusPaciente?.DG_PRINCIPAL : "No registrado"
                  }}</p>
                <p class="descrip-paciente">
                  <b>Plan/Convenio: </b>{{ statusPaciente?.TIPO_DCTO ? statusPaciente?.TIPO_DCTO : "No registrado" }}
                </p>
              </div>
              <div class="col-12 col-md-4">
                <p class="descrip-paciente">
                  <b>Médico: </b>{{ statusPaciente?.NOMBRE_MEDICO ? statusPaciente?.NOMBRE_MEDICO : "No registrado" }}
                </p>
                <p class="descrip-paciente">
                  <b>Especialidad: </b>{{ statusPaciente?.ESPECIALIDAD ? statusPaciente?.ESPECIALIDAD : "No registrado"
                  }}</p>
                <p class="descrip-paciente">
                  <b>Atención: </b>{{ evPaciente ? evPaciente[0] ? evPaciente[0]?.ADM : "No registrado" : "No registrado" }}</p>
              </div>
              <div class="col-12 col-md-3">
                <p class="descrip-paciente">
                  <b>Edad: </b>{{ statusPaciente?.EDAD ? statusPaciente?.EDAD + " Años" : "No registrado" }}</p>
                <p class="descrip-paciente">
                  <b>CI: </b>{{ statusPaciente?.CEDULA ? statusPaciente?.CEDULA : "No registrado" }}</p>
                <p class="descrip-paciente">
                  <b>Ubicación: </b>{{ statusPaciente?.NRO_HABITACION ? statusPaciente?.NRO_HABITACION : "No registrado"
                  }}</p>
              </div>
            </div>
          </div>
        </div>


        <div class="row my-2 pb-5 pt-2">
          <div class="col-sm-12 mt-2">
            <div class="div-text-mobile">
              <span class="span-text"> <font-awesome-icon :icon="['fas', 'chevron-left']" />
                Menú horizontal
               <font-awesome-icon :icon="['fas', 'chevron-right']" />
              </span>
            </div>
            <ul class="nav nav-tabs tabs-details" id="PatientTab" role="tablist">
              <li class="nav-item tab-hm" role="presentation">
                <button class="nav-link nav-hm pl-0" id="vital-signs-tab" data-toggle="tab"
                        :class="{'active': patientDetailStore.activeTabPaciente === 0}"
                        @click="patientDetailStore.activeTabPaciente = 0"
                        data-target="#vital-signs" type="button" role="tab"
                        aria-controls="vital-signs" aria-selected="true">
                  Signos Vitales
                </button>
              </li>
              <li class="nav-item tab-hm" role="presentation">
                <button class="nav-link nav-hm pl-0" id="evolutions-tab" data-toggle="tab"
                        :class="{'active': patientDetailStore.activeTabPaciente === 1}"
                        @click="patientDetailStore.activeTabPaciente = 1"
                        data-target="#evolutions" type="button"
                        role="tab" aria-controls="evolutions" aria-selected="false">
                  Evoluciones y Prescripciones
                </button>
              </li>
              <li class="nav-item tab-hm" role="presentation">
                <button class="nav-link nav-hm pl-0" id="lab-tab" data-toggle="tab"
                        :class="{'active': patientDetailStore.activeTabPaciente === 2}"
                        @click="patientDetailStore.activeTabPaciente = 2"
                        data-target="#lab" type="button" role="tab" aria-controls="lab"
                        aria-selected="true">
                  Laboratorio
                </button>
              </li>
              <li class="nav-item tab-hm" role="presentation">
                <button class="nav-link nav-hm pl-0" id="image-tab" data-toggle="tab"
                        :class="{'active': patientDetailStore.activeTabPaciente === 3}"
                        @click="patientDetailStore.activeTabPaciente = 3"
                        data-target="#image" type="button" role="tab" aria-controls="image"
                        aria-selected="false">
                  Imagen
                </button>
              </li>

            </ul>
            <div class="tab-content" id="PatientTabContent">
              <div class="tab-pane fade" id="vital-signs" role="tabpanel"
                   :class="{'active': patientDetailStore.activeTabPaciente === 0, 'show': patientDetailStore.activeTabPaciente === 0}"
                   aria-labelledby="vital-signs-tab">
                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-12 py-4 pl-0">
                      <template v-if="isLoadingSV ">
                        <div class="d-flex justify-content-center">
                          <img class="img-fluid" src="@/assets/loading.gif"
                               alt="Loading Hm">
                        </div>
                      </template>
                      <template v-else>
                        <template v-if="svPaciente.length > 0">
                          <div class="row">
                            <div class="col-12 col-md-4 mt-3 mb-2 mb-md-5"
                                 v-for="(item, key) in svPaciente"
                                 v-bind:key="key">
                              <div class="row bg-box-results">
                                <div class="col-3 col-md-3">
                                  <div class="d-block img-bordervp">
                                    <img class="img-icon-colorvp"
                                         :src="getWhiteImage(item)"
                                         alt=" icon">
                                    <img class="img-icon-colorvp" style="margin-top: -85px;"
                                         :src="getImage(item)"
                                         alt=" icon">


                                    <br>
                                  </div>
                                </div>
                                <div class="col-9 col-md-9">
                                  <p class="title-paciente title-icons">
                                    <b>{{ item.SIGNO }}</b>
                                  </p>
                                  <p class="detail-paciente" v-if="item.VALOR">{{ item.VALOR }}
                                    {{ getUnit(item) }}</p>
                                  <p class="detail-paciente">{{ item.FECHA }}</p>

                                </div>
                                <div class="col-12">
                                  <template v-if="item.SIGNO === 'TEMPERATURA'">
                                    <div @click.exact="goToGraphic('TEMP', item)"
                                         @click.ctrl="goToGraphicCtrl('TEMP', item)"
                                         class="cursor-pointer text-center">
                                      <p class="title-paciente"
                                         style="text-decoration: underline;">
                                        Ver curva de temperatura
                                      </p>
                                    </div>
                                  </template>
                                  <template
                                    v-if="item.SIGNO === 'PRESION ARTERIAL SISTOLICA' || item.SIGNO === 'PRESION ARTERIAL DIASTOLICA'">
                                    <div @click.exact="goToGraphic('PSD', item)"
                                         @click.ctrl="goToGraphicCtrl('PSD', item)"
                                         class="cursor-pointer text-center">
                                      <p class="title-paciente"
                                         style="text-decoration: underline; color: black;">
                                        Ver curva de Presión Arterial
                                      </p>
                                    </div>
                                  </template>
                                  <template
                                    v-if="item.SIGNO === 'FRECUENCIA CARDIACA'">
                                    <div @click.exact="goToGraphic('FC', item)"
                                         @click.ctrl="goToGraphicCtrl('FC', item)"
                                         class="cursor-pointer text-center">
                                      <p class="title-paciente"
                                         style="text-decoration: underline; color: black;">
                                        Ver curva de frecuencia cardiaca
                                      </p>
                                    </div>
                                  </template>
                                  <template
                                    v-if="item.SIGNO === 'GLICEMIA CAPILAR'">
                                    <div @click.exact="goToGraphic('GLUC', item)"
                                         @click.ctrl="goToGraphicCtrl('GLUC', item)"
                                         class="cursor-pointer text-center">
                                      <p class="title-paciente"
                                         style="text-decoration: underline; color: black;">
                                        Ver control de Hemoglucotest
                                      </p>
                                    </div>
                                  </template>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <div class=" my-3 py-3  text-center">
                            <h4 class="center text-search">
                              No existen registros de signos vitales para este paciente.
                            </h4>
                          </div>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="evolutions" role="tabpanel"
                   :class="{'active': patientDetailStore.activeTabPaciente === 1, 'show': patientDetailStore.activeTabPaciente === 1}"
                   aria-labelledby="evolutions-tab">
                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-12 py-4 pl-0 pr-2">
                      <template v-if="isLoadingForms">
                        <div class="d-flex justify-content-center">
                          <img class="img-fluid" src="@/assets/loading.gif"
                               alt="Loading Hm">
                        </div>
                      </template>
                      <template v-else>
                        <template v-if="formsPaciente.length >0">
                          <template v-for="(form, i) in formsPaciente" v-bind:key="i">
                            <div
                              class="my-1 py-4 px-2 text-left border-result ">
                              <div class="row">
                                <div class="col-12 col-md-12">
                                  <div @click="form.visible = !form.visible"
                                       class="p-2 d-flex justify-content-between cursor-pointer">
                                    <div>
                                      <p class="title-results title-colapse">
                                        <b>FORMULARIO 005</b>
                                      </p>
                                      <p class="title-results title-colapse">
                                        <b>Fecha: </b>{{
                                          form.fecha_FOR
                                        }}
                                      </p>
                                      <p class="title-results title-colapse">
                                        <b>Médico: </b>{{
                                          form.med_FOR
                                        }}
                                      </p>
                                      <p class="title-results title-colapse">
                                        <b>Número Historia Clínica: </b>{{
                                          statusPaciente?.HC
                                        }}
                                      </p>
                                      <p class="title-results title-colapse">
                                        <b>Número de Atención: </b>{{
                                          evPaciente[0]?.ADM
                                        }}
                                      </p>

                                    </div>
                                    <div class="d-flex flex-column align-items-end px-3">
                                      <div>
                                        <font-awesome-icon
                                          :icon="['fas', form.visible ?  'chevron-up':'chevron-down' ]" />
                                      </div>
                                    </div>
                                  </div>
                                  <div :class="{'form-show': form.visible, 'form-hidden': !form.visible, }">
                                    <div class="p-3">
                                      <form005-viewer :form="form" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                        </template>
                        <template v-else>
                          <div class=" my-3 py-3  text-center">
                            <h4 class="center text-search">
                              No existen registros de evoluciones-prescripciones para este paciente.
                            </h4>
                          </div>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="lab" role="tabpanel"
                   :class="{'active': patientDetailStore.activeTabPaciente === 2, 'show': patientDetailStore.activeTabPaciente === 2}"
                   aria-labelledby="lab-tab">
                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-12 py-4">
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
                                  'gray':labResult?.IsOrderValidated === 'false' || !labResult?.IsOrderValidated,
                                  'orange':labResult?.IsOrderValidated || labResult?.IsOrderValidated === 'true'
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
                                                   :icon="['fas', 'list' ]" />
                                Exámenes solicitados
                                <font-awesome-icon class="px-2"
                                                   :icon="['fas', labResult.isOpen ?  'chevron-up':'chevron-down' ]" />
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
                              <p style="color: #ff8201;" class="text-results">Laboratorio</p>

                            </div>
                            <div class="col-3 d-flex flex-column flex-md-row justify-content-end">
                              <div class="cursor-pointer" title="Ver resultado"
                                   style="display: inline-block;"
                                   @click.exact="goToLabResult(labResult)"
                                   @click.ctrl="goToLabResultCtrl(labResult)">
                                <div class="py-3 p-md-4">
                                  <font-awesome-icon :icon="['fas', 'eye']" size="2x"
                                                     class="icon-device" />
                                </div>
                              </div>
                              <div @click="downloadLabFile(labResult)"
                                   class="cursor-pointer"
                                   title="Descargar resultado">
                                <div class="p-0 p-md-4">
                                  <font-awesome-icon :icon="['fas', 'download']" size="2x"
                                                     class="icon-device" />
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
                   :class="{'active': patientDetailStore.activeTabPaciente === 3, 'show': patientDetailStore.activeTabPaciente === 3}"
                   aria-labelledby="image-tab">
                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-12 py-4">
                      <template v-if="isLoadingImage">
                        <div class="d-flex justify-content-center">
                          <img class="img-fluid" src="@/assets/loading.gif"
                               alt="Loading Hm">
                        </div>
                      </template>
                      <template v-else>
                        <template v-if="seeImages">
                          <div class="flex" @click="patientDetailStore.seeImages = false;">
                            <div class="row mt-3">
                              <h5 class="cursor-pointer ml-3"
                                  style=" color: #0f4470; font-size: 16px;">
                                <font-awesome-icon :icon="['fas', 'chevron-left']" />
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
                                <p class="title-results"><b>{{
                                    imageResult?.ESTUDIO
                                  }}</b>
                                  <span class="p-2 mx-2 pill" v-if="isWithin24Hours(imageResult?.fecha_)">Nuevo</span>
                                </p>
                                <p class="text-results">{{ imageResult?.FECHA }}</p>
                                <p class="text-results">
                                  <b>Médico:</b> {{ imageResult?.MEDICO }}
                                </p>
                                <p class="text-results" style="color: #ff8201;">Imagen</p>
                              </div>

                              <div class="col-3 d-flex flex-column flex-md-row justify-content-end">
                                <div class="cursor-pointer" title="Ver imagen"
                                     style="display: inline-block;"
                                     @click.exact="goToZeroCtrlItem(imageResult)"
                                     @click.ctrl="goToZeroCtrlItem(imageResult)">
                                  <div class="pt-3 p-md-4">
                                    <font-awesome-icon :icon="['fas', 'desktop']" size="2x"
                                                       class="icon-device" />
                                  </div>

                                </div>
                                <div class="cursor-pointer" title="Ver informe"
                                     style="display: inline-block;"
                                     @click.exact="goToImageResult(imageResult)"
                                     @click.ctrl="goToImageResultCtrl(imageResult)">
                                  <div class="p-0 p-md-4">
                                    <font-awesome-icon :icon="['fas', 'eye']" size="2x"
                                                       class="icon-device" />
                                  </div>
                                </div>

                                <div class="cursor-pointer" title="Descargar informe"
                                     v-if="imageResult.urlPdf"
                                     style="display: inline-block;"
                                     @click="downloadImageFile(imageResult)">
                                  <div class="p-0 p-md-4">
                                    <font-awesome-icon :icon="['fas', 'download']" size="2x"
                                                       class="icon-device" />
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
                          <div @click="patientDetailStore.seeImages = true;"
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
        <FooterMedico />
      </div>
    </div>
  </div>
</template>

<style scoped>
.pill {
  border-radius: 15px;
  background-color: #ff8201;
  color: white;
  font-weight: 500
}

.orange {
  background-color: #ff8201 !important;
}

.gray {
  background-color: #a39b9b !important;
}

.border-result {
  border: 1px solid #c5ccca;
  border-radius: 6px;
  margin-top: 20px !important;
  padding-top: 15px !important;
  padding-left: 7px;
  background: white;

}

.form-show {
  display: block;
}

.form-hidden {
  display: none;
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


.img-icon-color {
  width: 105px;
  height: 105px;
  margin: 0 auto;
  display: block;
  padding: 20px;
  margin-top: 1px;
}


.row.d-block:hover {
  background: linear-gradient(90deg, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 100%) !important;
  transition: all .30s linear;
}

.img-bordervp:hover {
  background: linear-gradient(90deg, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 100%) !important;
  transition: all .30s linear;
}

.text-icon-color {
  text-align: center;
  color: #05305d;
  font-weight: 600;
  line-height: 18px;
}


h4.text-header {
  padding-left: 10%;
  margin-top: 14%;
}

.icon-device {
  color: #05305d;
  cursor: pointer;
}

a:hover {
  text-decoration: none;
}


/*imagenes*/

.img-bordervp > img {
  position: relative;
  left: -10px;
  top: -8px;
}

.img-bordervp > img:last-of-type {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  -moz-transition: opacity 0.3s ease-in-out;
  -webkit-transition: opacity 0.3s ease-in-out;
}

.img-bordervp:hover > img:last-of-type {
  opacity: 0;
}

.hover-list-element:hover {
  background-color: #edf6fb;
  box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
}


.dates-pacientes {
  padding-left: 12px;
}

@media screen and (max-width: 600px) {
  .bg-box-results {
    min-height: 130px;
    padding-top: 20px !important;
  }

  .title-results {
    padding-top: 10px;
  }
}

@media screen and (max-width: 380px) {
  .text-name-paciente {
    white-space: normal;
    width: 72%;
    padding-right: 10px;
    margin: 10px auto;
  }
}

.small-font {
  font-size: small;
}

</style>
