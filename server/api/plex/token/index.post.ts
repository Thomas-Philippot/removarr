import { getSettings } from "~/server/repository/settingRepository";

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const data = await readBody(event);
  if (data.token) {
    settings.main.mediaServer.apiKey = data.token;
  }
  settings.save();
});
