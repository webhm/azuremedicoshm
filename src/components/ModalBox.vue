<script setup>
import { computed, watch } from "vue";

const props = defineProps(["showing"]);
const showing = computed(() => props.showing);
const emit = defineEmits(['close']);
console.log("showing", showing.value);

watch(showing, (value) => {
  console.log("value", value);
  if (value) {
    return document.querySelector("body").classList.add("overflow-hidden");
  }
  return document.querySelector("body").classList.remove("overflow-hidden");
});
const close = () => {
  emit("close");
};
</script>
<template>
  <Transition name="fade">
    <div v-if="showing"
         class="backdrop d-flex justify-content-center">
      <div class="modal-content-hm p-8 my-auto">
        <slot />
      </div>
    </div>
  </Transition>
</template>


<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);

}

.modal-content-hm {
  position: relative;
  background-color: #f8f9fc;
  overflow-y: auto;
  border-radius: 20px;
  border: black 1px solid;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  max-width: 90rem;
  width: 100%;
  max-height: 70%;
  z-index: 99999;
}

.close-modal {
  position: absolute;
  top: 0;
  right: 0;
  color: black;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
