import { AppNotification } from "./Notification";

export type NotificationContextType = {
  notifications: AppNotification[];
  addNotification: (message: string) => void;
  clearNotifications: () => void;
};
