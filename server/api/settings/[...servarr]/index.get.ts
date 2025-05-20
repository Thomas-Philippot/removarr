import {
  getSettings,
  type DVRSettings
} from "~/server/repository/settingRepository";

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const key = event.context.params?.servarr;
  if (key === 'radarr' || key === 'sonarr' || key === 'overseerr') {
    return settings.main[key] as DVRSettings;
  }
  throw createError({
    statusCode: 400,
    statusMessage: "servarr not implemented",
  });
});
