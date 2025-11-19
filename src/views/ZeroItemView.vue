<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import IframeViewer from "../components/IframeViewer.vue";
import {screenview} from "vue-gtag";
import {decryptId} from "../services/security";

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const props = defineProps(["id"]);
const encrypted_exam_id = ref(props.id);
const exam_id = ref(decryptId(encrypted_exam_id.value));
const title = ref("Zero FootPrint GE - Metrovirtual - Hospital Metropolitano");
const shareLink = computed(() => `${window.location.origin}/compartir/zerofootprint-item/${encrypted_exam_id.value}`);
onMounted(() => {
  screenview(`ZerofootPrint Imagen ${exam_id.value}`);
});

const goBack = () => {
  window.close();
  // console.log("window.history.state.back", window.history.length);
  // console.log("window.history.state", window.history);
  // if (route.query.prev === "detalle-paciente") {
  //   router.replace({ name: "detalle-paciente", params: { nhc: nhc.value } });
  // } else if (route.query.prev === "resultados") {
  //   router.replace({ name: "resultados-paciente-imagen-y-laboratorio-medicos", params: { nhc: nhc.value } });
  // }else{
  //   router.replace({ name: "dashboard" });
  // }
};

</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>{{title}}</title>
    </teleport>
    <div class="d-flex flex-column zeroview">
      <div class="d-flex justify-content-end header-zero">
        <!--columna de text-->
        <div class="dropdown my-1">
          <button class="share-button mx-2 py-2 px-3 text-white d-flex justify-content-center"
                  type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
            <font-awesome-icon :icon="['fass', 'share-nodes']" class="px-2 py-1" />
            <span class="text-white">Compartir</span>
            <!--        <span class="text-white d-none d-md-block">{{ user ? 'Dr. ' + user.name : 'MÉDICOS' }}</span>-->
          </button>
          <ul class="dropdown-menu p-2" aria-labelledby="dropdownMenuButton">
            <li>
              <a class="d-flex py-1 cursor-pointer item-list" title="Compartir por whatsapp"
                 target="_blank"
                 :href="`https://api.whatsapp.com/send?text=Te%20comparto%20mi%20resultado%20de%20imagen%20en%20el%20siguiente%20enlace:%20${shareLink}`">
                <img class="icon icon--small mx-2 d-block"
                     src="@/assets/whatsapp.png" width="30" height="30"
                     alt="Whatsapp">
                <p class="my-1">Whatsapp</p>
              </a>
            </li>
            <li class="" >
              <a class="d-flex py-1 cursor-pointer item-list" title="Compartir por email"
                 target="_blank"
                 :href="`mailto:an@email.com?subject=MetroVirtual%20Resultado%20de%20imagen&body=Te%20comparto%20mi%20resultado%20de%20imagen%20en%20el%20siguiente%20enlace:%20${shareLink}`">
                <img class="icon icon--small mx-2 d-block"
                     src="@/assets/email.png" width="30" height="30"
                     alt="email">
                <p class="my-1">Email</p>
              </a>

            </li>
          </ul>
        </div>
        <div class=" col-4 col-md-2 cursor-pointer" @click="goBack()">
          <div class="d-flex justify-content-end py-2">
            <h5 class=" text-white mx-4 my-2" style=" font-size: 16px;">
              Cerrar
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </h5>
          </div>
        </div>
      </div>
      <div class="justify-content-center px-2 flex-grow-1" style="background-color: #f8f9fc; margin-top: 5vh;">
        <template v-if="isLoading">
          <div class="d-flex justify-content-center">
            <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
          </div>
        </template>
        <template v-else>
          <iframe-viewer :key="nhc"
            :url="`https://imagen.hmetro.med.ec/zfp?Lights=on&mode=proxy#view&ris_exam_id=${exam_id}&un=WEBAPI&pw=lEcfvZxzlXTsfimMMonmVZZ15IqsgEcdV%2forI8EUrLY%3d`" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.zeroview {
  height: 97vh;
}
.item-list{
  text-decoration: none;
  color: #0d2c65 !important;
}
.header-zero {
  background-color: #0d9cde;
  z-index: 99999999999;
  position: absolute;
  top: 0;
  width: 100%;
}
.share-button{
  border: transparent;
  background: transparent;
}
</style>
