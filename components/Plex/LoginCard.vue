<script setup lang="ts">
import PlexOAuth from "~/utils/plex";

const plexOAuth = new PlexOAuth();
const { signIn } = useAuth();

function prepareLogin() {
  plexOAuth.preparePopup();
  setTimeout(() => {
    plexLogin();
  }, 1500);
}

async function plexLogin() {
  try {
    const authToken = await plexOAuth.login();

    await signIn({ authToken }, { callbackUrl: "/" });
  } catch (e) {
    console.log(e);
  }
}
</script>

<template>
  <div class="absolute inset-0 flex justify-center items-center">
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
</template>

<style scoped></style>
