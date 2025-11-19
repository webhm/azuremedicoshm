<script setup>
import MainDropDown from "@/components/MainDropDown.vue";
import {useRouter} from "vue-router/dist/vue-router";
const router = useRouter();
const goTo = async (name) => {
  await router.push({ name: name });

};
</script>
<template>
  <header>
    <div class=" top-header">
      <div class="container py-1 d-flex justify-content-between">
        <div class="p-3 px-2 main-image my-2 my-md-0 cursor-pointer" @click="goTo('dashboard')">
          <img src="../assets/logo-metro.png" style="width: 100%" alt="MetroVirtual">
        </div>
        <div class="p-2 px-1">
          <main-drop-down></main-drop-down>
        </div>
      </div>
    </div>
  </header>
</template>


<style scoped>
.top-header {
  background-color: #0d9cde;
}

.main-image {
  width: 25%;
}

.bottom-header {
  background-color: #0d92dd;
  min-height: 20px;
}

@media screen and (max-width: 600px) {
  .main-image {
    width: 55%;
  }
}
</style>