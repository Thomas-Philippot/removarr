import { getSettings } from "~/server/repository/settingRepository";

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const url = event.context.params._;

  const path = url.replace("/radarr/", "");
  return await $fetch(`${settings.data.radarr.hostname}/${path}`, {
    headers: {
      "X-Api-Key": settings.data.radarr.apiKey,
    },
  });
});
