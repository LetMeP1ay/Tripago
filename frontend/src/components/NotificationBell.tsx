"use client";

import React, { useState, useContext, useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { NotificationContext } from "./NotificationContext";

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, clearNotifications } = useContext(NotificationContext);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setHasUnread(true);
      console.log('Unread notification exists');
    }
  }, [notifications]);

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  return (
    <div onClick={handleClick}>
      <button className={`flex justify-center items-center w-8 h-8 md:w-10 md:h-10 md:border-white rounded-full border-2 border-black 
          opacity-20 p-2 hover:opacity-40 active:opacity-60 transition-all duration-600 ease-in-out 
          ${hasUnread ? "bg-blue-500" : "md:opacity-60 md:hover:opacity-80 md:active:opacity-100"}`} onClick={handleClick}>
        <FaBell size={0} className="text-black w-8 h-8 md:w-10 md:h-10 md:text-white" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Notifications</h2>
              <button onClick={handleClick} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={0} className="w-8 h-8 md:w-10 md:h-10" />
              </button>
            </div>
            <div className="mt-4">
              {notifications.length === 0 ? (
                <p className="text-gray-600">Your notification tray is empty.</p>
              ) : (
                <ul>
                  {notifications.map((notification, index) => (
                    <li key={index} className="mb-2 text-gray-800">
                      {notification}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button onClick={clearNotifications} className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md">
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
