import type { MainSettings } from "~/server/repository/settingRepository";

export default defineNuxtRouteMiddleware(async () => {
  const settings = await $fetch<MainSettings>("/api/settings");
  if (
    !settings.radarr.hostname ||
    !settings.radarr.apiKey ||
    !settings.sonarr.hostname ||
    !settings.sonarr.apiKey
  ) {
    const { data, token } = useAuth();
    if (data.value.role === "user") {
      // set user as admin
      await $fetch(`/api/users/${data.value.id}`, {
        method: "PUT",
        body: {
          id: data.value.id,
          role: "admin",
        },
      });
    }

    if (!settings.plex.app_uuid) {
      await $fetch("/api/settings/plex/uuid", {
        method: "POST",
      });

      // persist plex libraries to app settings
      settings.plex.libraries = await $fetch("/api/plex/libraries", {
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
