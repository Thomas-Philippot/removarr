import type { Notification } from '..'
import type { NotificationAgentConfig } from '~/server/repository/settingRepository';

export interface NotificationPayload {
  message?: string;
}

export abstract class BaseAgent<T extends NotificationAgentConfig> {
  protected settings?: T;
  public constructor(settings?: T) {
    this.settings = settings;
  }

  protected abstract getSettings(): T;
}

export interface NotificationAgent {
  shouldSend(): boolean
  send(type: Notification, payload: NotificationPayload): Promise<boolean>
}
