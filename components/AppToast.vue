<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: "success",
  },
  message: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div :class="`${props.type}`">
    <span>{{ props.message }}</span>
  </div>
</template>

<style scoped></style>
