"use client";

import React, { useEffect } from "react";

interface NotificationPopupProps {
  message: string;
  onClose: () => void;
  show: boolean;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  message,
  onClose,
  show,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 bg-white p-4 rounded shadow-lg transition-all duration-300 ease-in-out transform ${
        show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="flex justify-between items-center">
        <p>{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationPopup;
