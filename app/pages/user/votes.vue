<script setup lang="ts"></script>

<template>
  <div class="prose mr-4">
    <h1>{{ $t("my_votes") }}</h1>
  </div>
  <UserVotes :votes="[]" />
</template>

<style scoped></style>
