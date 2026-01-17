
import React from 'react';
import { useNotifications } from '../hooks/useNotifications/useNotifications';
import NotificationFilters from '../components/Notifications/NotificationFilters';
import NotificationItem from '../components/Notifications/NotificationItem';
import { Bell, Filter } from 'lucide-react';

const Notifications = () => {
  const {
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    filteredNotifications,
    unreadCount
  } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Stay updated with your team activity.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={markAllAsRead}
              className="text-sm font-medium text-aurora-600 dark:text-aurora-400 hover:text-aurora-700 dark:hover:text-aurora-300 transition-colors"
            >
              Mark all as read
            </button>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <NotificationFilters filter={filter} setFilter={setFilter} unreadCount={unreadCount} />

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="text-gray-400" size={24} />
              </div>
              <h3 className="text-gray-900 dark:text-white font-medium">No notifications</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                markAsRead={markAsRead}
                deleteNotification={deleteNotification}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
