<script setup lang="ts">
import AppToast from "~/components/AppToast.vue";
import type { MediaResponse } from "~/types/global";

const { t } = useI18n();

enum MediaType {
  Movie = "movie",
  Show = "show",
}

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String as PropType<MediaType>,
    required: true,
  },
});

const { data: medias, status } = await useAsyncData(
  props.mediaType,
  async () => {
    const data = await $fetch<MediaResponse>(props.url);
    const plexSettings = await $fetch(`/api/settings/plex`);

    if (!plexSettings.filter) {
      return data.filter((x) => x.statistics.sizeOnDisk > 0);
    }

    const filteredPath = plexSettings.libraries
      .filter((x) => x.type === props.mediaType && x.enabled)
      .map((x) => x.path);

    return data
      .filter((media) => {
        return filteredPath.some((path) => path.includes(media.rootFolderPath));
      })
      .filter((x) => x.statistics.sizeOnDisk > 0);
  },
  { lazy: true },
);

const { data: user } = useAuth();

const selectAll = ref(false);
const selection = ref<string[]>([]);
const itemsPerPage = ref(30);
const page = ref(1);

async function toggleMediaSelection(id: string) {
  if (selection.value.includes(id)) {
    const index = selection.value.indexOf(id);
    selection.value.splice(index, 1);
  } else {
    selection.value.push(id);
  }
}

async function toggleSelectAll() {
  if (!medias.value || !selection.value) {
    return;
  }
  if (selectAll.value) {
    selection.value = medias.value.map((x) => x.imdbId);
  } else {
    selection.value = [];
  }
}

async function sendVote() {
  if (user.value) {
    await $fetch("/api/votes", {
      method: "POST",
      body: {
        mediaIds: selection.value,
        userId: user.value.id,
        mediaType: props.mediaType,
      },
    });
    selection.value = [];
    showToast("alert alert-success", t("vote_registered"));
  }
}

function showToast(type: string, message: string) {
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
    return t("select_all");
  }
  return t("deselect_all");
});

const paginatedItems = computed(() => {
  if (!medias.value) return [];
  return medias.value.slice(
    (page.value - 1) * itemsPerPage.value,
    page.value * itemsPerPage.value,
  );
});

const totalItems = computed(() => {
  if (!medias.value) return 0;
  return medias.value.length;
});

const pages = computed(() => {
  if (!medias.value) return 0;
  return Math.ceil(totalItems.value / itemsPerPage.value);
});
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <div class="prose mr-4">
        <h1>{{ $t(props.mediaType) }}</h1>
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
      <div class="text-title">
        {{ selection.length }} {{ $t("selected_items") }}
      </div>
    </div>
    <button class="btn btn-primary hidden sm:block" @click="sendVote">
      {{ $t("vote") }}
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
  <div v-if="status === 'pending'" class="py-6">
    <ul class="cards-vertical cursor-wait">
      <li v-for="i in itemsPerPage" :key="i" class="skeleton aspect-2/3" />
    </ul>
  </div>
  <div v-if="medias && status === 'success'" class="pb-4">
    <ul class="cards-vertical py-6">
      <li
        v-for="media in paginatedItems"
        :key="media.id"
        class="shadow-sm cursor-pointer transform-gpu transition duration-300 hover:scale-105"
        @click="toggleMediaSelection(media.imdbId)"
      >
        <figure class="relative">
          <NuxtImg
            :src="
              media.images.filter((x) => x.coverType === 'poster')[0].remoteUrl
            "
            :alt="`${media.title}`"
            class="rounded-md aspect-2/3"
            loading="lazy"
            custom
          >
            <template #default="{ src, isLoaded, imgAttrs }">
              <img v-if="isLoaded" v-bind="imgAttrs" :src="src" />
              <div v-else class="skeleton" v-bind="imgAttrs" />
            </template>
          </NuxtImg>
          <div
            v-if="selection.includes(media.imdbId)"
            class="absolute inset-0 rounded-md ring-2 ring-primary"
          >
            <div class="flex m-2">
              <input
                type="checkbox"
                checked
                class="checkbox checkbox-primary"
              />
            </div>
          </div>
        </figure>
      </li>
    </ul>
    <div class="grid grid-cols-3 items-end justify-between">
      <div class="flex">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">{{ $t("items_per_page") }}</legend>
          <select
            v-model="itemsPerPage"
            class="select select-sm select-ghost"
            @change="page = 1"
          >
            <option :value="30">30</option>
            <option :value="50">50</option>
          </select>
        </fieldset>
      </div>
      <div class="flex justify-center">
        <div class="join">
          <button
            class="join-item btn btn-square"
            :disabled="page === 1"
            @click="page--"
          >
            «
          </button>
          <button class="join-item btn">Page {{ page }}</button>
          <button
            class="join-item btn"
            :disabled="page === pages"
            @click="page++"
          >
            »
          </button>
        </div>
      </div>
      <div></div>
    </div>
  </div>
  <div v-if="status === 'error'">
    <ErrorAlert />
  </div>
</template>

<style scoped></style>
