<script setup lang="ts">
definePageMeta({
  middleware: ["setup", "sidebase-auth"],
});

const { data: users, status: userStatus } = useFetch("/api/users");

const {
  data,
  status: mediaStatus,
  error,
} = await useAsyncData(
  "medias",
  async () => {
    const [results, movies, shows] = await Promise.all([
      $fetch("/api/votes/results"),
      $fetch("/radarr/api/v3/movie"),
      $fetch("/sonarr/api/v3/series"),
    ]);
    return { results, medias: [...movies, ...shows] };
  },
  { lazy: true },
);
</script>

<template>
  <div class="flex items-center pb-6">
    <div class="prose mr-4">
      <h1>Votes</h1>
    </div>
  </div>
  <div v-if="error">
    <ErrorAlert />
  </div>
  <div v-else-if="userStatus === 'success' && mediaStatus === 'success'">
    <VoteResults :data="data" :users="users.length" />
  </div>
  <div v-else>
    <VoteResultsLoader />
  </div>
</template>

<style scoped></style>
