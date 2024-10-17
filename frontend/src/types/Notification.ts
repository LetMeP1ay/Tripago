import { Timestamp } from "firebase/firestore";

export type AppNotification = {
  id: string;
  message: string;
  timestamp: Timestamp;
};
