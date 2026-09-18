<script setup lang="ts">
const { data: backdrops, status } = useFetch("/api/imdb/backdrops");

const activeIndex = ref(0);
let interval = null;

onMounted(() => {
  interval = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % backdrops.value.length;
  }, 5000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="absolute-top-shift absolute inset-0 bg-cover bg-center">
    <img
      v-if="status === 'success'"
      :src="backdrops[activeIndex]"
      alt=""
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div
      class="absolute inset-0"
      style="
        background-image: linear-gradient(
          180deg,
          rgba(45, 55, 72, 0.47) 0%,
          #1a202e 100%
        );
      "
    />
  </div>
</template>

<style scoped></style>
