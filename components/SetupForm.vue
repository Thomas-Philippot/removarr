<script setup lang="ts">
import AppToast from "~/components/AppToast.vue";

const { data: settings } = useFetch("/api/settings");
const { token } = useAuth();
const { t } = useI18n();

enum ServarrType {
  Radarr = "radarr",
  Sonarr = "sonarr",
}

const currentServarr: Record<number, ServarrType> = {
  1: ServarrType.Radarr,
  2: ServarrType.Sonarr,
};

const step = ref(0);

async function nextStep() {
  try {
    if (step.value === 0 && settings.value) {
      await $fetch("/api/settings/mediaServer", {
        method: "POST",
        body: settings.value.mediaServer,
      });
      if (settings.value.mediaServer.type === "plex") {
        await $fetch("/api/plex/setup", {
          method: "POST",
          body: {
            token: token.value,
          },
        });
      }
    }
    if (step.value > 0) {
      await saveCurrentSettings();
    }
    step.value++;
  } catch (error) {
    showToast("alert alert-error", t("server_connexion_failed"));
    console.log(error);
  }
}

async function saveCurrentSettings() {
  if (!settings.value || step.value === 0) return;
  const currentSetting = settings.value[currentServarr[step.value]];
  if (!currentSetting.hostname || !currentSetting.apiKey) {
    return;
  }
  await $fetch(`/api/settings/${currentServarr[step.value]}`, {
    method: "POST",
    body: settings.value[currentServarr[step.value]],
  });
}

function showToast(type: string, message: string) {
  const { $nt } = useNuxtApp();
  $nt.show(() => h(AppToast, { type, message }));
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
            <span class="step-icon">
              <NuxtImg
                :src="`/images/${settings.mediaServer.type}.svg`"
                alt="media server icon"
                class="p-1"
              /> </span
            >{{ settings.mediaServer.type === "plex" ? "Plex" : "Jellyfin" }}
          </li>
          <li :class="`step ${step > 0 ? 'step-primary' : ''}`">
            <span class="step-icon">
              <NuxtImg
                src="/images/radarr.svg"
                alt="plex logo"
                class="p-1"
              /> </span
            >Radarr
          </li>
          <li :class="`step ${step > 1 ? 'step-primary' : ''}`">
            <span class="step-icon">
              <NuxtImg
                src="/images/sonarr.svg"
                alt="plex logo"
                class="p-1"
              /> </span
            >Sonarr
          </li>
          <li :class="`step ${step > 2 ? 'step-primary' : ''}`">
            <span class="step-icon">🎉</span>{{ $t("done") }}
          </li>
        </ul>
        <div v-if="step === 0">
          <h3 class="text-lg font-bold">{{ $t("configure") }} Media Server</h3>
          <fieldset class="fieldset">
            <label class="label">{{ $t("type") }}</label>
            <select v-model="settings.mediaServer.type" class="select">
              <option value="plex">Plex</option>
              <option value="jellyfin">Jellyfin</option>
            </select>
          </fieldset>
          <div v-if="settings.mediaServer.type === 'plex'">
            <ServarrSettingsForm
              v-model="settings.mediaServer"
              servarr="mediaServer"
              hide-title
              hide-previous-button
              hide-test-button
              no-api-key
              @next="nextStep"
              @previous="step--"
            />
          </div>
          <div v-if="settings.mediaServer.type === 'jellyfin'">
            <ServarrSettingsForm
              v-model="settings.mediaServer"
              servarr="mediaServer"
              hide-title
              hide-previous-button
              ping-url="System/Ping"
              @next="nextStep"
              @previous="step--"
            />
          </div>
        </div>
        <div v-if="step > 0 && step < 3">
          <ServarrSettingsForm
            v-model="settings[currentServarr[step]]"
            :servarr="currentServarr[step]"
            @next="nextStep"
            @previous="step--"
          />
        </div>
        <div
          v-if="step > 2"
          class="flex flex-col items-center justify-center gap-6 py-4"
        >
          <p class="text-2xl font-bold">{{ $t("all_set") }}</p>
          <NuxtImg
            src="/images/party.webp"
            alt="party icon"
            height="150"
            fit="cover"
            loading="lazy"
          />
        </div>
        <div class="flex justify-between">
          <div></div>
          <div class="flex gap-2">
            <button
              v-if="step > 2"
              class="btn btn-soft btn-accent"
              @click="step--"
            >
              {{ $t("previous") }}
            </button>
            <NuxtLink
              v-if="step === 3"
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
