
import { useState, useMemo } from 'react';
import { MessageCircle, Video, FileText, UserPlus, Calendar } from 'lucide-react';

export const useNotifications = () => {
    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'message',
            title: 'New message from Satyam',
            description: 'Hey! Can we schedule a meeting for tomorrow?',
            time: '5m ago',
            read: false,
            icon: MessageCircle,
            color: 'bg-blue-500'
        },
        {
            id: 2,
            type: 'video',
            title: 'Video call invitation',
            description: 'Prachi invited you to join "Weekly Sync"',
            time: '15m ago',
            read: false,
            icon: Video,
            color: 'bg-fuchsia-500'
        },
        {
            id: 3,
            type: 'document',
            title: 'Document shared',
            description: 'Sneha shared "Project_Plan.pdf"',
            time: '1h ago',
            read: true,
            icon: FileText,
            color: 'bg-purple-500'
        },
        {
            id: 4,
            type: 'user',
            title: 'New team member',
            description: 'Parkhi joined your workspace',
            time: '2h ago',
            read: true,
            icon: UserPlus,
            color: 'bg-indigo-500'
        },
        {
            id: 5,
            type: 'calendar',
            title: 'Meeting reminder',
            description: 'Team standup in 30 minutes',
            time: '3h ago',
            read: false,
            icon: Calendar,
            color: 'bg-red-500'
        }
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    const filteredNotifications = useMemo(() => {
        return filter === 'all'
            ? notifications
            : filter === 'unread'
                ? notifications.filter(n => !n.read)
                : notifications;
    }, [notifications, filter]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return {
        filter,
        setFilter,
        notifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        filteredNotifications,
        unreadCount
    };
};
