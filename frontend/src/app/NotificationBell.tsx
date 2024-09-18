import React, { useState } from 'react';
import { FaBell, FaTimes } from "react-icons/fa";

const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button 
                className="flex justify-center items-center w-10 h-10 rounded-full border-2 border-black p-2"
                onClick={handleClick}
            >
                <FaBell size={20} className="text-black" />
            </button>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full m-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Notifications</h2>
                            <button onClick={handleClick} className="text-gray-500 hover:text-gray-700">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-600">Your notification tray is empty.</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NotificationBell;

/*import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';

const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative z-50">
            <button 
                className="flex justify-center items-center w-10 h-10 rounded-full border-2 border-black p-2" onClick={handleClick}>
                <FaBell size={20} className="text-black" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-md text-black">
                    
                        <h3 className="font-bold mb-2 p-2">Your Tray is Empty</h3>
                        <p className="p-2">Notifications go here.</p>
                    
                </div>
            )}
        </div>
    );
}; phone ver*/