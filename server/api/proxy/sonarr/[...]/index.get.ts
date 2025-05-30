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

  const param = event.context.params._;
  const path = param.replace("/sonarr/", "");

  const url =
    settings.main.sonarr.mode === "ip"
      ? `${settings.main.sonarr.schema}${settings.main.sonarr.ip}:${settings.main.sonarr.port}/${path}`
      : `${settings.main.sonarr.schema}${settings.main.sonarr.hostname}/${path}`;
  return await $fetch(url, {
    headers: {
      "X-Api-Key": settings.main.sonarr.apiKey,
    },
  });
});
