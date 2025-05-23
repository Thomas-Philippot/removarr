import type { MainSettings } from "~/server/repository/settingRepository";

export default defineNuxtRouteMiddleware(async () => {
  const settings = await $fetch<MainSettings>("/api/settings");
  const { data } = useAuth();
  if (
    !settings.radarr.hostname ||
    !settings.radarr.apiKey ||
    !settings.sonarr.hostname ||
    !settings.sonarr.apiKey
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

    return navigateTo("/setup");
  }
  return;
});
