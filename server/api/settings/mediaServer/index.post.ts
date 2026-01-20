import { getSettings } from "~/server/repository/settingRepository";
import merge from "lodash/merge.js";

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const data = await readBody(event);

  settings.main.mediaServer = merge(settings.main.mediaServer, data);
  settings.save();
  return settings.main.mediaServer;
});
