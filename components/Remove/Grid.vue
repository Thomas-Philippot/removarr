<script setup lang="ts">
const tab = ref(0);
const mediaType = ["movie", "show"];
const selection = ref<number[]>([]);
const selectAll = ref(false);
const deleteFiles = ref(true);

const { t } = useI18n();

const { data, status, error } = await useAsyncData(
  "remove",
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
      users,
    };
  },
  { lazy: true },
);

function openModal() {
  if (selection.value.length > 0) {
    const modal = document.getElementById(`remove_modal`);
    modal?.showModal();
  }
}

function toggleMediaSelection(id: number) {
  if (selection.value.includes(id)) {
    const index = selection.value.indexOf(id);
    selection.value.splice(index, 1);
  } else {
    selection.value.push(id);
  }
}

async function toggleSelectAll() {
  if (!data.value || !selection.value) {
    return;
  }
  if (selectAll.value) {
    selection.value = data.value.results
      .filter((x) => x.mediaType === mediaType[tab.value])
      .filter((x) => x.users.length === data.value.users.length)
      .map((x) => x.servarrId);
  } else {
    selection.value = [];
  }
}

async function sendRemove() {
  await $fetch("/api/votes/results", {
    method: "DELETE",
    body: {
      medias: selection.value,
      mediaType: mediaType[tab.value],
      deleteFiles: deleteFiles.value,
    },
  });
  for (const item of selection.value) {
    const media = data.value.medias.find(
      (x) => x.imdbId == votes.value.find((x) => x.servarrId == item).mediaId,
    );
    const index = data.value.medias.indexOf(media);
    data.value.medias.splice(index, 1);
  }
  selection.value = [];
  deleteFiles.value = true;
  const modal = document.getElementById(`remove_modal`);
  modal?.close();
}

const votes = computed(() => {
  return data.value.results
    .filter((x) => x.mediaType === mediaType[tab.value])
    .filter((x) => x.users.length === data.value.users.length);
});

const indeterminate = computed(() => {
  return (
    selection.value.length !== 0 &&
    selection.value.length !== data.value.medias.length
  );
});

const selectionLabel = computed(() => {
  if (selection.value.length === 0) {
    return t("select_all");
  }
  return t("deselect_all");
});

watch(tab, () => {
  selection.value = [];
});
</script>

<template>
  <div>
    <dialog id="remove_modal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">{{ $t("remove_modal_title") }}</h3>
        <p class="py-4">{{ $t("remove_warning") }}</p>
        <ul
          v-for="item in selection"
          :key="item"
          class="list mb-2 overflow-auto max-h-72"
        >
          <li class="list-row">
            {{
              data.medias.find(
                (x) =>
                  x.imdbId == votes.find((x) => x.servarrId == item).mediaId,
              ).title
            }}
          </li>
        </ul>
        <div class="flex flex-col gap-4 pt-4">
          <label class="label">
            <input v-model="deleteFiles" type="checkbox" class="checkbox" />
            {{ $t("delete_files_param") }}
          </label>
        </div>
        <div class="modal-action gap-2">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
          </form>
          <button class="btn btn-error" @click="sendRemove">
            {{ $t("confirm") }}
          </button>
        </div>
      </div>
    </dialog>
    <div class="flex justify-between">
      <div class="flex items-center gap-2">
        <div class="prose mr-4">
          <h1>{{ $t("remove") }}</h1>
        </div>
        <div role="tablist" class="tabs tabs-border">
          <a
            role="tab"
            :class="`tab ${tab === 0 ? 'tab-active' : ''}`"
            @click="tab = 0"
            >{{ $t("movies") }}</a
          >
          <a
            role="tab"
            :class="`tab ${tab === 1 ? 'tab-active' : ''}`"
            @click="tab = 1"
            >{{ $t("shows") }}</a
          >
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
      <div class="flex gap-2">
        <button class="btn btn-error hidden sm:block" @click="openModal">
          {{ $t("remove") }}
        </button>
        <div class="fixed bottom-20 right-4 z-10 sm:hidden">
          <button
            :class="`btn btn-error btn-circle transition-opacity btn-xl shadow-xl ${selection.length > 0 ? 'opacity-100' : 'opacity-0'}`"
            @click="openModal"
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
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-if="error">
      <div role="alert" class="alert alert-error alert-soft mt-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="stroke-error h-6 w-6 shrink-0"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div>
          <h3 class="font-bold">{{ $t("error") }}</h3>
          <div class="text-xs">{{ error }}</div>
        </div>
      </div>
    </div>
    <div v-if="status === 'pending'">
      <ul class="cards-vertical cursor-wait">
        <li v-for="i in 30" :key="i" class="skeleton aspect-2/3" />
      </ul>
    </div>
    <div v-if="data && votes && status === 'success'">
      <ul class="cards-vertical py-6">
        <li v-for="item in votes" :key="item.id">
          <figure
            v-if="data.medias.find((x) => x.imdbId == item.mediaId)"
            class="relative shadow-sm cursor-pointer transform-gpu transition duration-300 hover:scale-105"
            @click="toggleMediaSelection(item.servarrId)"
          >
            <NuxtImg
              :src="
                data.medias
                  .find((x) => x.imdbId == item.mediaId)
                  .images.filter((x) => x.coverType === 'poster')[0].remoteUrl
              "
              alt=""
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
              v-if="selection.includes(item.servarrId)"
              class="absolute inset-0 rounded-md ring-2 ring-error"
            >
              <div class="flex m-2">
                <input
                  type="checkbox"
                  checked
                  class="checkbox checkbox-error"
                />
              </div>
            </div>
          </figure>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
