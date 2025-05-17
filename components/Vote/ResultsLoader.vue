<script setup lang="ts"></script>

<template>
  <ul class="list">
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
