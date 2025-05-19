import {
  getSettings,
  type MainSettings,
} from "~/server/repository/settingRepository";
import merge from "lodash/merge.js";

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const key = event.context.params?.servarr;
  if (key && key in settings.main) {
    const data = await readBody(event);

    settings.main[key as keyof MainSettings] = merge(
      settings.main[key as keyof MainSettings],
      data,
    );
    settings.save();
    return settings.main;
  }
  throw createError({
    statusCode: 400,
    statusMessage: "servarr not implemented",
  });
});
