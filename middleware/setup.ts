import type { MainSettings } from "~/server/repository/settingRepository";

export default defineNuxtRouteMiddleware(async () => {
  const settings = await $fetch<MainSettings>("/api/settings");
  const { data, token } = useAuth();
  if (
    !settings.radarr.hostname ||
    !settings.radarr.apiKey ||
    !settings.sonarr.hostname ||
    !settings.sonarr.apiKey ||
    !settings.plex.api_uuid
  ) {
    if (data.value && data.value.role === "user") {
      // set user as admin
      await $fetch(`/api/users/${data.value.id}`, {
        method: "PUT",
        body: {
          id: data.value.id,
          role: "admin",
        },
      });
    }

    if (token.value) {
      // persist plex data to app settings
      await $fetch("/api/plex/setup", {
        method: "POST",
        body: {
          token: token.value,
        },
      });
    }

    return navigateTo("/setup");
  }
  return;
});
