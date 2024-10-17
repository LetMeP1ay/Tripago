'use client';

import { createContext, useState, ReactNode, useEffect } from 'react';

type NotificationContextType = {
  notifications: string[];
  addNotification: (message: string) => void;
  clearNotifications: () => void;
};

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  clearNotifications: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = (message: string) => {
    setNotifications((prev) => {
      const updatedNotifications = [...prev, message];
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications)); // Persist immediately
      return updatedNotifications;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};