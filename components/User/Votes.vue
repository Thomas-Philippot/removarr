<script setup lang="ts">
import type { Vote } from "~/server/database/schema";

const { data, status, error } = useAsyncData(
  "user_votes",
  async () => {
    const { data: user } = useAuth();
    if (!user) return [];
    const [votes, movies, shows] = await Promise.all([
      $fetch(`/api/votes/user/${user.value?.id}`),
      $fetch("/radarr/api/v3/movie"),
      $fetch("/sonarr/api/v3/series"),
    ]);
    return {
      votes,
      medias: [...movies, ...shows],
    };
  },
  { lazy: true },
);

async function deleteVote(vote: Vote) {
  await $fetch(`/api/votes/media/${vote.mediaId}/${vote.userId}`, {
    method: "DELETE",
  });
  const index = data.value.votes.indexOf(vote);
  data.value.votes.splice(index, 1);
}
</script>

<template>
  <div v-if="error">Error</div>
  <div v-if="status === 'success'">
    <ul class="list">
      <li v-for="(item, id) in data.votes" :key="id">
        <div class="list-row items-center">
          <NuxtImg
            v-if="data.medias.find((x) => x.imdbId == item.mediaId)"
            :src="
              data.medias
                .find((x) => x.imdbId == item.mediaId)
                .images.filter((x) => x.coverType === 'poster')[0].remoteUrl
            "
            :alt="`${item.mediaId}`"
            class="rounded-md aspect-2/3 w-18 sm:w-20 md:w-24"
            loading="lazy"
            custom
          >
            <template #default="{ src, isLoaded, imgAttrs }">
              <img v-if="isLoaded" v-bind="imgAttrs" :src="src" alt="" />
              <div v-else class="skeleton" v-bind="imgAttrs" />
            </template>
          </NuxtImg>
          <div v-else>
            <div class="rounded-md aspect-2/3 w-18 sm:w-20 md:w-24 skeleton" />
          </div>
          <div class="flex items-center">
            <div
              v-if="data.medias.find((x) => x.imdbId == item.mediaId)"
              class="text-sm md:text-xl md:mb-2 font-semibold"
            >
              {{ data.medias.find((x) => x.imdbId == item.mediaId).title }}
            </div>
            <div v-else>Media Supprimer</div>
          </div>
          <div class="flex items-center">
            <button class="btn btn-ghost" @click="deleteVote(item)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div v-if="status === 'pending'">Loading</div>
</template>

<style scoped></style>
