<script setup lang="ts">
const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <ul class="list">
    <li v-for="user in props.users" :key="user.id" class="list-row">
      <div>
        <img class="size-10 rounded-box" :src="user.avatar" />
      </div>
      <div>
        <div>{{ user.username }}</div>
        <div class="text-xs uppercase font-semibold opacity-60">
          {{ user.email }}
        </div>
      </div>
      <div class="badge badge-outline badge-accent">
        {{ user.role }}
      </div>
    </li>
  </ul>
</template>

<style scoped></style>
