import { getSettings } from '~/server/repository/settingRepository'
import type { NotificationAgent, NotificationPayload } from './agent';
import type { NotificationAgentGotify } from '~/server/repository/settingRepository';
import { BaseAgent } from './agent';
import type { Notification } from '..';

class GotifyAgent
  extends BaseAgent<NotificationAgentGotify>
  implements NotificationAgent
{
  protected getSettings(): NotificationAgentGotify {
    if (this.settings) {
      return this.settings;
    }

    const settings = getSettings();

    return settings.notifications.agents.gotify;
  }

  public shouldSend(): boolean {
    const settings = this.getSettings();
    return !!(settings.enabled && settings.options.url && settings.options.token);
  }

  public async send(
    type: Notification,
    payload: NotificationPayload
  ): Promise<boolean> {
    const settings = this.getSettings();
    try {
      const endpoint = `${settings.options.url}/message?token=${settings.options.token}`;

      await $fetch(endpoint, {
        method: "POST",
        body: payload.message
      });

      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }
}

export default GotifyAgent;
