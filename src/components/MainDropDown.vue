<script setup>
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";
import MainMenu from "@/components/MainMenu.vue";

const authStore = useAuthStore();
const user = computed(() => authStore.user);

</script>

<template>
  <div class="d-flex">
    <p class="text-white d-none d-md-block my-2 mx-3">Servicios Virtuales</p>
    <div class="dropdown">
      <button class="btn-header mx-2 p-3 px-2 px-md-5 py-md-2 text-white d-flex justify-content-center"
              type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
        <img class="icon icon--small mx-3 my-2 d-block "
             src="@/assets/icon-medicos-blanco.png" width="28"
             alt="perfil">
        <span class="text-white d-none d-md-block  mx-1 my-2">{{ user ? "Dr. " + user.name : "Médicos" }}</span>
        <font-awesome-icon class="icon icon--small mx-2 my-2 ms-4 d-block d-md-none" :icon="['fas', 'bars']"
                           style="width: 28px; height: 28px;"/>
        <font-awesome-icon class="icon icon--small mx-2 my-2 d-none d-md-block" :icon="['fas', 'chevron-down']"
                           style="width: 22px; height: 22px;"/>
        <!--        <span class="text-white d-none d-md-block">{{ user ? 'Dr. ' + user.name : 'MÉDICOS' }}</span>-->
      </button>
      <ul class="dropdown-menu p-2" aria-labelledby="dropdownMenuButton">
        <main-menu />
      </ul>
    </div>
  </div>
</template>

<style scoped>

.dropdown-toggle::after {
  margin-left: 1.5rem;
  margin-top: 0.5rem;
}

.btn-header {
  background: #0d2c65;
  border-radius: 15px;
  border:none;
}

.dropdown-menu {
  min-width: 15vw;
  border-radius: 15px;

}


@media (max-width: 600px) {
  .dropdown-menu {
    width: 280px;
  }
  .btn-header {
    background: #259ddb !important;
  }

}
</style>
