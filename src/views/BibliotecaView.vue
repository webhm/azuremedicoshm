<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import {useAuthStore} from "../stores/auth";
import {computed, ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import {event, screenview} from 'vue-gtag';
import {useMyLibraryStore} from "../stores/myLibrary";
import DropZone from "../components/DropZone.vue";
import {checkFolder, createFolder, deleteFile, uploadFile, checkMedic} from "../services/library";
import {useNotification} from "@kyvg/vue3-notification";
import SmallBox from "../components/SmallBox.vue";
import {getFolders} from "../services/library";
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const token = computed(() => authStore.token);
// const type = computed(() => authStore.type);
const myLibraryStore = useMyLibraryStore();
const folders = computed(() => myLibraryStore.folders);
const total_documents = computed(() => myLibraryStore.total);
let isLoading = ref(false);
let isLoadingDelete = ref(false);
const router = useRouter();
const selectedYear = ref(null);
const year = ref(null);
const folder = ref(null);
const src = ref(null);
const invalidDate = ref(false);
const isValidating = ref(false);
const date = ref(null);
const dirty = ref(false);
const fileInput = ref(null);
const years = ref([]);
const file = ref(null);
const description = ref(null);
const showDeleteModal = ref(false);
const selectedArchive = ref(null);
const {notify} = useNotification();
const today = new Date().toISOString().split('T')[0];
const minDate = computed(() => today);
const forbiddenCharacters = /[@#!:&?]/g;

const filterCharacters = () => {
  // Filtra el texto para eliminar los caracteres no permitidos
  description.value = description.value.replace(forbiddenCharacters, '');
}
const closeModal = () => {
  showDeleteModal.value = false;
  selectedArchive.value = null;
}
const deleteArchive = async () => {
  isLoadingDelete.value = true;
  const responseCheck = await deleteFile(selectedArchive.value.DeleteFile);
  if (responseCheck.status) {
    showDeleteModal.value = false;
    selectedArchive.value = null;
    notify({
      title: "Listo",
      text: "Archivo Eliminado",
      type: "success"
    });
    refresh();
  } else {
    notify({
      title: "Hubo un error al eliminar",
      type: "error"
    });
  }
  isLoadingDelete.value = false;

}

const goBack = async () => {
  await myLibraryStore.clearFolders();
  if (window.history.state.back === null) {
    await router.replace({name: "dashboard"});
  } else {
    router.back();
  }
};

const addFile = (newFile) => {
  console.log('newFile', newFile);
  file.value = new UploadableFile(newFile);


  console.log('files', file.value);
};

const dropFiles = (newFiles) => {
  addFile(newFiles[0]);
  console.log('files', file.value);
};


const downloadPdf = async (archive) => {
  try {
    // Create a new link
    notify({
      title: "Observación",
      text: "Se procederá con la descarga en unos segundos",
      type: "warn"
    });
    const response = await fetch(archive.Uri, {
      method: 'GET',
      // Puedes agregar encabezados personalizados si es necesario
      headers: {
        'Authorization': token.value, // Si es necesario
      },
    });

    if (!response.ok) {
      throw new Error('No se pudo obtener el documento');
    }

    const blob = await response.blob();
    // Crear un enlace (link) temporal para descargar el archivo
    const fileUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = fileUrl;
    a.target = '_blank';
    a.download = archive.Name; // Cambia esto al nombre deseado
    document.body.appendChild(a);
    a.click();
    notify({
      title: "Listo",
      text: "Archivo descargado",
      type: "success"
    });
    window.URL.revokeObjectURL(fileUrl);
    isLoading.value = false;
  } catch (e) {
    isLoading.value = false;
    console.log("e", e);
    notify({
      title: "Hubo un error al descargar",
      type: "error"
    });
  }
};

const onInputChange = (e) => {
  console.log('event, ', e);
  addFile(e.target.files[0]);
  e.target.value = null;
  // reset so that selecting the same file again will still cause it to fire this change
};

const openSelector = () => {
  fileInput.value.click();
}
const validateName = async () => {
  let userName = user.value.username.split('@')[0];
  let data = {
    path: `${year.value}/${userName}`
  };
  console.log('data',data);
  let response = await refresh(data);
  console.log('response', response);
  if (response.status) {
    let files = response.data;
    let res = files.find(objeto => objeto.Name === file.value.name && objeto.Path === folder.value);
    console.log('res', res);
    return res;

  }
  return true;
}
const validarFecha = () => {
  // Crear un objeto Date a partir de la cadena de fecha
  const fecha = new Date(date.value);
  // Verificar si la fecha es válida y no es NaN
  if (isNaN(fecha)) {
    return false; // La fecha no es válida
  }
  // Obtener la fecha actual
  const fechaActual = new Date();
  // Comparar si la fecha es posterior a la fecha actual
  return fecha > fechaActual;
}

const upload = async () => {
  try {
    notify({
      title: "Validando Archivo",
      text: 'El archivo estó siendo validado',
      type: "warn"
    });
    dirty.value = true;
    isValidating.value = true;
    invalidDate.value = false;
    if (year.value === null || folder.value === null) return  isValidating.value = false;
    console.log('year', year.value);
    console.log('folder', folder.value);
    if (folder.value === 'BLS' || folder.value === 'Poliza-Responsabilidad-Civil') {
      if (!validarFecha()) {
        console.log("La fecha no es válida o no es posterior a la fecha actual.");
        invalidDate.value = true;
        isValidating.value = false;
        return;
      }
      if (date.value === null) return isValidating.value = false;

    }else{
      date.value = null;
    }
    console.log('date', date.value);
    if (
        file.value.name === null ||
        description.value === null ||
        file.value.name === '' ||
        description.value === '' ||
        description.value?.length > 100) return isValidating.value = false;
    console.log('file.value.name',file.value.name);
    console.log('description.value',description.value);
    let userName = user.value.username.split('@')[0];
    let data = {
      path: `${year.value}/${userName}`
    };
    console.log('data',data);
    let response = await getFolders(data);
    console.log('response', response);
    let res = null;
    if (response.status) {
      let files = response.data;
      res = files.find(objeto => objeto.Name === file.value.name && objeto.Path === folder.value);
  console.log('res', res);

    }
    if(res){
      exist.value = true;
      console.log('exist.value',exist.value);
      isValidating.value = false;
      return;
    }
    notify({
      title: "Archivo Validado",
      text: 'El archivo es válido, empieza la subida',
      type: "warn"
    });
    invalidDate.value = false;
    exist.value = false;
    dirty.value = false;
    isLoading.value = true;
    isValidating.value = false;
    //check if folder exist
    let dataCheck = {
      path: `${year.value}/${userName}/${folder.value.toUpperCase()}`
    };
    const responseCheck = await checkFolder(dataCheck);
    console.log('responseCheck', responseCheck);
    if (responseCheck.status) {
      // si existe
      //upload
      const reader = new FileReader();

      reader.onload = async (e) => {
        const base64String = e.target.result.split(',')[1]; // Extract the Base64 string
        let dataUpload = {
          path: `${year.value}/${userName}/${folder.value.toUpperCase()}`,
          fileName: file.value.name,
          fileContent: base64String,
          user: userName,
          fileType: folder.value.toUpperCase(),
          description: description.value,
          expireDate: date.value
        };
        console.log('data upload', dataUpload);
        const responseUpload = await uploadFile(dataUpload);
        console.log('responseUpload', responseUpload);
        if (responseUpload.status) {
          console.log('se subio');
          folder.value = null;
          date.value = null;
          file.value = null;
          description.value = null;
          notify({
            title: "Archivo subido correctamente",
            text: 'El archivo ha sido subido y puedes verlo en Mis Documentos',
            type: "success"
          });
          myLibraryStore.activeTab = 0;
          isLoading.value = false;
          refresh();

        } else {
          notify({
            title: "Hubo un error",
            text: 'no se pudo subir el archivo',
            type: "error"
          });
          isLoading.value = false;
        }

      };

      reader.readAsDataURL(file.value.file);

    } else {
      // no existe
      // crea
      let dataCreate = {
        path: `${year.value}/${userName}/${folder.value.toUpperCase()}`
      };
      const responseCreate = await createFolder(dataCreate);
      console.log('responseCreate', responseCreate);
      if (responseCreate.status) {
        //upload
        const reader = new FileReader();

        reader.onload = async (e) => {
          const base64String = e.target.result.split(',')[1]; // Extract the Base64 string
          console.log(base64String);
          let dataUpload = {
            path: `${year.value}/${userName}/${folder.value.toUpperCase()}`,
            fileName: file.value.name,
            fileContent: base64String,
            user: userName,
            fileType: folder.value.toUpperCase(),
            description: description.value,
            expireDate: date.value
          };
          console.log('data upload', dataUpload);
          const responseUpload = await uploadFile(dataUpload);
          console.log('responseUpload', responseUpload);
          if (responseUpload.status) {
            console.log('se subio');
            folder.value = null;
            date.value = null;
            file.value = null;
            notify({
              title: "Archivo subido correctamente",
              text: 'El archivo ha sido subido y puedes verlo en Mis Documentos',
              type: "success"
            });
            myLibraryStore.activeTab = 0;
            isLoading.value = false;
            refresh();
          } else {
            notify({
              title: "Hubo un error",
              text: 'no se pudo subir el archivo',
              type: "error"
            });
            isLoading.value = false;
          }

        };

        reader.readAsDataURL(file.value.file);
      } else {
        //hubo un error
        notify({
          title: "Hubo un error",
          text: 'no se pudo subir el archivo',
          type: "error"
        });
        isLoading.value = false;
      }
    }

  } catch (e) {
    console.log('error', e);
    isLoading.value = false;
  }
};

const refresh = async () => {

  isLoading.value = true;
  let userName = user.value.username.split('@')[0];
  await myLibraryStore.getFolders(selectedYear.value, userName);
  isLoading.value = false;
  console.log('folders', folders);
}
const exist = ref(false);


onMounted(async () => {
  screenview('Biblioteca de credenciales');
  // Obtén el año actual
  const actual = new Date().getFullYear();
  selectedYear.value = actual;
  year.value = actual;
// Crea un array de años desde 2020 hasta el año actual
  for (let i = 2020; i <= actual; i++) {
    years.value.push(i);
  }
  // console.log('codMedico', user.value.codMedico)
  // if(!user.value.codMedico || user.value.codMedico === ''){
  //   notify({
  //     title: "Error detectado",
  //     text: "Al parecer su perfil necesita una configuración adicional, por favor comuníquese con nuestra mesa de ayuda CONCAS 399 8000",
  //     type: "error"
  //   });
  // }
  const responseCheckMedic = await checkMedic();
  console.log('responseCheckMedic', responseCheckMedic);
  if(responseCheckMedic.status){
    refresh();
  }else{
    notify({
      title: "Hubo un error con el perfil",
      text: responseCheckMedic.error,
      type: "error"
    });
    router.back();
  }

});

class UploadableFile {
  constructor(file) {
    this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`;
    this.file = file;
    this.name = file.name;
    this.description = null;
    this.size = file.size;
    this.lastModified = file.lastModified;
    this.type = file.type;
    this.url = URL.createObjectURL(file);
  }
}


</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Biblioteca de Credenciales - MetroVirtual - Hospital Metropolitano</title>
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
                  <img class="img-header-icon ml-3 mx-1 pt-2 pt-md-0" src="@/assets/biblioteca.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-2"
                    style="
                            color: #05305d;
                            text-align:left;
                            font-weight: 600;">
                  Biblioteca de Credenciales
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
            <div class="row">
              <div class="col-11 col-md-9">
                <ul class="nav nav-tabs" id="ResultsTab" role="tablist">
                  <li class="nav-item tab-hmv2" role="presentation">
                    <button class="nav-link nav-hm pl-0" id="lab-tab" data-toggle="tab"
                            :class="{'active': myLibraryStore.activeTab === 0}" @click="myLibraryStore.activeTab = 0"
                            data-target="#lab" type="button" role="tab" aria-controls="lab"
                            aria-selected="true">Mis Documentos <span class="bg-number">{{ total_documents }}</span>
                    </button>
                  </li>
                  <li class="nav-item tab-hmv2" role="presentation">
                    <button class="nav-link nav-hm pl-0" id="image-tab" data-toggle="tab"
                            :class="{'active': myLibraryStore.activeTab === 1}" @click="myLibraryStore.activeTab = 1"
                            data-target="#image" type="button" role="tab" aria-controls="image"
                            aria-selected="false">
                      Cargar Documentos
                    </button>
                  </li>

                </ul>
              </div>

              <div class="col-1 col-md-3 d-flex justify-content-end">
                <h5 class="cursor-pointer p-1 pt-2" style=" color: #0f4470; font-size: 16px;" @click="refresh()">
                  <font-awesome-icon :icon="['fas', 'refresh']" class="mx-1"/>
                  <span class="m-0 d-none d-md-inline-block">Actualizar</span>

                </h5>
              </div>
            </div>

            <div class="tab-content" id="ResultsTabContent">
              <div class="tab-pane fade" id="lab" role="tabpanel"
                   :class="{'active': myLibraryStore.activeTab === 0, 'show': myLibraryStore.activeTab === 0}"
                   aria-labelledby="lab-tab">
                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-12">
                      <template v-if="isLoading">
                        <div class="d-flex justify-content-center">
                          <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
                        </div>
                      </template>
                      <template v-else>
                        <template v-if="folders.length > 0">
                          <div class="accordion accordion-flush" id="accordionFlush">
                            <div class="row">
                              <div class="col-12 col-md-4 p-2">
                                <label class="my-2 title-text">Selecciona el año</label>
                                <select class="form-control form-select p-3 my-2"
                                        v-model="selectedYear" @change="refresh">
                                  <option :value="null">Seleccionar año</option>
                                  <option v-for="(year, yearKey) in years"
                                          :key="yearKey" :value="year">
                                    {{ year }}
                                  </option>
                                </select>

                              </div>

                            </div>
                            <template
                                v-for="(file, documentKey) in folders"
                                :key="documentKey">
                              <div class="accordion-item py-2 px-1">
                                <h2 class="accordion-header" :id="'flush-heading'+documentKey">
                                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                          :data-bs-target="'#flush-collapseOne'+documentKey" aria-expanded="false"
                                          :aria-controls="'#flush-collapseOne'+documentKey">
                                    {{ selectedYear }}/{{ file.label }} <span class="bg-number mx-2"><b>{{
                                      file.data.length
                                    }}</b></span>
                                  </button>
                                </h2>
                                <div :id="'flush-collapseOne'+documentKey" class="accordion-collapse collapse"
                                     :aria-labelledby="'flush-heading'+documentKey" data-bs-parent="#accordionFlush">
                                  <div class="accordion-body">
                                    <template v-if="file.isLoading">
                                      <div class="d-flex justify-content-center">
                                        <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
                                      </div>
                                    </template>
                                    <template v-else>
                                      <template v-if="file.data.length>0">
                                        <div class="row">
                                          <table id="dtHorizontalExample"
                                                 class="table table-striped table-bordered table-sm" cellspacing="0"
                                                 width="100%">
                                            <thead>
                                            <tr>
                                              <th>
                                                <div class="title-text">Nombre</div>
                                              </th>
                                              <th>
                                                <div class=" title-text"
                                                     :class="{
                                            'col-4': file.name === 'BLS' || file.name === 'Poliza-Responsabilidad-Civil',
                                            'col-6': file.name !== 'BLS' && file.name !== 'Poliza-Responsabilidad-Civil',
                                          }">Descripción
                                                </div>
                                              </th>
                                              <th>
                                                <div class=" title-text"
                                                     v-if="file.name === 'BLS' || file.name === 'Poliza-Responsabilidad-Civil'">
                                                  Fecha de caducidad
                                                </div>
                                              </th>
                                              <th>
                                                <div class="title-text">Acciones</div>
                                              </th>
                                            </tr>
                                            </thead>
                                            <tbody v-for="(archive, archiveKey) in file.data"
                                                   :key="archiveKey">
                                            <tr>
                                              <td><h6 class="text-left">{{ archive.Name }}</h6></td>
                                              <td><h6 class="text-left" :class="{
                                            'col-4': file.name === 'BLS' || file.name === 'Poliza-Responsabilidad-Civil',
                                            'col-6': file.name !== 'BLS' && file.name !== 'Poliza-Responsabilidad-Civil',
                                          }">{{ archive.Description }} </h6></td>
                                              <td><h6 class=" text-left"
                                                      v-if="file.name === 'BLS' || file.name === 'Poliza-Responsabilidad-Civil'">
                                                {{ archive.TimeExpired }}</h6></td>
                                              <td>
                                                <div class="d-flex justify-content-start">
                                                  <font-awesome-icon class="p-2 px-3 cursor-pointer"
                                                                     :icon="['fas', 'download']"
                                                                     @click="downloadPdf(archive)"/>
                                                  <font-awesome-icon class="p-2 px-3 cursor-pointer"
                                                                     :icon="['fas', 'trash']" style="color: red;"
                                                                     @click="selectedArchive = archive; showDeleteModal = true;"/>
                                                </div>
                                              </td>
                                            </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </template>
                                      <template v-else>
                                        <p>No tienes archivos en {{ file.name }}</p>
                                      </template>
                                    </template>

                                  </div>
                                </div>
                              </div>

                            </template>
                          </div>

                        </template>
                        <template v-else>
                          <div class=" my-3 py-3  text-center">
                            <h4 class="center text-search">
                              No tienes documentos
                            </h4>
                          </div>
                        </template>
                      </template>

                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="image" role="tabpanel"
                   :class="{'active': myLibraryStore.activeTab === 1, 'show': myLibraryStore.activeTab === 1}"
                   aria-labelledby="image-tab">
                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-12">
                      <template v-if="isLoading">
                        <div class="d-flex justify-content-center">
                          <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
                        </div>
                      </template>
                      <template v-else>
                        <div class="row">
                          <div class="col-12 col-md-4 p-2">
                            <label class="my-2 title-text">Año</label>
                            <select class="form-control form-select p-3 my-2" v-model="year"
                                    :disabled="isValidating">
                              <option :value="null">Selecciona el año</option>
                              <option v-for="(year, yearKey) in years"
                                      :key="yearKey" :value="year">
                                {{ year }}
                              </option>
                            </select>
                            <p v-if="year === null && dirty" class="mx-1 error-text">El año es requerido</p>
                          </div>
                          <div class="col-12 col-md-4 p-2">
                            <label class="my-2 title-text">Carpeta</label>
                            <select class="form-control p-3 my-2 form-select" v-model="folder" :disabled="isValidating">
                              <option :value="null">Seleccionar carpeta</option>
                              <option v-for="(folder, folderKey) in folders"
                                      :key="folderKey" :value="folder.name">
                                {{ folder.label }}
                              </option>
                            </select>
                            <p v-if="folder === null && dirty" class="mx-1 error-text">La carpeta es requerida</p>
                          </div>
                          <div class="col-12 col-md-4 p-2"
                               v-if="folder === 'BLS' || folder === 'Poliza-Responsabilidad-Civil'">
                            <label class="my-2 title-text">Fecha de Caducidad</label>
                            <input class="form-control p-3 my-2 " type="date" v-model="date" :min="minDate" :disabled="isValidating">
                            <p v-if="date === null && dirty" class="mx-1 error-text">La fecha de caducidad es
                              requerida</p>
                            <p v-if="invalidDate && dirty" class="mx-1 error-text">
                              La fecha debe ser mayor que el día de hoy</p>
                          </div>
                        </div>
                        <div class=" my-2 py-2  text-center">
                          <template v-if="file">
                            <div class="d-flex">
                              <p class="cursor-pointer ml-3" style=" color: #0f4470; font-size: 16px;"
                                 @click="file = null;">
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                                Volver a seleccionar
                              </p>
                            </div>
                            <div class="files ">
                              <div class="d-flex justify-content-start">
                                <label class="my-2 title-text">Nombre:</label>
                              </div>

                              <div class="d-flex">
                                <font-awesome-icon class="p-4" :icon="['fas', 'file']" size="2x"/>
                                <input class="form-control p-1" type="text" v-model="file.name"
                                       placeholder="Nombre del Archivo" :disabled="isValidating">

                              </div>
                              <div class="d-flex justify-content-start">
                                <p v-if="(file.name === null || file.name === '') && dirty"
                                   class="mx-5 my-2 error-text">El nombre es requerido</p>
                                <p v-if="exist && dirty"
                                   class="mx-5 my-2 error-text">El nombre ya existe</p>
                              </div>


                              <div class="d-flex justify-content-start">
                                <label class="my-2 title-text">Descripción:</label>
                              </div>

                              <div class="d-flex">
                                <font-awesome-icon class="p-4" :icon="['fas', 'book-bookmark']" size="2x"/>
                                <textarea class="form-control p-3" rows="6" v-model="description" maxlength="100"
                                          @input="filterCharacters" :disabled="isValidating"
                                          placeholder="Descripción del archivo de máximo 100 caracteres"></textarea>

                              </div>
                              <div class="d-flex justify-content-start">
                                <p v-if="(description === null || description === '') && dirty"
                                   class="mx-5 my-2 error-text">La descripción es requerida</p>
                                <p v-if="description?.length > 100 && dirty"
                                   class="mx-5 my-2 error-text">La descripción debe ser de máximo 100 caracteres</p>
                              </div>

                              <div class="d-flex justify-content-center">
                                <button class="py-2 px-4 mx-2 my-2 upload-button" :disabled="isValidating" @click="upload">
                                  <span v-if="!isValidating" class="spinner"></span>
                                  Subir</button>
                              </div>

                            </div>
                          </template>
                          <template v-else>
                            <DropZone @files-dropped="dropFiles">
                              <div class="rounded-lg m-2 bg-white dropzone d-none d-md-block">
                                <p class="text-md text-center mt-5">Arrastra, y suelta aquí tu archivo</p>
                              </div>
                              <p class="d-none d-md-block"><b>Nota: </b>
                                Se recomienda subir archivos en formato PDF con un máximo de 20mb
                              </p>
                              <!--eslint-disable-next-line-->
                              <input ref="fileInput" type="file" id="file-input"
                                     @change="onInputChange" class="d-none"/>
                            </DropZone>
                            <div class="d-flex">
                              <button class="py-2 px-4 mx-2 upload-button mx-auto" @click="openSelector">Seleccionar
                                Documento
                              </button>
                            </div>
                          </template>

                        </div>
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
    <SmallBox :showing="showDeleteModal" @close="closeModal">
      <div class="p-4">
        <template v-if="isLoadingDelete">
          <div class="d-flex justify-content-center">
            <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
          </div>
        </template>
        <template v-else>
          <h6><b>¿Estás seguro de eliminar el archivo {{ selectedArchive.Name }}?</b></h6>
          <p>Esta acción no podrá ser revertida</p>
          <div class="d-flex justify-content-end">
            <button class="py-2 px-4 mx-2 my-2 cancel-button" @click="closeModal">
              <b>Cancelar</b>
            </button>
            <button class="py-2 px-4 mx-2 my-2 delete-button" @click="deleteArchive">
              <b>Eliminar</b>
            </button>
          </div>
        </template>

      </div>
    </SmallBox>
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

  li.nav-item.tab-hmv2 button {
    font-size: 14px;
  }

  .nav-tabs .nav-link.active {
    font-size: 14px;
  }
}

.title-text {
  color: #05305d;
  text-align: left;
  font-weight: 600;
}

.accordion-button:not(.collapsed) {
  background-color: transparent;
}

.accordion-button:focus {
  border-color: transparent;
  box-shadow: transparent;
}

.hidden {
  display: none;
}

.dropzone {
  height: 120px;
  border-radius: 15px;
  border: 1px solid #ced4da;
}

.upload-button {
  border-radius: 10px;
  color: white;
  background-color: #0d2c65;
}
.upload-button:disabled {
  border-radius: 10px;
  color: white;
  background-color: grey;
}

.delete-button {
  border-radius: 10px;
  color: white;
  border: white 1px solid;
  background-color: red;
}

.cancel-button {
  border-radius: 10px;
  color: white;
  border: white 1px solid;
  background-color: grey;
}

.error-text {
  color: red;
  font-size: 15px;
}
</style>
