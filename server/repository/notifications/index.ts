import type { NotificationAgent, NotificationPayload } from './agents/agent';

export enum Notification {
  NONE= 0,
  NEW_VOTE = 1,
  CAN_BE_DELETED = 2,
}

class NotificationManager {
  private activeAgents: NotificationAgent[] = [];

  public registerAgents = (agents: NotificationAgent[]): void => {
    this.activeAgents = [...this.activeAgents, ...agents];
  };

  public sendNotification(
    type: Notification,
    payload: NotificationPayload
  ): void {

    this.activeAgents.forEach((agent) => {
      if (agent.shouldSend()) {
        agent.send(type, payload);
      }
    });
  }
}

const notificationManager = new NotificationManager();

export default notificationManager;
