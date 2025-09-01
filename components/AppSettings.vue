<script setup lang="ts">
const emits = defineEmits(["save"]);

const {
  data: settings,
  status,
  error,
} = await useAsyncData("app-settings", () => $fetch("/api/settings/app"));

async function saveSettings() {
  await $fetch("/api/settings/app", {
    method: "POST",
    body: settings.value,
  });
  emits("save");
}
</script>

<template>
  <div v-if="error">
    Erreur : impossible d'afficher les information de stockage
  </div>
  <div v-if="status === 'pending'">
    <div class="flex w-full md:w-xs flex-col gap-4">
      <div class="skeleton h-4 w-28 mb-2"></div>
      <div class="skeleton h-2 w-28"></div>
      <div class="skeleton h-8 w-full"></div>
      <div class="skeleton h-2 w-full mb-2"></div>
      <div class="skeleton h-10 w-full"></div>
    </div>
  </div>
  <div v-if="settings && status === 'success'">
    <legend class="fieldset-legend">{{ $t("storage") }}</legend>
    <fieldset class="fieldset w-full md:w-xs">
      <label class="label">{{ $t("filtered-directories") }}</label>
      <input
        v-model="settings.storageFilteredPaths"
        type="text"
        placeholder="/config, /tmp"
        class="input w-full"
      />
      <p class="label">{{ $t("filtered-directories-description") }}</p>
      <button class="btn btn-primary mt-4" @click="saveSettings">
        {{ $t("save") }}
      </button>
    </fieldset>
  </div>
</template>

<style scoped></style>
