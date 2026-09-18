<script setup lang="ts">
import AppToast from "~/components/AppToast.vue";

const emits = defineEmits(["save", "next", "previous"]);

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  modal: {
    type: Boolean,
    default: false,
  },
  hideTitle: {
    type: Boolean,
    default: false,
  },
  hidePreviousButton: {
    type: Boolean,
    default: false,
  },
  hideTestButton: {
    type: Boolean,
    default: false,
  },
  noApiKey: {
    type: Boolean,
    default: false,
  },
  pingUrl: {
    type: String,
    default: "/ping",
  },
  servarr: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();
const settings = reactive(props.modelValue);

async function postData() {
  await saveSettings();
  emits("save");
}

async function saveSettings() {
  await $fetch(`/api/settings/${props.servarr}`, {
    method: "POST",
    body: settings,
  });
}

function showToast(type: string, message: string) {
  const { $nt } = useNuxtApp();
  $nt.show(() => h(AppToast, { type, message }));
}

async function ping() {
  await saveSettings();
  const { error } = await useFetch(`/${props.servarr}/${props.pingUrl}`);
  if (error.value) {
    showToast("alert alert-error", t("server_connexion_failed"));
    return;
  }
  showToast("alert alert-success", t("server_connexion_success"));
}
</script>

<template>
  <h3 v-if="!hideTitle" class="text-lg font-bold">
    {{ $t("edit") }} {{ props.servarr }}
  </h3>
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
        <input v-model="settings.ip" required class="grow" placeholder="" />
      </label>

      <label class="label">{{ $t("port") }}</label>
      <input
        v-model="settings.port"
        type="text"
        class="input w-full"
        placeholder="7878"
      />

      <div v-if="!noApiKey">
        <label class="label">{{ $t("api_key") }}</label>
        <input
          v-model="settings.apiKey"
          type="text"
          class="input w-full"
          placeholder=""
        />
      </div>
    </fieldset>
  </div>
  <div class="modal-action flex justify-between">
    <button
      v-if="!hideTestButton"
      class="btn btn-outline btn-warning"
      @click="ping"
    >
      {{ $t("test") }}
    </button>
    <div v-if="hideTestButton" />
    <div class="flex gap-2">
      <form v-if="props.modal" method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn btn-soft btn-accent">{{ $t("close") }}</button>
      </form>
      <button
        v-else-if="!hidePreviousButton"
        class="btn btn-soft btn-accent"
        @click="emits('previous')"
      >
        {{ $t("previous") }}
      </button>
      <button v-if="props.modal" class="btn btn-primary" @click="postData">
        {{ $t("save") }}
      </button>
      <button v-else class="btn btn-primary" @click="emits('next')">
        {{ $t("next") }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
close
