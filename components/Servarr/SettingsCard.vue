<script setup lang="ts">
import type { DVRSettings } from "~/server/repository/settingRepository";

const emits = defineEmits(["save"]);

const props = defineProps({
  servarr: {
    type: String,
    required: true,
  },
});

const { data: settings } = useFetch<DVRSettings>(
  `/api/settings/${props.servarr}`,
);

function openModal() {
  const modal = document.getElementById(`${props.servarr}_modal`);
  modal?.showModal();
}

async function postData() {
  await saveSettings();
  const modal = document.getElementById(`${props.servarr}_modal`);
  modal?.close();
  emits("save");
}

async function saveSettings() {
  await $fetch(`/api/settings/${props.servarr}`, {
    method: "POST",
    body: settings.value,
  });
}
</script>

<template>
  <div v-if="settings" class="w-full sm:w-auto">
    <div class="flex gap-4 my-4 shrink">
      <div class="card bg-base-200 w-full md:w-80 ring-1">
        <div class="card-body">
          <h2 class="card-title">{{ props.servarr }}</h2>
          <p class="text-sm truncate">
            <span class="mr-2 font-bold">{{ $t("hostname") }}</span>
            {{ settings.hostname }}
          </p>
          <p class="text-sm">
            <span class="mr-2 font-bold">{{ $t("port") }}</span>
            {{ settings.port }}
          </p>
          <div class="card-actions justify-end">
            <button class="btn btn-soft btn-accent" @click="openModal">
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>
    <dialog :id="`${props.servarr}_modal`" class="modal">
      <div class="modal-box">
        <ServarrSettingsForm
          v-model="settings"
          :servarr="props.servarr"
          modal
          @save="postData"
        />
      </div>
    </dialog>
  </div>
</template>

<style scoped></style>
