<script setup lang="ts">
definePageMeta({
  layout: "empty",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});
</script>

<template>
  <BackgroundImages />
  <PlexLoginCard />
</template>

<style scoped></style>
