<script setup>
import { computed, onMounted, ref } from "vue";
import pdf from "@jbtje/vite-vue3pdf";
import printJS from "print-js";

import { useNotification } from "@kyvg/vue3-notification";
import {event} from "vue-gtag";
import {encryptId} from "../services/security";
const { notify } = useNotification();
const pdfRef = ref(null);

const props = defineProps(["url", "name", "type", "nhc", "id", "share"]);
const src = ref(props.url);
const id = ref(props.id);
const share = ref(props.share);
const name = ref(props.name);
const pageType = ref(props.type);
const nhc = ref(props.nhc);
const encryptedNHC = ref(encryptId(nhc.value));
const type = ref(props.type);

const currentPage = ref(1);
const numPages = ref(1);

const numPagesEvent = (e) => {
  console.log("numPagesEvent", e);
  numPages.value = e;
};
const pageLoadedEvent = (e) => {
  console.log("currentPage", e);
  currentPage.value = e;
};

const previousPage = () => {
  currentPage.value = currentPage.value - 1;
};
const nextPage = () => {
  currentPage.value = currentPage.value + 1;
};

const shareLink = computed(() => `${window.location.origin}/compartir/${encryptedNHC.value}/${pageType.value}/${id.value}`);
const subject = ref('');
const stringVal = ref('');
const downloadPdf = () => {
  try {
    // Create a new link
    notify({
      title: "Listo",
      text: "Se procederá con la descarga en unos segundos",
      type: "warn"
    });
    console.log("src", src.value);
    const anchor = document.createElement("a");
    anchor.href = src.value;
    anchor.download = `${name.value}.pdf`;
    anchor.style.display = "none";
    console.log("anchor", anchor);
    // Append to the DOM
    document.body.appendChild(anchor);
    // Trigger `click` event
    anchor.click();
    // Remove element from DOM
    document.body.removeChild(anchor);
    notify({
      title: "Listo",
      text: "Resultado descargado",
      type: "success"
    });
    event('file_download', {
      value: type.value
    })
  } catch (e) {
    console.log("e", e);
    notify({
      title: "Hubo un error al descargar",
      type: "error"
    });
  }
};

const printPdf = async () => {
  try {
    console.log("src", src.value);
    let resPrint = await printJS({ printable: src.value, type: "pdf", showModal: true });
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
const registerWhatsappShare = () => {
  event('share', {
    content_type: 'link',
    content_id: type.value,
    method: 'whatsapp'
  })
};
const registerEmailShare = () => {
  event('share', {
    content_type: 'link',
    content_id: type.value,
    method: 'email'
  })
}
onMounted(async () => {
  switch (pageType.value) {
    case 'laboratorio':
      subject.value = 'MetroVirtual%20Resultado%20de%20Laboratorio'
      stringVal.value = 'Resultado%20de%20Laboratorio'
      break;
     case 'imagen':
       subject.value = 'MetroVirtual%20Resultado%20de%20Imagen'
       stringVal.value = 'Resultado%20de%20Imagen'
       break;
      default:
        subject.value = 'MetroVirtual%20Resultado'
        stringVal.value = 'Resultado'
        break;
  }
});
</script>

<template>
  <div>
    <div class="d-flex paginator">
      <button class="prevew p-1 px-4" v-if="currentPage > 1" @click="previousPage()">Atrás</button>
      <p class="text-paginator">{{ currentPage }} / {{ numPages }} Páginas</p>
      <button class="prevew p-1 px-4" v-if="currentPage < numPages" @click="nextPage()">Siguiente</button>
    </div>
    <div class="container">
      <div class="row justify-content-end my-1 row-img">
        <div class="col-2 col-md-1 col-img" v-if="!share">
          <a class="icon-img cursor-pointer" title="Compartir por whatsapp" target="_blank"
             @click="registerWhatsappShare()"
             :href="`https://api.whatsapp.com/send?text=Te%20comparto%20mi%20${stringVal}%20en%20el%20siguiente%20enlace:%20${shareLink}`">
            <div class="row img-borderv4">
              <img class="img-icon-colorv3" src="@/assets/whatsapp.png" alt=" icon">
              <img class="img-icon-colorv3" src="@/assets/whatsapp-blanco.png" alt=" icon"
                   style="margin-top: -35px;">
            </div>
          </a>
        </div>
        <div class="col-2 col-md-1 col-img" v-if="!share">

          <a class="icon-img cursor-pointer" title="Compartir por email" target="_blank" @click="registerEmailShare()"
             :href="`mailto:an@email.com?subject=${subject}&body=Te%20comparto%20mi%20${stringVal}%20en%20el%20siguiente%20enlace:%20${shareLink}`">
            <div class="row img-borderv4">
              <img class="img-icon-colorv3" src="@/assets/email.png" alt=" icon">
              <img class="img-icon-colorv3" src="@/assets/email-blanco.png" alt=" icon"
                   style="margin-top: -35px;">
            </div>
          </a>
        </div>
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
