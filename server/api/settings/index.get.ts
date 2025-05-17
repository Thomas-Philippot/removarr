import { getSettings } from "../../repository/settingRepository";

export default defineEventHandler(async () => {
  const settings = getSettings().load();
  return settings.main;
});
