import { getSettings } from "~/server/repository/settingRepository";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);

  const settings = getSettings().load();

  if (settings.main.mediaServer.type === "plex") {
    return { token: data.authToken };
  }

  if (!settings.main.mediaServer.apiKey) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing mediaServer api key",
    });
  }

  const response = await $fetch("/mediaServer/Users/AuthenticateByName", {
    method: "POST",
    body: data,
  });

  settings.main.mediaServer.auth_token = response.AccessToken;
  settings.save();

  return { token: response.AccessToken };
});
