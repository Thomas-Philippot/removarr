<script setup lang="ts">
import AppToast from "~/components/AppToast.vue";
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    required: true,
  },
});

const { data: medias, status } = await useAsyncData(
  props.mediaType,
  async () => {
    const data = await $fetch(props.url);
    const plexSettings = await $fetch(`/api/settings/plex`);
    const filteredPath = plexSettings.libraries
      .filter((x) => x.type === props.mediaType && x.enabled)
      .map((x) => x.path);

    const result = data.filter((media) => {
      return filteredPath.some((path) => path.includes(media.rootFolderPath));
    });

    if (props.mediaType === "movie") {
      return result.filter((x) => x.hasFile);
    }
    return result;
  },
  { lazy: true },
);

const { data: user } = useAuth();

const selectAll = ref(false);
const selection = ref([]);
const title = {
  movie: "Films",
  show: "Séries TV",
};

async function toggleMediaSelection(id: string) {
  if (selection.value.includes(id)) {
    const index = selection.value.indexOf(id);
    selection.value.splice(index, 1);
  } else {
    selection.value.push(id);
  }
}

async function toggleSelectAll() {
  if (selectAll.value) {
    selection.value = medias.value.map((x) => x.imdbId);
  } else {
    selection.value = [];
  }
}

async function sendVote() {
  await $fetch("/api/votes", {
    method: "POST",
    body: {
      mediaIds: selection.value,
      userId: user.value.id,
      mediaType: props.mediaType,
    },
  });
  selection.value = [];
  showToast("alert alert-success", "Vote pris en compte");
}

function showToast(type, message) {
  const { $nt } = useNuxtApp();
  $nt.show(() => h(AppToast, { type, message }));
}

const indeterminate = computed(() => {
  return (
    selection.value.length !== 0 && selection.value.length !== medias.length
  );
});

const selectionLabel = computed(() => {
  if (selection.value.length === 0) {
    return "Tout séléctionner";
  }
  return "Tout désélectionner";
});
</script>

<template>
  <div class="flex items-center justify-between pb-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <div class="prose mr-4">
        <h1>{{ title[props.mediaType] }}</h1>
      </div>
      <fieldset
        class="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4"
      >
        <label class="label">
          <input
            v-model="selectAll"
            type="checkbox"
            :indeterminate="indeterminate"
            class="checkbox"
            @change="toggleSelectAll"
          />
          {{ selectionLabel }}
        </label>
      </fieldset>
      <div class="text-title">{{ selection.length }} item(s) séléctionner</div>
    </div>
    <button class="btn btn-primary hidden sm:block" @click="sendVote">
      Voter
    </button>
    <div class="fixed bottom-20 right-4 z-10 sm:hidden">
      <button
        :class="`btn btn-primary btn-circle transition-opacity btn-xl shadow-xl ${selection.length > 0 ? 'opacity-100' : 'opacity-0'}`"
        @click="sendVote"
      >
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
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      </button>
    </div>
  </div>
  <ul v-if="status === 'pending'" class="cards-vertical cursor-wait">
    <li v-for="i in 50" :key="i" class="skeleton h-56 w-full" />
  </ul>
  <ul v-if="status === 'success'" class="cards-vertical pb-4">
    <li
      v-for="media in medias"
      :key="media.id"
      class="shadow-sm cursor-pointer transform-gpu transition duration-300 hover:scale-105"
      @click="toggleMediaSelection(media.imdbId)"
    >
      <figure class="relative">
        <img
          :src="
            media.images.filter((x) => x.coverType === 'poster')[0].remoteUrl
          "
          class="rounded-md"
          :alt="`${media.title}`"
        />
        <div
          v-if="selection.includes(media.imdbId)"
          class="absolute inset-0 rounded-md ring-2 ring-primary"
        >
          <div class="flex m-2">
            <input
              type="checkbox"
              checked="checked"
              class="checkbox checkbox-primary"
            />
          </div>
        </div>
      </figure>
    </li>
  </ul>
  <div v-if="status === 'error'">
    <ErrorAlert />
  </div>
</template>

<style scoped></style>
