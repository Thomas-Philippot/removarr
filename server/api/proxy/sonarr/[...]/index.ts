import { getSettings } from "~/server/repository/settingRepository";

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const url = event.context.params._;

  const path = url.replace("/sonarr/", "");
  return await $fetch(`${settings.data.sonarr.hostname}/${path}`, {
    headers: {
      "X-Api-Key": settings.data.sonarr.apiKey,
    },
  });
});
