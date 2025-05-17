import {
  getSettings,
  type MainSettings,
} from "../../../repository/settingRepository";

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const key = event.context.params?.servarr;
  if (key && key in settings.main) {
    return settings.main[key as keyof MainSettings];
  }
  throw createError({
    statusCode: 400,
    statusMessage: "servarr not implemented",
  });
});
