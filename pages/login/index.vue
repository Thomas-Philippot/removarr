<script setup lang="ts">
definePageMeta({
  layout: "empty",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const error = ref(false);
const tab = ref(0);

const { data: settings, status } = useFetch("/api/settings");

const setup = computed(() => {
  return !settings.value?.mediaServer.auth_token;
});
</script>

<template>
  <BackgroundImages />
  <div class="absolute inset-0 flex justify-center items-center mx-auto">
    <div class="card bg-base-100 p-2 w-1/2">
      <div v-if="error" role="alert" class="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Error! Access Denied.</span>
      </div>
      <div v-if="settings && status === 'success'" class="card-body">
        <h2 class="card-title justify-center">{{ $t("welcome") }}</h2>
        <p class="py-4">{{ $t("start_with") }}</p>
        <div role="tablist" class="tabs tabs-box">
          <a
            role="tab"
            :class="`tab ${tab === 0 ? 'tab-active' : ''}`"
            @click="tab = 0"
            >Plex</a
          >
          <a
            role="tab"
            :class="`tab ${tab === 1 ? 'tab-active' : ''}`"
            @click="tab = 1"
            >Jellyfin</a
          >
        </div>
        <div v-if="tab === 0" class="py-4">
          <PlexLoginButton @error="error = true" />
        </div>
        <div v-if="tab === 1" class="flex flex-col py-4">
          <JellyfinLoginButton
            v-model="settings"
            :setup="setup"
            @error="error = true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
