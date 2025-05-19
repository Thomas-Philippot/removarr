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
  <div v-if="status === 'success'" class="flex flex-wrap gap-4 pt-2 pb-6">
    <div
      v-for="item in plexSettings.libraries"
      :key="item.id"
      class="card bg-secondary card-md shadow-sm"
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
        <p>{{ item.path }}</p>
      </div>
    </div>
  </div>
  <button class="btn btn-primary" @click="saveSettings">Sauvegarder</button>
</template>

<style></style>
