<script setup lang="ts">
import type { user } from "~/server/database/schema";
type User = typeof user.$inferInsert;

const props = defineProps({
  users: {
    type: Array as PropType<User[]>,
    required: true,
  },
});
</script>

<template>
  <ul class="list">
    <li v-for="item in props.users" :key="item.id" class="list-row">
      <div>
        <img class="size-10 rounded-box" :src="item.avatar" alt="" />
      </div>
      <div>
        <div>{{ item.username }}</div>
        <div class="text-xs uppercase font-semibold opacity-60">
          {{ item.email }}
        </div>
      </div>
      <div class="badge badge-outline badge-accent">
        {{ item.role }}
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
