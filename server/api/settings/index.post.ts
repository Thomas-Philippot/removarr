import { getSettings } from "../../repository/settingRepository";
import merge from "lodash/merge";

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const data = await readBody(event);

  settings.main = merge(settings.main, data);
  settings.save();
  return settings.main;
});
