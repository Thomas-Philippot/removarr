<script setup lang="ts">
import AppToast from "~/components/AppToast.vue";
import type { DVRSettings } from "~/server/repository/settingRepository";

const props = defineProps({
  servarr: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(["save"]);

const { t } = useI18n();
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
}

async function saveSettings() {
  await $fetch(`/api/settings/${props.servarr}`, {
    method: "POST",
    body: settings.value,
  });
  emits("save");
}

function showToast(type: string, message: string) {
  const { $nt } = useNuxtApp();
  $nt.show(() => h(AppToast, { type, message }));
}

async function ping() {
  await saveSettings();
  const { error } = await useFetch(`/${props.servarr}/ping`);
  if (error.value) {
    showToast("alert alert-error", t("server_connexion_failed"));
    return;
  }
  showToast("alert alert-success", t("server_connexion_success"));
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
        <h3 class="text-lg font-bold">{{ $t("edit") }} {{ props.servarr }}</h3>
        <div role="tablist" class="tabs tabs-border mt-6 mb-2">
          <a
            role="tab"
            :class="`tab ${settings.mode === 'ip' ? 'tab-active' : ''}`"
            @click="settings.mode = 'ip'"
          >
            {{ $t("ip") }} / {{ $t("port") }}
          </a>
          <a
            role="tab"
            :class="`tab ${settings.mode === 'hostname' ? 'tab-active' : ''}`"
            @click="settings.mode = 'hostname'"
          >
            {{ $t("hostname") }}
          </a>
        </div>
        <div v-if="settings.mode === 'hostname'">
          <fieldset class="fieldset mt-6">
            <label class="label">{{ $t("hostname") }}</label>
            <label class="input validator w-full">
              <select v-model="settings.schema">
                <option value="https://">Https://</option>
                <option value="http://">Http://</option>
              </select>
              <input
                v-model="settings.hostname"
                required
                class="grow"
                placeholder=""
              />
            </label>

            <label class="label">{{ $t("api_key") }}</label>
            <input
              v-model="settings.apiKey"
              type="text"
              class="input w-full"
              placeholder=""
            />
          </fieldset>
        </div>
        <div v-else>
          <fieldset class="fieldset">
            <label class="label">{{ $t("ip") }}</label>
            <label class="input validator w-full">
              <select v-model="settings.schema">
                <option value="https://">Https://</option>
                <option value="http://">Http://</option>
              </select>
              <input
                v-model="settings.ip"
                required
                class="grow"
                placeholder=""
              />
            </label>

            <label class="label">{{ $t("port") }}</label>
            <input
              v-model="settings.port"
              type="text"
              class="input w-full"
              placeholder="7878"
            />

            <label class="label">{{ $t("api_key") }}</label>
            <input
              v-model="settings.apiKey"
              type="text"
              class="input w-full"
              placeholder=""
            />
          </fieldset>
        </div>
        <div class="modal-action flex justify-between">
          <button class="btn btn-outline btn-warning" @click="ping">
            {{ $t("test") }}
          </button>
          <div class="flex gap-2">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn btn-soft btn-accent">{{ $t("close") }}</button>
            </form>
            <button class="btn btn-primary" @click="postData">
              {{ $t("save") }}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped></style>
