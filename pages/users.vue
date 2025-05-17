<script setup lang="ts">
const { data: users, status } = useFetch("/api/users");
</script>

<template>
  <div class="flex items-center pb-6">
    <div class="prose mr-4">
      <h1>Utilisateurs</h1>
    </div>
  </div>
  <div v-if="status === 'success'">
    <UserList :users="users" />
  </div>
</template>

<style scoped></style>
