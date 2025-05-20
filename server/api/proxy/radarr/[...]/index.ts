import { getSettings } from "~/server/repository/settingRepository";

export default defineEventHandler(async (event) => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: 'missing url parameter',
    });
  }

  const settings = getSettings().load();
  if (!settings.main.radarr.apiKey) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing radarr api key',
    });
  }
  const url = event.context.params._;
  const path = url.replace("/radarr/", "");
  return await $fetch(`${settings.main.radarr.hostname}/${path}`, {
    headers: {
      "X-Api-Key": settings.main.radarr.apiKey,
    },
  });
});
