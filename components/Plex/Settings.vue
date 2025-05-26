<script lang="ts" setup>
const { data: plexSettings, status } = await useFetch(`/api/settings/plex`);

const emit = defineEmits(["save"]);

async function saveSettings() {
  await $fetch("/api/settings/plex", {
    method: "POST",
    body: plexSettings.value,
  });
  emit("save");
}
</script>

<template>
  <div v-if="plexSettings && status === 'success'">
    <div class="py-2">
      <label class="label">
        <span class="text-lg font-bold">{{ $t("libraries_filter") }}</span>
        <input
          v-model="plexSettings.filter"
          type="checkbox"
          class="checkbox checkbox-primary"
        />
      </label>
    </div>
    <div v-if="plexSettings.filter" class="flex flex-wrap gap-4 pt-2 pb-6">
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
    <div v-else class="pt-2 pb-6">
      <div class="card bg-base-300 card-md shadow-sm w-full md:w-auto">
        <div class="card-body">
          <h2 class="card-title">{{ $t("disabled") }}</h2>
          <span class="lowercase"
            >{{ $t("libraries_filter") }} {{ $t("disabled") }}</span
          >
        </div>
      </div>
    </div>
    <div class="flex justify-end md:justify-start">
      <button class="btn btn-primary" @click="saveSettings">
        {{ $t("save") }}
      </button>
    </div>
  </div>
</template>

<style></style>
