<script setup lang="ts">
definePageMeta({
  middleware: ["setup", "sidebase-auth"],
});
</script>

<template>
  <DiskSpaceCard />
  <VoteResults />
</template>

<style scoped></style>
