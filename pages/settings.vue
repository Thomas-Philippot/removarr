<script setup lang="ts">
import AppToast from "~/components/AppToast.vue";
const { locales, locale, setLocale } = useI18n();

const { t } = useI18n();
const currentLocal = ref(locale);

function saveSettings() {
  setLocale(currentLocal.value);
  onSettingsSaved();
}

function onSettingsSaved() {
  showToast("alert alert-success", t("settings_saved"));
}

function showToast(type: string, message: string) {
  const { $nt } = useNuxtApp();
  $nt.show(() => h(AppToast, { type, message }));
}
</script>

<template>
  <div class="prose">
    <h1>{{ $t("settings") }}</h1>
  </div>
  <!-- name of each tab group should be unique -->
  <div class="tabs tabs-lift my-4">
    <input
      type="radio"
      name="settings_tabs"
      class="tab"
      :aria-label="$t('main')"
      checked
    />
    <div class="tab-content bg-base-100 border-base-300 p-6">
      <AppSettings @save="onSettingsSaved" />
    </div>

    <input
      type="radio"
      name="settings_tabs"
      class="tab"
      :aria-label="$t('interface')"
    />
    <div class="tab-content bg-base-100 border-base-300 p-6">
      <fieldset class="fieldset w-full md:w-xs">
        <label class="label">{{ $t("language") }}</label>
        <select v-model="currentLocal" class="select w-full">
          <option v-for="item in locales" :key="item.code" :value="item.code">
            {{ item.name }}
          </option>
        </select>
        <button class="btn btn-primary mt-4" @click="saveSettings">
          {{ $t("save") }}
        </button>
      </fieldset>
    </div>
  </div>
  <div class="prose">
    <h2>{{ $t("applications") }}</h2>
    <p>{{ $t("application_settings") }}</p>
  </div>
  <div class="flex flex-wrap gap-6 pb-6">
    <ServarrSettingsForm
      key="sonarr"
      servarr="sonarr"
      @save="onSettingsSaved"
    />
    <ServarrSettingsForm
      key="radarr"
      servarr="radarr"
      @save="onSettingsSaved"
    />
    <ServarrSettingsForm
      key="overseerr"
      servarr="overseerr"
      @save="onSettingsSaved"
    />
  </div>
  <div class="prose">
    <h2>Plex</h2>
    <p>{{ $t("plex_settings") }}</p>
  </div>
  <div class="mb-6">
    <PlexSettings @save="onSettingsSaved" />
  </div>
</template>

<style scoped></style>
