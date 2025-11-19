<script setup>
import auth from "../services/auth";
import {useAuthStore} from "../stores/auth";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useNotification} from "@kyvg/vue3-notification";
import {event, screenview} from "vue-gtag";

const {notify} = useNotification();
const router = useRouter();

const authStore = useAuthStore();
// const user = computed(() => authStore.user);
let location = ref("login");
let language = ref("es");

// const loginForm = ref({
//     user: null,
//     pass: null
// });


// const login = async () => {
//     console.log('form', loginForm.value);
//     try {
//         location.value = 'loading';
//         const authResponse = await medicAuthLogin(loginForm.value);
//         console.log('authResponseLogin', authResponse);
//         if (authResponse.status) {
//             location.value = 'login';
//             notify({
//                 title: "Credenciales correctas",
//                 text: authResponse.message,
//                 type: 'success'
//             });
//             await authStore.login(authResponse.data.user, 'medic', authResponse.jwt);
//             await router.push({name: 'dashboard'});
//
//         } else {
//             location.value = 'login';
//             notify({
//                 title: "Credenciales invalidas",
//                 text: authResponse.message,
//                 type: 'error'
//             });
//         }
//     } catch (e) {
//       location.value = 'login';
//         console.log('e', e);
//     }
// }
const newLogin = async () => {
  try {
    location.value = "loading";
    console.log("login");
    let response = await auth.login();
    console.log("response", response);
    let userResult = auth.user();
    console.log("userResult", userResult);
    let roles = userResult?.idTokenClaims?.roles;
    if (!roles) {
      notify({
        title: "Usuario incompleto",
        text: "El usuario no ha sido configurado correctamente, contáctese con el administrador del sistema",
        type: "error"
      });
      await authStore.logout();
      return;
    }
    if (roles.length < 1) {
      notify({
        title: "Error",
        text: "Al parecer su perfil necesita una configuración adicional, por favor comuníquese con nuestra mesa de ayuda CONCAS 399 8000",
        type: "error"
      });
      await authStore.logout();
      return;
    }
    let token = await auth.acquireToken();
    await authStore.login(userResult, "medic", token);
    event('login', {
      method: 'AZURE AD'
    });
    await router.push({name: "dashboard"});
  } catch (e) {
    console.log("error in login", e);
    location.value = "login";
    notify({
      title: "Hubo un error",
      text: e.message,
      type: "error"
    });
  }
};
// const forgetUser = async () => {
//     try {
//       await auth.logout();
//     } catch (e) {
//         console.log('e', e);
//       notify({
//         title: "Hubo un error",
//         text: e.message,
//         type: 'error'
//       });
//     }
// }


onMounted(async () => {
  screenview('Ingreso (login)');
});
</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Ingreso - MetroVirtual - Hospital Metropolitano</title>
    </teleport>
    <div class="d-flex flex-column flex-grow-1 justify-content-center align-items-center py-1"
         style="background-color: #f8f9fc;">
      <div class="container m-auto ml-2">
        <div class="row mb-5 mb-md-2 justify-content-center">
          <!--columna de inputs-->
          <form class=" col-12 col-md-7 px-4 mb-0 mb-md-4">
            <div class=" my-4 row">
              <div class="col-md-8 col-lg-6 col-10 mt-4">
                <img class="img-metrovirtualv1" src="@/assets/metrovirtual_logo.svg" alt="Mundometro icon"
                     width="100%" height="auto ">
                <div class="row">
                  <div class="col d-flex pt-2">
                    <img class="icono-user" src="@/assets/icon-medicos.png"
                         alt="Mundometro icon" width="30px" height="28px">
                    <h3 class="text-principal">{{ language === "es" ? "Médicos" : "Medics" }}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-md-10 col-lg-8 gray-color text-gray my-2">
                <h5 class="title-li">
                  <b>{{ language === "es" ? "Aquí encontrarás:" : "Here you will find:" }}</b></h5>
                <ul class="ul-option">
                  <li class="li-option">
                    {{
                      language === "es" ? "Detalle de pacientes hospitalizados a su cargo o como interconsulta" :
                          "Detail of hospitalized patients under your care or as interconsultation"
                    }}
                  </li>
                  <li class="li-option">
                    {{ language === "es" ? "Resultados de imagen y laboratorio" : "Image and lab results" }}
                  </li>
                  <li class="li-option">
                    {{ language === "es" ? "Módulo de honorarios" : "Fees module" }}
                  </li>
                </ul>
              </div>
            </div>
            <template v-if="location === 'loading'">
              <div class="col-12 col-md-7 col-lg-6 row justify-content-center">
                <img class="loading-gif" src="@/assets/loading.gif"
                     alt="Loading Hm">
              </div>
            </template>
            <template v-if="location === 'login'">

              <div class="form-group my-2">
                <div class="row no-gutters no-margin">
                  <div class="col-12 col-md-7 col-lg-7 mt-2">
                    <button class="text-center cursor-pointer pt-2 my-2 btn-loginv3"
                            @click="newLogin()">
                      <img class="icono-user mt-1" src="@/assets/MICROSOFT.png"
                           alt="microsift icon" width="30px" height="28px">
                      {{ language === "es" ? "Ingreso seguro" : "Log In" }}
                    </button>
                    <p class="span-text mt-4">
                      Ingrese con el usuario proporcionado por el hospital seguido de @hmetro.med.ec <br>
                      Su contraseña es la misma proporcionada por el hospital.<br>
                      Ej: Si su usario es pperez ustede deberá ingresar pperez@hmetro.med.ec
                    </p>
                    <p class="span-text mb-4 mt-2" style="color: red;">Si tiene algún inconveniente comuníquese al
                      <a target="_blank" href="tel:023998000">02 399 8000</a> ext 2020 </p>
                  </div>
                  <div class="col-3 col-lg-2">
                  </div>
                </div>
              </div>
              <div class="row my-1 mt-4">
                <div class="col-12 col-md-7">
                  <p class="text-center my-2">
                    <b>disponible en:</b>
                  </p>
                  <div class="row">
                    <div class="col-6">
                      <a class="d-flex justify-content-center cursor-pointer"
                         href="https://play.google.com/store/apps/details?id=com.metrovirtual.medics" target="_blank">
                        <img src="@/assets/google_play.png" alt="Mundometro icon"
                             width="100%" height="auto ">
                      </a>
                    </div>
                    <div class="col-6">
                      <a class="d-flex justify-content-center cursor-pointer"
                         href="https://apps.apple.com/us/app/metrovirtual-m%C3%A9dicos/id6449236699" target="_blank">
                        <img src="@/assets/app_store.png" alt="Mundometro icon"
                             width="100%" height="auto ">
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </template>


          </form>
          <!--columna de iframe-->
          <div class="col-12 col-md-5 mb-md-4">
            <div class="px-2 mt-5 pt-8">
              <iframe width="100%" height="300" src="https://www.youtube.com/embed/t0zKd0QUxyY?controls=0"
                      title="MetroVirtual" frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowfullscreen></iframe>
              <p style="text-align: center;">¿Qué es MetroVirtual médicos?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-4 mb-md-2 justify-content-center  pb-5 mt-5 my-5">
      <!--columna de text-->
      <div class=" col-12 col-md-4">
        <div class="row mt-2 mt-md-5 justify-content-center">
          <a href="https://www.hospitalmetropolitano.org/es/terminos-condiciones-y-uso-de-medios" target="_blank">
            <h5 class="title-terminos">
              Términos y Condiciones
            </h5>
          </a>
        </div>
      </div>
      <div class=" col-12 col-md-4">
        <div class="row mt-2 mt-md-5 justify-content-center">
          <a href="https://www.hospitalmetropolitano.org/es/politicas-de-privacidad" target="_blank">
            <h5 class="title-terminos">
              Políticas de Privacidad
            </h5>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>


.title-li {
  color: #05305d;
  font-size: 16px
}

ul.ul-option li {
  color: #6b6969;
}

iframe {
  border-radius: 15px;
}

p.services-text {
  font-size: 20px;
  color: #2392da;
  font-weight: 600;
}

.text-reset-password {
  font-size: 13px;
  color: #0d9cde;
}

img.icono-user {
  margin-top: 5px;
  width: 30px;
  height: 28px;
  margin-right: 1rem;
}


/*Icons style*/

h3.text-principal {
  padding-top: 12px;
  color: #14437a;
  letter-spacing: 1px;
  font-size: 22px;

}

.loading-gif {
  width: 150px;
  height: auto;
}

input.form-control {
  height: 50px;
  margin-bottom: 10px !important;
  box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
  background: white;
  padding: 22px 22px 22px 22px !important;
  border: 1px solid #e6eaee;
}


.text-search span {
  color: #1d74d4;
  font-size: 1.8rem;
  font-weight: 600;
}


input.search {
  height: 55px;
  width: 100%;
  border-radius: 20px;
  border: 2px solid #989899;
}

img.icono-user {
  margin-top: 5px;
}

.row.d-block:hover {
  background: linear-gradient(90deg, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 100%) !important;
  transition: all .30s linear;
}

.btn-loginv2 {
  background: linear-gradient(90deg, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 100%) !important;
  border-radius: 0 50px 50px 0 !important;
  min-width: 100%;
  height: 50px;
  padding: 15px 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  transition: all .30s linear;
}


.btn-loginv3 {
  background: linear-gradient(90deg, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 100%) !important;
  border-radius: 50px;
  min-width: 100%;
  height: 50px;
  padding: 15px 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  transition: all .30s linear;
}

.btn-full-loginv2 {
  background: linear-gradient(90deg, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 100%) !important;
  border-radius: 50px;
  min-width: 100%;
  height: 50px;
  padding: 15px 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  transition: all .30s linear;
}

.btn-loginv2:hover {
  background: linear-gradient(90deg, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 100%) !important;
  transition: all .30s linear;
}

.btn-full-loginv2:hover {
  background: linear-gradient(90deg, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 100%) !important;
  transition: all .30s linear;
}

.left-button {
  background-color: #989899;
  border-radius: 50px;
  min-width: 100%;
  height: 50px;
  padding: 0px 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  transition: all .30s linear;
}

.left-button-full {
  background-color: #989899;
  border-radius: 50px;
  height: 50px;
  padding: 15px 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  transition: all .30s linear;
}

input.special {
  border-radius: 30px 0px 0px 30px;
}


</style>
