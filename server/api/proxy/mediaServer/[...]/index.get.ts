import { getSettings } from "~/server/repository/settingRepository";

export default defineEventHandler(async (event) => {
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: "missing url parameter",
    });
  }

  const settings = getSettings().load();
  const token = settings.main.mediaServer.auth_token
    ? settings.main.mediaServer.auth_token
    : settings.main.mediaServer.apiKey;
  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing mediaServer api Key or token",
    });
  }
  const deviceId = Buffer.from("Removarr").toString("base64");
  const param = event.context.params._;
  const path = param.replace("/mediaServer/", "");

  const url =
    settings.main.mediaServer.mode === "ip"
      ? `${settings.main.mediaServer.schema}${settings.main.mediaServer.ip}:${settings.main.mediaServer.port}/${path}`
      : `${settings.main.mediaServer.schema}${settings.main.mediaServer.hostname}/${path}`;
  return await $fetch(url, {
    headers: {
      Authorization: `MediaBrowser Client="Removarr", Device="Removarr", DeviceId="${deviceId}", Version="1", Token="${token}"`,
    },
  });
});
