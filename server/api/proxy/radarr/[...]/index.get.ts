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

  const url =
    settings.main.radarr.mode === "ip"
      ? `${settings.main.radarr.schema}${settings.main.radarr.ip}:${settings.main.radarr.port}/${path}`
      : `${settings.main.radarr.schema}${settings.main.radarr.hostname}/${path}`;
  return await $fetch(url, {
    headers: {
      "X-Api-Key": settings.main.radarr.apiKey,
    },
  });
});
