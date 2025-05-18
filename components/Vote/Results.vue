<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <ul class="list">
    <li
      v-for="item in props.data.results"
      :key="item.id"
      class="list-row items-center"
    >
      <div class="relative">
        <img
          :src="
            props.data.medias
              .find((x) => x.imdbId == item.mediaId)
              .images.filter((x) => x.coverType === 'poster')[0].remoteUrl
          "
          class="w-24 rounded-box shadow-md"
        />
        <div
          v-if="item.users.length === props.data.users"
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
        <div class="text-lg font-semibold">
          {{ props.data.medias.find((x) => x.imdbId == item.mediaId).title }}
        </div>
        <progress
          :class="`progress w-full sm:w-56 ${item.users.length === props.data.users ? 'progress-success' : ''}`"
          :value="(item.users.length / props.data.users) * 100"
          max="100"
        />
        <div class="text-xs uppercase font-semibold opacity-60">
          <span v-if="item.users.length === props.data.users">
            Peut être supprimer
          </span>
          <span v-else>
            {{ item.users.length }}
            {{
              item.users.length > 1
                ? "utilisateurs souhaitent le supprimer"
                : "utilisateur souhaite le supprimer"
            }}
          </span>
        </div>
        <div class="avatar-group py-2 -space-x-6 md:hidden">
          <div v-for="user in item.users" :key="user.id" class="avatar">
            <div class="size-10">
              <img :src="user.avatar" />
            </div>
          </div>
        </div>
      </div>
      <div class="avatar-group py-2 -space-x-6 hidden md:block">
        <div v-for="user in item.users" :key="user.id" class="avatar">
          <div class="size-14">
            <img :src="user.avatar" />
          </div>
        </div>
      </div>
    </li>
    <li v-if="props.data.results.length === 0" class="list-row items-center">
      Aucun résultats, les utilisateurs n'ont pas encore voter
    </li>
  </ul>
</template>

<style scoped></style>
