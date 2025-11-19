<script setup>

// import {useAuthStore} from "../stores/auth";
// import {useMyInvoicesStore} from "../stores/myInvoices";
// import {computed, onMounted} from "vue";
// import {useRoute, useRouter} from "vue-router";
//
// import FooterPaciente from "../components/FooterPaciente";
//
// const authStore = useAuthStore();
// const user = computed(() => authStore.user);
// const type = computed(() => authStore.type);
// const myInvoicesStore = useMyInvoicesStore();
// const invoices = computed(() => myInvoicesStore.invoices);
//
// const route = useRoute();
// const router = useRouter();
//
// const goBack = () => {
//     router.push({name: 'dashboard'});
// };
// // const items = computed(() => searchStore.items);
// // const itemsCount = computed(() => searchStore.itemsCount);
//
// onMounted(async () => {
//     await myInvoicesStore.getInvoices();
// });
</script>
<template>
    <div>
        <div class="justify-content-center py-1" style="background-color: rgb(229 237 241);">
            <!--login section-->
            <div class="container m-auto d-block">
                <div class="row mb-2  mt-2 justify-content-center">
                    <!--columna de text-->
                    <div class=" col-6 " @click="goBack()">
                        <div class="row mt-3">
                            <h5 class="cursor-pointer ml-3" style=" color: #0f4470; font-size: 16px;">
                                <i class="fas fa-chevron-left"></i>
                                Regresar
                            </h5>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="d-block py-1">
                            <div class="row d-flex justify-content-end">
                                <div class="img-div">
                                    <img class="img-metrovirtual" src="@/assets/metrovirtual_logo.svg" alt="Mundometro icon"
                                         width="100%" height="auto ">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
            <div class="container m-auto d-block " style="background: #f8f9fc;">
                <div class="row mt-5">
                    <div class="d-block py-1">
                        <div class="row d-flex justify-content-end">
                            <div class="img-div">
                                <img class="img-header-icon ml-3" src="@/assets/buzon.png" alt=" icon">
                            </div>
                            <br>
                            <h4 class="d-flex text-headerv2 mt-3"
                                style="text-align:center; color: #05305d;font-weight: 600;">
                                Buzón de sugerencias
                            </h4>

                        </div>
                    </div>

                </div>
                <div class="row my-2 pb-5 pt-2 justify-content-center">
                    <div class="col-md-6 col-12">
                        <h5 class="text-center text-agendar my-4 mx-5">
                            Déjanos tus comentarios y sugerencias, pronto un asesor se contactará contigo
                        </h5>
                    </div>
                    <div class="col-md-6 col-12">
                        <div class="form-group my-2 ">
                            <div class="row no-gutters no-margin">
                                <div class="col-12">
                                    <input type="text"
                                           class="m-0 p-2 form-control"
                                           focus="vm.focus.document"
                                           required
                                           placeholder="Ingresa tu nombre y apellido">
                                </div>
                            </div>
                        </div>
                        <div class="form-group my-2 ">
                            <div class="row no-gutters no-margin">
                                <div class="col-12">
                                    <input type="text"
                                           class="m-0 p-2 form-control"
                                           focus="vm.focus.document"
                                           required
                                           placeholder="Ingresa tu dirección de correo electrónico">
                                </div>
                            </div>
                        </div>
                        <div class="form-group my-2">
                            <div class="row no-gutters no-margin">
                                <div class="col-12">
                                    <input type="tel"

                                           class="m-0 p-2 form-control"
                                           focus="vm.focus.PASS"
                                           required
                                           placeholder="Ingresa tu teléfono">
                                </div>
                            </div>
                        </div>
                        <div class="form-group my-2 ">
                            <div class="row no-gutters no-margin">
                                <div class="col-12">
                                    <textarea class="m-0 p-2 form-control" required
                                              placeholder="Ingresa tu comentario"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="row my-1">
                            <div class="col-12">
                                <button class="text-center recover-password cursor-pointer mr-4 btn-loginv3"
                                        translate>
                                    Enviar sugerencia
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <FooterPaciente/>
            </div>

        </div>
    </div>
</template>

<style scoped>

textarea.form-control {
    margin-bottom: 10px !important;
    box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
    background: white;
    padding: 22px 22px 22px 22px !important;
    border: 1px solid #e6eaee;
}

.text-headerv2 {
    font-size: 16px;
}



img.img-metrovirtual {
    width: 160px;
    height: 20px;
}

.btn-loginv3 {
    background: linear-gradient(90deg, rgba(11,114,216,1) 0%, rgba(42,157,255,1) 0%, rgba(11,114,216,1) 100%) !important;
    width: 100%;
    color: #fff;
    padding: 9px 20px;
    min-width: 100%;
    text-align: center;
    border-radius: 20px;
    border: none;
}




input.form-control {
    height: 50px;
    margin-bottom: 10px !important;
    box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
    background: white;
    padding: 22px 22px 22px 22px !important;
    border: 1px solid #e6eaee;
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
    background: #0B72D8 !important;
}

.text-icon-color {
    text-align: center;
    color: #05305d;
    font-weight: 600;
    line-height: 18px;
}

a:hover {
    text-decoration: none;
}


</style>
