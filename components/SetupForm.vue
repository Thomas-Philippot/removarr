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
      await $fetch("/api/settings/plex", {
        method: "POST",
        body: settings.value.plex,
      });
      await $fetch("/api/plex/setup", {
        method: "POST",
        body: {
          token: token.value,
        },
      });
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
  if (!settings.value) return;
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

async function ping() {
  await saveCurrentSettings();
  const { error } = await useFetch(`/${currentServarr[step.value]}/ping`);
  if (error.value) {
    showToast("alert alert-error", t("server_connexion_failed"));
    return;
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
            <span class="step-icon">
              <NuxtImg
                src="/images/plex.svg"
                alt="plex logo"
                class="p-1"
              /> </span
            >Plex
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
          <h3 class="text-lg font-bold">{{ $t("configure") }} Plex</h3>
          <div role="tablist" class="tabs tabs-border mt-6 mb-2">
            <a
              role="tab"
              :class="`tab ${settings.plex.mode === 'ip' ? 'tab-active' : ''}`"
              @click="settings.plex.mode = 'ip'"
            >
              {{ $t("ip") }} / {{ $t("port") }}
            </a>
            <a
              role="tab"
              :class="`tab ${settings.plex.mode === 'hostname' ? 'tab-active' : ''}`"
              @click="settings.plex.mode = 'hostname'"
            >
              {{ $t("hostname") }}
            </a>
          </div>
          <div v-if="settings.plex.mode === 'hostname'">
            <fieldset class="fieldset">
              <label class="label">{{ $t("hostname") }}</label>
              <label class="input validator w-full">
                <select v-model="settings.plex.schema">
                  <option value="https://">Https://</option>
                  <option value="http://">Http://</option>
                </select>
                <input
                  v-model="settings.plex.hostname"
                  required
                  class="grow"
                  placeholder=""
                />
              </label>
            </fieldset>
          </div>
          <div v-else>
            <fieldset class="fieldset">
              <label class="label">{{ $t("ip") }}</label>
              <label class="input validator w-full">
                <select v-model="settings.plex.schema">
                  <option value="https://">Https://</option>
                  <option value="http://">Http://</option>
                </select>
                <input
                  v-model="settings.plex.ip"
                  required
                  class="grow"
                  placeholder=""
                />
              </label>
              <label class="label">{{ $t("port") }}</label>
              <input
                v-model="settings.plex.port"
                required
                minlength="2"
                type="text"
                class="input validator w-full"
                placeholder="32400"
              />
            </fieldset>
          </div>
        </div>
        <div v-if="step > 0 && step < 3">
          <h3 class="text-lg font-bold">
            {{ $t("configure") }} {{ currentServarr[step] }} {{ $t("server") }}
          </h3>
          <div role="tablist" class="tabs tabs-border mt-6 mb-2">
            <a
              role="tab"
              :class="`tab ${settings[currentServarr[step]].mode === 'ip' ? 'tab-active' : ''}`"
              @click="settings[currentServarr[step]].mode = 'ip'"
            >
              {{ $t("ip") }} / {{ $t("port") }}
            </a>
            <a
              role="tab"
              :class="`tab ${settings[currentServarr[step]].mode === 'hostname' ? 'tab-active' : ''}`"
              @click="settings[currentServarr[step]].mode = 'hostname'"
            >
              {{ $t("hostname") }}
            </a>
          </div>
          <div v-if="settings[currentServarr[step]].mode === 'hostname'">
            <fieldset class="fieldset">
              <label class="label">{{ $t("hostname") }}</label>
              <label class="input validator w-full">
                <select v-model="settings[currentServarr[step]].schema">
                  <option value="https://">Https://</option>
                  <option value="http://">Http://</option>
                </select>
                <input
                  v-model="settings[currentServarr[step]].hostname"
                  required
                  class="grow"
                  placeholder=""
                />
              </label>

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
          <div v-else>
            <fieldset class="fieldset">
              <label class="label">{{ $t("ip") }}</label>
              <label class="input validator w-full">
                <select v-model="settings[currentServarr[step]].schema">
                  <option value="https://">Https://</option>
                  <option value="http://">Http://</option>
                </select>
                <input
                  v-model="settings[currentServarr[step]].ip"
                  required
                  class="grow"
                  placeholder=""
                />
              </label>

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
          <div>
            <button
              v-if="step > 0 && step < 3"
              class="btn btn-outline btn-warning"
              @click="ping"
            >
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
            <button v-if="step < 3" class="btn btn-primary" @click="nextStep">
              {{ $t("next") }}
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
