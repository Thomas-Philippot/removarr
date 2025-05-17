<script setup lang="ts"></script>

<template>
  <div class="prose">
    <h1>Paramètres</h1>
    <p>Régler les paramètres de vos applications</p>
  </div>
  <div class="flex flex-col lg:flex-row gap-6">
    <ServarrSettingsForm key="sonarr" servarr="sonarr" />
    <ServarrSettingsForm key="radarr" servarr="radarr" />
    <ServarrSettingsForm key="overseerr" servarr="overseerr" />
  </div>
</template>

<style scoped></style>
