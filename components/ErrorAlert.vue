<script setup lang="ts">
const props = defineProps({
  error: {
    type: Object,
    required: false,
    default: null,
  },
});
</script>

<template>
  <div role="alert" class="alert alert-error alert-soft mt-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="stroke-error h-6 w-6 shrink-0"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
    <div>
      <h3 class="font-bold">{{ $t("media_loading_failed") }}</h3>
      <div v-if="props.error">
        {{ error }}
      </div>
      <div v-else class="text-xs">{{ $t("check_servarr_settings") }}</div>
    </div>
    <NuxtLink as="button" class="btn btn-dash" to="/settings">{{
      $t("settings")
    }}</NuxtLink>
  </div>
</template>

<style scoped></style>
