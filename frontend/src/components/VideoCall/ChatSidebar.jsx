
import React, { useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const formatTime = (seconds) => {
    // Basic format like '05' for seconds, actual logic should be robust if passing full timestamp
    return seconds.toString().padStart(2, '0');
};

const ChatSidebar = ({
    showChat, setShowChat,
    messages, chatEndRef,
    newMessage, setNewMessage, sendMessage
}) => {

    // Auto-scroll handled in parent or here? 
    // Parent passed chatEndRef, so let's use it.
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, showChat, chatEndRef]);

    return (
        <div className={`absolute top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-l border-gray-800 transform transition-transform duration-300 z-30 ${showChat ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2"><MessageSquare size={18} /> Chat</h3>
                    <button onClick={() => setShowChat(false)} className="p-1 hover:bg-gray-800 rounded-lg"><X size={18} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${msg.sender === 'Me' ? 'bg-gradient-to-r from-aurora-600 to-purple-600 text-white rounded-br-sm shadow-md' : 'bg-gray-800 text-gray-200 rounded-bl-sm'
                                }`}>
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-gray-500 mt-1 px-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                    <div ref={chatEndRef}></div>
                </div>
                <div className="p-3 border-t border-gray-800">
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-aurora-500 outline-none transition-all placeholder-gray-500"
                        />
                        <button type="submit" className="p-2 bg-aurora-600 rounded-xl hover:bg-aurora-500 transition-colors shadow-lg shadow-aurora-500/20">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatSidebar;
