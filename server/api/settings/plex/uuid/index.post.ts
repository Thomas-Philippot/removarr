import { getSettings } from "~/server/repository/settingRepository";
import { randomUUID } from "crypto";

export default defineEventHandler(async () => {
  const settings = getSettings().load();
  if (!settings.main.plex.api_uuid) {
    settings.main.plex.api_uuid = randomUUID();
  }
  settings.save();
  return settings.main.plex.api_uuid;
});
