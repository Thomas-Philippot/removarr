<script setup lang="ts">
import AppToast from "~/components/AppToast.vue";

const { data: settings } = useFetch("/api/settings");
const { t } = useI18n();

enum ServarrType {
  Radarr = "radarr",
  Sonarr = "sonarr",
}

const currentServarr: ServarrType[] = [ServarrType.Radarr, ServarrType.Sonarr];

const step = ref(0);

async function nextStep() {
  if (!settings.value) {
    return;
  }
  const currentSetting = settings.value[currentServarr[step.value]];
  if (!currentSetting.hostname || !currentSetting.apiKey) {
    return;
  }
  await $fetch(`/api/settings/${currentServarr[step.value]}`, {
    method: "POST",
    body: settings.value[currentServarr[step.value]],
  });
  step.value++;
}

function showToast(type: string, message: string) {
  const { $nt } = useNuxtApp();
  $nt.show(() => h(AppToast, { type, message }));
}

async function ping() {
  const { error } = await useFetch(`/${currentServarr[step.value]}/ping`);
  if (error.value) {
    showToast("alert alert-error", t("server_connexion_failed"));
  }
  showToast("alert alert-success", t("server_connexion_success"));
}
</script>

<template>
  <div class="absolute inset-0 flex justify-center items-center">
    <div
      class="bg-base-200 rounded-box mx-6 lg:mx-0 w-full md:w-2/3 2xl:w-1/3 px-6 py-8"
    >
      <div v-if="settings" class="flex flex-col gap-6">
        <ul class="steps pt-2">
          <li :class="`step ${step >= 0 ? 'step-primary' : ''}`">
            <span class="step-icon">🍿</span>{{ $t("step") }} 1
          </li>
          <li :class="`step ${step > 0 ? 'step-primary' : ''}`">
            <span class="step-icon">📺</span>{{ $t("step") }} 2
          </li>
          <li :class="`step ${step > 1 ? 'step-primary' : ''}`">
            <span class="step-icon">🎉</span>{{ $t("step") }} 3
          </li>
        </ul>
        <div v-if="step < 2">
          <h3 class="text-lg font-bold">
            {{ $t("configure") }} {{ currentServarr[step] }} {{ $t("server") }}
          </h3>
          <fieldset class="fieldset mt-6">
            <legend class="label">{{ $t("hostname") }}</legend>
            <input
              v-model="settings[currentServarr[step]].hostname"
              required
              class="input validator w-full"
              placeholder="http://radarr.mydomain.com"
            />

            <label class="label">{{ $t("port") }}</label>
            <input
              v-model="settings[currentServarr[step]].port"
              required
              minlength="2"
              type="text"
              class="input validator w-full"
              placeholder="7878"
            />

            <label class="label">{{ $t("api_key") }}</label>
            <input
              v-model="settings[currentServarr[step]].apiKey"
              required
              type="text"
              class="input validator w-full"
              placeholder=""
            />
          </fieldset>
        </div>
        <div
          v-else
          class="flex flex-col items-center justify-center gap-6 py-4"
        >
          <p class="text-2xl font-bold">{{ $t("all_set") }}</p>
          <img src="/assets/party.webp" alt="party icon" class="h-56" />
        </div>
        <div class="flex justify-between">
          <div>
            <button class="btn btn-outline btn-warning" @click="ping">
              {{ $t("test") }}
            </button>
          </div>
          <div class="flex gap-2">
            <button
              v-if="step > 0"
              class="btn btn-soft btn-accent"
              @click="step--"
            >
              {{ $t("previous") }}
            </button>
            <button v-if="step < 2" class="btn btn-primary" @click="nextStep">
              {{ $t("next") }}
            </button>
            <NuxtLink
              v-if="step === 2"
              as="button"
              class="btn btn-primary"
              to="/"
              >{{ $t("done") }}</NuxtLink
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
