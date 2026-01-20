import { getSettings } from "~/server/repository/settingRepository";

export default defineEventHandler(async () => {
  const settings = getSettings().load();
  return settings.main.mediaServer;
});
