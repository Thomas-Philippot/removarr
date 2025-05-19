<script setup lang="ts"></script>

<template>
  <div class="prose">
    <h1>Paramètres</h1>
    <p>Régler les paramètres de vos applications</p>
  </div>
  <div class="flex flex-wrap gap-6 pb-6">
    <ServarrSettingsForm key="sonarr" servarr="sonarr" />
    <ServarrSettingsForm key="radarr" servarr="radarr" />
    <ServarrSettingsForm key="overseerr" servarr="overseerr" />
  </div>
  <div class="prose">
    <h1>Plex</h1>
    <p>Régler les paramètres de plex</p>
  </div>
  <div>
    <PlexSettings />
  </div>
</template>

<style scoped></style>
