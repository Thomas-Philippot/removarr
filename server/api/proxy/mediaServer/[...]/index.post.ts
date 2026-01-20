import { getSettings } from "~/server/repository/settingRepository";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  if (!event.context.params) {
    throw createError({
      statusCode: 400,
      statusMessage: "missing url parameter",
    });
  }

  const settings = getSettings().load();
  if (!settings.main.mediaServer.apiKey) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing mediaServer api key",
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
    method: "POST",
    body: data,
    headers: {
      Authorization: `MediaBrowser Client="Removarr", Device="Removarr", DeviceId="${deviceId}", Version="1", Token="${settings.main.mediaServer.apiKey}"`,
    },
  });
});
