<script setup>
import { ref } from "vue";
const props = defineProps(["url"]);
const src = ref(props.url);
</script>
<template>
  <iframe :src="src" width="100%" height="100%"></iframe>
</template>

<style scoped>
iframe {
  width: 100%;
  min-height: 100%;
}

.share button {
  border: none;
  border-right: 1px solid #d0d4d2;
  color: #6b6969;
}

@media screen and (max-width: 600px) {

}


</style>
