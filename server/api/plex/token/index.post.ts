import { getSettings } from "~/server/repository/settingRepository";

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const data = await readBody(event);
  if (data.token) {
    settings.main.plex.auth_token = data.token;
  }
  settings.save();
});
