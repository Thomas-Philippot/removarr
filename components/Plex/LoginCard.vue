<script setup lang="ts">
import PlexOAuth from "~/utils/plex";

const plexOAuth = new PlexOAuth();
const { signIn, data } = useAuth();
const error = ref(false);

function prepareLogin() {
  plexOAuth.preparePopup();
  setTimeout(() => {
    plexLogin();
  }, 1500);
}

async function plexLogin() {
  const authToken = await plexOAuth.login();
  await signIn({ authToken }, { callbackUrl: "/" });
  if (!data.value) {
    error.value = true;
  }
}
</script>

<template>
  <div class="absolute inset-0 flex justify-center items-center">
    <div>
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
      <div class="card bg-base-100 max-w-screen p-2">
        <div class="card-body">
          <h2 class="card-title justify-center">{{ $t("welcome") }}</h2>
          <p class="py-4">{{ $t("start_with") }}</p>
          <div class="card-actions justify-center">
            <button class="btn btn-block btn-warning" @click="prepareLogin">
              {{ $t("login") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
