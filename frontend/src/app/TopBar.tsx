import React from 'react';
import NotificationBell from './NotificationBell';
import Image from "next/image";

const TopBar: React.FC = () => {
    return (
        <div className="flex justify-between items-center h-16 px-4 bg-white relative z-40">
            <div className="left-section">
                <Image src="Logo.svg" alt="tripago logo" width={100} height={100} className="p-2" />
            </div>
            <div className="right-section">
                <NotificationBell />
            </div>
        </div>
    );
};

export default TopBar;

/*<button className="notification-button">
                    <i className="bell-icon">bell</i>
                </button>
                
                

import React from 'react';
import NotificationBell from './NotificationBell';
import Image from "next/image";

const TopBar: React.FC = () => {
    return (
        <div className="flex flex-row justify-between items-center p-3">
            <div className="left-section">
                <Image src="Logo.svg" alt="tripago logo" width={100} height={100}/>
            </div>
            <div className="right-section">
                <NotificationBell />
            </div>
        </div>
    );
};

export default TopBar;                */