<script setup lang="ts">
const { data: results, error } = useFetch("/api/votes/results");

const { data: users } = useFetch("/api/users");

const { data: medias } = await useAsyncData(
  "movies",
  async () => {
    const movies = await $fetch("/radarr/api/v3/movie");
    const shows = await $fetch("/sonarr/api/v3/series");
    return [...movies, ...shows];
  },
  { lazy: true },
);
</script>

<template>
  <div v-if="error">
    {{ error }}
  </div>
  <ul class="list bg-base-100 rounded-box shadow-md">
    <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">Votes recents</li>

    <li v-for="(item, id) in results" :key="id" class="list-row items-center">
      <div>
        <img
          class="w-16 rounded-box shadow-md"
          :src="
            medias
              .find((x) => x.id == item.mediaId)
              .images.filter((x) => x.coverType === 'poster')[0].remoteUrl
          "
        />
      </div>
      <div>
        <div>{{ medias.find((x) => x.id == item.mediaId).title }}</div>
        <progress
          :class="`progress w-56 ${item.users.length === users.length ? 'progress-success' : ''}`"
          :value="(item.users.length / users.length) * 100"
          max="100"
        />
        <div class="text-xs uppercase font-semibold opacity-60">
          {{ item.users.length }} utilisateurs souhaite le supprimer
        </div>
      </div>
      <div class="avatar-group -space-x-6 h-16">
        <div v-for="user in item.users" :key="user.id" class="avatar">
          <div class="size-16">
            <img :src="user.avatar" alt="user-avatar" />
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
