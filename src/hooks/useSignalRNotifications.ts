import { useEffect } from 'react';
import { notificationService } from '@/api/notificationService';
import { UserStatusNotification, PotStatusNotification } from '@/types/notification';

type NotificationCallback = (notification: UserStatusNotification | PotStatusNotification) => void;

export function useSignalRNotifications(callback: NotificationCallback) {
  useEffect(() => {
    notificationService.on("DataUpdate", callback);

    return () => {
      notificationService.off("DataUpdate", callback);
    };
  }, [callback]);
}

export function usePotNotifications(callback: (notification: PotStatusNotification) => void) {
  useSignalRNotifications((notification) => {
    if (notification.type === 'pot') {
      callback(notification as PotStatusNotification);
    }
  });
}

export function useUserNotifications(callback: (notification: UserStatusNotification) => void) {
  useSignalRNotifications((notification) => {
    if (notification.type === 'user') {
      callback(notification as UserStatusNotification);
    }
  });
} 