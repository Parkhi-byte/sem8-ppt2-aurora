
import React from 'react';

const NotificationFilters = ({ filter, setFilter, unreadCount }) => {
    return (
        <div className="flex space-x-2 mb-6">
            <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
            >
                All
            </button>
            <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${filter === 'unread'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-700'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
            >
                <span>Unread</span>
                {unreadCount > 0 && (
                    <span className="bg-aurora-100 dark:bg-aurora-900/30 text-aurora-600 dark:text-aurora-400 px-1.5 py-0.5 rounded-full text-xs">
                        {unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
};

export default NotificationFilters;
