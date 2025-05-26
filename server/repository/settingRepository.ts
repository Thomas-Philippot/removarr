import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import merge from "lodash/merge.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SETTINGS_PATH = process.env.CONFIG_DIRECTORY
  ? `${process.env.CONFIG_DIRECTORY}/settings.json`
  : path.join(__dirname, "../../config/settings.json");

export interface DVRSettings {
  mode: "hostname" | "ip";
  schema: "http://" | "https://";
  hostname: string | null;
  ip: string | null;
  port: number;
  apiKey: string | null;
}

export interface PlexSettings {
  mode: "hostname" | "ip";
  schema: "http://" | "https://";
  hostname: string | null;
  ip: string | null;
  port: number;
  libraries: PlexLibrary[];
  filter: boolean;
  api_uuid: string | null;
  auth_token?: string;
  machineId?: string | null;
}

export interface PlexLibrary {
  id: string;
  name: string;
  enabled: boolean;
  type: string;
  path: string;
}

export interface MainSettings {
  plex: PlexSettings;
  radarr: DVRSettings;
  sonarr: DVRSettings;
  overseerr: DVRSettings;
}

class Settings {
  private data: MainSettings;

  constructor(initialSettings?: MainSettings) {
    this.data = {
      plex: {
        mode: "hostname",
        schema: "http://",
        hostname: null,
        ip: null,
        port: 32400,
        libraries: [],
        filter: true,
        api_uuid: null,
      },
      radarr: {
        mode: "hostname",
        hostname: null,
        schema: "https://",
        ip: null,
        port: 7878,
        apiKey: null,
      },
      sonarr: {
        mode: "hostname",
        hostname: null,
        schema: "https://",
        ip: null,
        port: 8989,
        apiKey: null,
      },
      overseerr: {
        mode: "hostname",
        hostname: null,
        schema: "https://",
        ip: null,
        port: 5055,
        apiKey: null,
      },
    };
    if (initialSettings) {
      this.data = merge(this.data, initialSettings);
    }
  }

  get main(): MainSettings {
    return this.data;
  }

  set main(data: MainSettings) {
    this.data = data;
  }

  /**
   * Settings Load
   *
   * This will load settings from file unless an optional argument of the object structure
   * is passed in.
   * @param overrideSettings If passed in, will override all existing settings with these
   * values
   */
  public load(overrideSettings?: MainSettings): Settings {
    if (overrideSettings) {
      this.data = overrideSettings;
      return this;
    }

    if (!fs.existsSync(SETTINGS_PATH)) {
      this.save();
    }
    const data = fs.readFileSync(SETTINGS_PATH, "utf-8");

    if (data) {
      this.data = merge(this.data, JSON.parse(data));
      this.save();
    }
    return this;
  }

  public save(): void {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(this.data, undefined, " "));
  }
}

let settings: Settings | undefined;

export const getSettings = (initialSettings?: MainSettings): Settings => {
  if (!settings) {
    settings = new Settings(initialSettings);
  }

  return settings;
};

export default Settings;
