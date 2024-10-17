"use client";

import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { AppNotification, NotificationContextType } from "../types";
import { AuthContext } from "./AuthContext";
import { db } from "../../firebase-config";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDocs,
  serverTimestamp,
  WriteBatch,
  writeBatch,
} from "firebase/firestore";

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  clearNotifications: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let unsubscribe: () => void;

    const fetchNotifications = () => {
      if (user) {
        const notificationsRef = collection(
          db,
          "notifications",
          user.uid,
          "userNotifications"
        );
        const q = query(notificationsRef, orderBy("timestamp", "desc"));

        unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const fetchedNotifications: AppNotification[] = [];
            querySnapshot.forEach((docSnap) => {
              const data = docSnap.data();
              fetchedNotifications.push({
                id: docSnap.id,
                message: data.message,
                timestamp: data.timestamp,
              });
            });
            setNotifications(fetchedNotifications);
          },
          (error) => {
            console.error("Error fetching notifications:", error);
            setError("Failed to fetch notifications.");
          }
        );
      } else {
        setNotifications([]);
      }
    };

    fetchNotifications();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const addNotification = async (message: string) => {
    if (!user) {
      console.warn("User not authenticated. Cannot add notification.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const notificationsRef = collection(
        db,
        "notifications",
        user.uid,
        "userNotifications"
      );
      await addDoc(notificationsRef, {
        message,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding notification:", error);
      setError("Failed to add notification.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearNotifications = async () => {
    if (!user) {
      console.warn("User not authenticated. Cannot clear notifications.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const notificationsRef = collection(
        db,
        "notifications",
        user.uid,
        "userNotifications"
      );
      const q = query(notificationsRef);

      const querySnapshot = await getDocs(q);
      const batch: WriteBatch = writeBatch(db);

      querySnapshot.docs.forEach((docSnap) => {
        batch.delete(
          doc(db, "notifications", user.uid, "userNotifications", docSnap.id)
        );
      });

      await batch.commit();
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
      setError("Failed to clear notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      notifications,
      addNotification,
      clearNotifications,
    }),
    [notifications]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
