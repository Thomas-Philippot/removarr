export default defineNuxtRouteMiddleware(async () => {
  const settings = await $fetch("/api/settings");
  if (
    !settings.radarr.hostname ||
    !settings.radarr.apiKey ||
    !settings.sonarr.hostname ||
    !settings.sonarr.apiKey
  ) {
    console.log("fetch user and set admin role");
    const { data } = useAuth();
    if (data.value.role === "user") {
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
