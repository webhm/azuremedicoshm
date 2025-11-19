<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import {useAuthStore} from "../stores/auth";
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {event, screenview} from "vue-gtag";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const type = computed(() => authStore.type);
let isLoading = ref(false);
const router = useRouter();

const goBack = async () => {
    await router.push({name: 'dashboard'});
};
onMounted(async () => {
  screenview('Mi Perfil');
  event('see_my_profile');
});
</script>
<template>
    <div>
      <teleport to="#page-title">
        <title>Mi Perfil - MetroVirtual - Hospital Metropolitano</title>
      </teleport>
        <div class="justify-content-center py-1" style="background-color: rgb(229 237 241);">
            <!--login section-->
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
                                <img class="img-header-icon ml-3" src="@/assets/icon-medicos.png" alt=" icon">
                              </div>
                              <br>
                              <h4 class="d-flex text-headerv2 mt-3" style="text-align:left; color: #05305d;
                                    font-weight: 600;">
                                Mi perfil
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
                            <ul class="nav nav-tabs" id="ResultsTab" role="tablist">
                                <li class="nav-item tab-hm" role="presentation">
                                    <button class="nav-link active nav-hm pl-0" id="lab-tab" data-toggle="tab"
                                            data-target="#lab" type="button" role="tab" aria-controls="lab"
                                            aria-selected="true">Mi perfil
                                    </button>
                                </li>
<!--                                <li class="nav-item tab-hm" role="presentation">-->
<!--                                    <button class="nav-link nav-hm pl-0" id="image-tab" data-toggle="tab"-->
<!--                                            data-target="#image" type="button" role="tab" aria-controls="image"-->
<!--                                            aria-selected="false">-->
<!--                                        Notificaciones-->
<!--                                    </button>-->
<!--                                </li>-->
                            </ul>
                            <div class="tab-content" id="ResultsTabContent">
                                <div class="tab-pane fade show active" id="lab" role="tabpanel"
                                     aria-labelledby="lab-tab">
                                    <div class="container">
                                        <div class="row justify-content-center">
                                            <div class="col-12 col-md-6 my-5">
                                                <img class="icono-user-medic mr-2 "
                                                     src="@/assets/icon-medicos.png"
                                                     alt="Mundometro icon" width="200px" height="2100px">
                                            </div>
                                            <div class="col-12 col-md-6 my-5">
                                                <h5 style=" color: #44bdf0; font-size: 18px; font-weight: 500;">
                                                    Bienvenido/a</h5>
                                                <p class="black-colorv2">Nombre:</p>
                                                <p class="title-user"
                                                   style=" color: #05305d; font-size: 24px; font-weight: 600;">
                                                    {{ type === 'patient' ? 'Sr.' : 'Dr.' }} {{ user?.name }}</p>
                                                <p class="black-colorv2">Email:</p>
                                                <p class="title-user"
                                                   style=" color: #05305d; font-size: 24px; font-weight: 600;">
                                                    {{user?.username}}</p>
<!--                                              <p class="black-colorv2">Nombre:</p>-->
<!--                                              <p class="title-user"-->
<!--                                                 style=" color: #05305d; font-size: 24px; font-weight: 600;">-->
<!--                                                {{ type === 'patient' ? 'Sr.' : 'Dr.' }} {{ user?.name }}</p>-->
<!--                                              <p class="black-colorv2">Usuario:</p>-->
<!--                                              <p class="title-user"-->
<!--                                                 style=" color: #05305d; font-size: 24px; font-weight: 600;">-->
<!--                                                {{user.username}}</p>-->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="image" role="tabpanel" aria-labelledby="image-tab">
                                    <div class="container">
                                        <div class="accesos">
                                            <form>
                                                <div class="form-group row">
                                                    <div class="col-12 my-5">
                                                        <h5 style=" color: #44bdf0; font-size: 18px; font-weight: 600;">
                                                            Acceso a módulos</h5>
                                                    </div>
                                                    <div class="form-group col-12 col-md-4">
                                                        <div class="form-check">
                                                            <input type="checkbox" class="form-check-input"
                                                                   id="exampleCheck1">
                                                            <label class="form-check-label" for="exampleCheck1">Biblioteca de credenciales</label>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-12 col-md-4">
                                                        <div class=" form-check">
                                                            <input type="checkbox" class="form-check-input"
                                                                   id="exampleCheck2">
                                                            <label class="form-check-label" for="exampleCheck2">Mis pacientes
                                                                 </label>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-12 col-md-4">
                                                        <div class=" form-check">
                                                            <input type="checkbox" class="form-check-input"
                                                                   id="exampleCheck3">
                                                            <label class="form-check-label" for="exampleCheck3">Resultados
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-12 col-md-4">
                                                        <div class=" form-check">
                                                            <input type="checkbox" class="form-check-input"
                                                                   id="exampleCheck4">
                                                            <label class="form-check-label" for="exampleCheck4">Mis honorarios
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <FooterMedico/>
            </div>

        </div>
    </div>
</template>

<style scoped>
img.icono-user-medic {
    width: 200px;
    height: auto;
}


span.bg-number {
    background: #fc831f;
    padding: 6px 7px;
    border-radius: 50%;
    color: #fff;
    font-size: 12px;
}

.nav-tabs {
    border-bottom: 1px solid #f8f9fc;
}

p.text-pacientes {
    color: #6b6969;
    margin-bottom: 4px;
}

p.title-pacientes {
    color: #05305d;
}

.text-headerv2 {
    font-size: 16px;
}

img.img-metrovirtual {
    width: 160px;
    height: 20px;
}



.border-result {
    border: 1px solid #e6eaee;
    box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
    border-radius: 6px;
    margin-top: 20px !important;
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

.text-icon-color {
    text-align: center;
    color: #05305d;
    font-weight: 600;
    line-height: 18px;
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

.icon-device {
    color: #05305d;
    cursor: pointer;
}

a:hover {
    text-decoration: none;
}



.hover-list-element:hover {
    background-color: rgb(229, 237, 241);
    box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
}

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
