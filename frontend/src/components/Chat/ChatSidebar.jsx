
import React from 'react';
import { Search } from 'lucide-react';

const ChatSidebar = ({ chats, activeChat, setActiveChat }) => {
    return (
        <div className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 hidden md:flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Messages</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search chats..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-aurora-500/20 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {chats.map((chat, i) => (
                    <div
                        key={i}
                        onClick={() => setActiveChat(chat)}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${activeChat === chat ? 'bg-aurora-50 dark:bg-aurora-900/20 border-l-4 border-aurora-500' : ''}`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500'][i % 4]
                                }`}>
                                {chat[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{chat}</h3>
                                    <span className="text-xs text-gray-500">10:30 AM</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Latest message preview goes here...</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatSidebar;
