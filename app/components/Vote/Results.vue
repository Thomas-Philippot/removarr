<script setup lang="ts">
const { data, status, error } = await useAsyncData(
  "medias",
  async () => {
    const [results, movies, shows, users] = await Promise.all([
      $fetch("/api/votes/results"),
      $fetch("/radarr/api/v3/movie"),
      $fetch("/sonarr/api/v3/series"),
      $fetch("/api/users"),
    ]);
    return {
      results,
      medias: [...movies, ...shows],
      users: users.length,
    };
  },
  { lazy: true },
);
</script>

<template>
  <div class="flex items-center pb-6">
    <div class="prose mr-4">
      <h1>{{ $t("votes") }}</h1>
    </div>
  </div>
  <div v-if="error">
    <ErrorAlert />
  </div>
  <ul v-else-if="data && status === 'success'" class="list">
    <li v-for="item in data.results" :key="item.id">
      <div
        v-if="data.medias.find((x) => x.imdbId == item.mediaId)"
        class="list-row items-center"
      >
        <div class="relative w-18 sm:w-20 md:w-24">
          <NuxtImg
            :src="
              data.medias
                .find((x) => x.imdbId == item.mediaId)
                .images.filter((x) => x.coverType === 'poster')[0].remoteUrl
            "
            loading="lazy"
            alt=""
            class="rounded-box shadow-md"
            custom
          >
            <template #default="{ src, isLoaded, imgAttrs }">
              <img v-if="isLoaded" v-bind="imgAttrs" :src="src" />
              <div v-else class="skeleton w-full h-28 sm:h-30 md:h-36" />
            </template>
          </NuxtImg>
          <div
            v-if="item.users.length === data.users"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div class="text-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-10"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="text-sm md:text-xl md:mb-2 font-semibold">
            {{ data.medias.find((x) => x.imdbId == item.mediaId).title }}
          </div>
          <progress
            :class="`progress w-full sm:w-56 ${item.users.length === data.users ? 'progress-success' : ''}`"
            :value="(item.users.length / data.users) * 100"
            max="100"
          />
          <div class="text-xs uppercase font-semibold opacity-60">
            <span v-if="item.users.length === data.users">
              {{ $t("can_be_removed") }}
            </span>
            <span v-else>
              {{ item.users.length }}
              {{
                item.users.length > 1
                  ? $t("users_wants_to_remove")
                  : $t("user_wants_to_remove")
              }}
            </span>
          </div>
          <div class="avatar-group -space-x-3 md:hidden">
            <div v-for="user in item.users" :key="user.id" class="avatar">
              <div class="size-5 sm:size-8 md:size-12">
                <img :src="user.avatar" />
              </div>
            </div>
          </div>
        </div>
        <div class="avatar-group py-2 -space-x-6 hidden md:block">
          <div v-for="user in item.users" :key="user.id" class="avatar">
            <div class="size-14">
              <img :src="user.avatar" alt="" />
            </div>
          </div>
        </div>
      </div>
    </li>
    <li v-if="data.results.length === 0" class="list-row items-center">
      {{ $t("no_vote_yet") }}
    </li>
  </ul>
  <ul v-else class="list">
    <li v-for="x in 10" :key="x" class="list-row items-center">
      <div class="w-16 h-22 rounded-box shadow-md skeleton" />
      <div class="flex flex-col gap-2">
        <div class="skeleton h-4 w-34"></div>
        <div class="skeleton h-2 w-56"></div>
        <div class="skeleton h-1 w-62"></div>
      </div>
      <div class="avatar-group -space-x-6 h-16">
        <div v-for="i in 3" :key="i" class="avatar">
          <div class="size-16">
            <div class="w-full h-full skeleton" />
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
