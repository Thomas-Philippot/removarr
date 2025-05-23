import { getSettings } from "~/server/repository/settingRepository";

export default defineEventHandler(async (event) => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: "missing url parameter",
    });
  }

  const settings = getSettings().load();
  if (!settings.main.radarr.apiKey) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing radarr api key",
    });
  }
  const param = event.context.params._;
  const path = param.replace("/radarr/", "");

  const url = settings.main.radarr.hostname?.startsWith("http")
    ? `${settings.main.radarr.hostname}/${path}`
    : `http://${settings.main.radarr.hostname}:${settings.main.radarr.port}/${path}`;

  return await $fetch(url, {
    headers: {
      "X-Api-Key": settings.main.radarr.apiKey,
    },
  });
});
