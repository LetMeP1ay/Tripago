"use client";

import React, { useState, useContext, useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { NotificationContext } from "@/context/NotificationContext";
import { AppNotification } from "../types";

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, clearNotifications } = useContext(NotificationContext);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setHasUnread(true);
      console.log("Unread notification exists");
    } else {
      setHasUnread(false);
    }
  }, [notifications]);

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  return (
    <div className="relative">
      <button
        className={`flex justify-center items-center w-8 h-8 md:w-10 md:h-10 md:border-white rounded-full border-2 border-black 
          opacity-20 p-2 hover:opacity-40 active:opacity-60 transition-all duration-300 ease-in-out 
          ${
            hasUnread
              ? "bg-blue-500"
              : "md:opacity-60 md:hover:opacity-80 md:active:opacity-100"
          }`}
        onClick={handleClick}
        aria-label="Notifications"
      >
        <FaBell
          size={20}
          className="text-black w-5 h-5 md:w-6 md:h-6 md:text-white"
        />
        {hasUnread && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            !
          </span>
        )}
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Notifications
              </h2>
              <button
                onClick={handleClick}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Close Notifications"
              >
                <FaTimes size={20} className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <div className="mt-4 max-h-60 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  Your notification tray is empty.
                </p>
              ) : (
                <ul>
                  {notifications.map((notification: AppNotification) => (
                    <li
                      key={notification.id}
                      className="mb-2 text-gray-800 dark:text-gray-200"
                    >
                      {notification.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
              >
                Clear All Notifications
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
