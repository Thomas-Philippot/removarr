<script setup lang="ts">
import PlexOAuth from "~/utils/plex";

const plexOAuth = new PlexOAuth();
const { signIn, data } = useAuth();

const emits = defineEmits(["error"]);

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
    emits("error", true);
  }
}
</script>

<template>
  <div class="card-actions justify-center">
    <button class="btn btn-block btn-warning" @click="prepareLogin">
      Plex {{ $t("login") }}
    </button>
  </div>
</template>

<style scoped></style>
