<script setup lang="ts">
interface DiskSpaceItem {
  path: string;
  label: string;
  freeSpace: number;
  totalSpace: number;
}

const { data, status, error } = useFetch<DiskSpaceItem[]>(
  "/radarr/api/v3/diskspace",
);

const { data: settings } = useFetch("/api/settings/app");

const filteredData = computed(() => {
  let items = settings.value?.storageFilteredPaths.split(",");
  items = items?.map((x) => x.trim());
  return data.value?.filter((x) => !items?.includes(x.path));
});

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function getStatusColor(item: DiskSpaceItem) {
  const percent = ((item.totalSpace - item.freeSpace) / item.totalSpace) * 100;
  if (percent > 70) {
    return "warning";
  }
  if (percent > 90) {
    return "error";
  }
  return "success";
}
</script>

<template>
  <div class="pb-6">
    <div class="flex items-center">
      <div class="prose mb-4">
        <h1>{{ $t("storage") }}</h1>
      </div>
    </div>
    <div v-if="error">
      Erreur : impossible d'afficher les information de stockage
    </div>
    <div v-if="status === 'pending'">
      <div class="flex flex-col gap-4">
        <div v-for="x in 4" :key="x" class="flex flex-col gap-2">
          <div class="skeleton h-4 w-14" />
          <div class="flex gap-4 items-center justify-between">
            <div class="skeleton h-4 w-full" />
            <div class="flex-none">
              <div class="skeleton h-4 w-16" />
            </div>
          </div>
          <div class="skeleton h-2 w-8" />
        </div>
      </div>
    </div>
    <div v-if="status === 'success' && settings && data">
      <div class="flex flex-col gap-4">
        <div
          v-for="(item, key) in filteredData"
          :key="key"
          class="flex flex-col"
        >
          <div class="font-semibold">{{ item.path }}</div>
          <div class="flex gap-4 items-center justify-between">
            <progress
              :class="`progress progress-${getStatusColor(item)}`"
              :value="item.totalSpace - item.freeSpace"
              :max="item.totalSpace"
            />
            <div class="flex-none">{{ formatBytes(item.totalSpace) }}</div>
          </div>
          <div class="text-sm">
            {{ formatBytes(item.freeSpace) }} {{ $t("available") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
