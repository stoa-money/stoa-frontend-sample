import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { UserStatusNotification, PotStatusNotification } from '@/types/notification';

export class NotificationService {
  private connection: HubConnection | null = null;
  private callbacks: { [key: string]: ((...args: any[]) => void)[] } = {};

  isConnected(): boolean {
    return this.connection?.state === HubConnectionState.Connected;
  }

  async connect(getToken: (options?: { template?: string, skipCache?: boolean }) => Promise<string | null>): Promise<void> {
    if (this.connection) {
      if (this.isConnected()) {
        // Already connected with authentication
        return;
      }

      try {
        await this.connection.stop();
      } catch (error) {
        console.warn("⚠️ [SignalR] Error stopping previous connection:", error);
      }
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(process.env.NEXT_PUBLIC_CORE_SIGNALR_URL || "/signalr", {
        accessTokenFactory: async () => {
          const token = await getToken({ template: "stoa-core-api-apim", skipCache: true });
          console.log("👁️‍🗨️ signalr token", token);
          return token || "";
        },
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    try {
      await this.connection.start();

      this.connection.on("DataUpdate", (notification: any) => {
        this.handleDataUpdate(notification);
      });
      
    } catch (err) {
      console.error('SignalR Connection Error:', err);
      throw err;
    }
  }

  private handleDataUpdate(notification: any): void {
    const { entityType, entityId, action, data } = notification;

    if (entityType === "User") {
      const userStatusNotification: UserStatusNotification = {
        type: "user",
        userId: entityId,
        status: action,
        data: data
      };
      this.triggerEvent("DataUpdate", userStatusNotification);
    } else if (entityType === "Pot") {
      const potStatusNotification: PotStatusNotification = {
        type: "pot",
        potId: entityId,
        status: action,
        data: data
      };
      this.triggerEvent("DataUpdate", potStatusNotification);
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }

    // Clear any locally registered callbacks to avoid duplicate event handling
    this.callbacks = {};
  }

  on(methodName: string, callback: (notification: UserStatusNotification | PotStatusNotification) => void): void {
    if (!this.callbacks[methodName]) {
      this.callbacks[methodName] = [];
    }
    this.callbacks[methodName].push(callback);
  }

  off(methodName: string, callback: (notification: UserStatusNotification | PotStatusNotification) => void): void {
    if (this.callbacks[methodName]) {
      this.callbacks[methodName] = this.callbacks[methodName].filter(cb => cb !== callback);
    }
  }

  async invoke(methodName: string, ...args: any[]): Promise<any> {
    return this.connection?.invoke(methodName, ...args);
  }

  private triggerEvent(methodName: string, ...args: any[]): void {
    if (this.callbacks[methodName]) {
      this.callbacks[methodName].forEach(callback => callback(...args));
    }
  }

  //simulate a signalr event
  simulateEvent(methodName: string, ...args: any[]): void {
    this.triggerEvent(methodName, ...args);
  }
}

export const notificationService = new NotificationService(); 