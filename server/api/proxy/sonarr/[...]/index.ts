import { getSettings } from "~/server/repository/settingRepository";

export default defineEventHandler(async (event) => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: "missing url parameter",
    });
  }

  const settings = getSettings().load();
  if (!settings.main.sonarr.apiKey) {
    throw createError({
      statusCode: 400,
      statusMessage: "Sonarr api key missing",
    });
  }

  const url = event.context.params._;
  const path = url.replace("/sonarr/", "");
  return await $fetch(`${settings.main.sonarr.hostname}/${path}`, {
    headers: {
      "X-Api-Key": settings.main.sonarr.apiKey,
    },
  });
});
