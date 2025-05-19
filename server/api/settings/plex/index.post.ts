import { getSettings } from "~/server/repository/settingRepository";
import merge from "lodash/merge.js";

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const data = await readBody(event);

  settings.main.plex = merge(settings.main.plex, data);
  settings.save();
  return settings.main.plex;
});
