
import React from 'react';
import { Shield, Users } from 'lucide-react';

const Notification = ({ notification }) => {
    if (!notification) return null;

    return (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-down ${notification.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-gray-800/90 text-white border border-gray-700'
            } backdrop-blur-md`}>
            {notification.type === 'error' ? <Shield size={20} /> : <Users size={20} />}
            <span className="font-medium">{notification.text}</span>
        </div>
    );
};

export default Notification;
