<script lang="ts" setup>
const { data: plexSettings, status } = await useFetch(`/api/settings/plex`);

async function saveSettings() {
  await $fetch("/api/settings/plex", {
    method: "POST",
    body: plexSettings.value,
  });
}
</script>

<template>
  <div
    v-if="plexSettings && status === 'success'"
    class="flex flex-wrap gap-4 pt-2 pb-6"
  >
    <div
      v-for="item in plexSettings.libraries"
      :key="item.id"
      class="card bg-secondary card-md shadow-sm w-full md:w-auto"
    >
      <div class="card-body">
        <h2 class="card-title flex items-center justify-between">
          {{ item.name }}
          <input
            v-model="item.enabled"
            type="checkbox"
            class="toggle toggle-accent"
          />
        </h2>
        <p class="truncate">{{ item.path }}</p>
      </div>
    </div>
  </div>
  <div class="flex justify-end md:justify-start">
    <button class="btn btn-primary" @click="saveSettings">
      {{ $t("save") }}
    </button>
  </div>
</template>

<style></style>
