
import React from 'react';
import { useChat } from '../hooks/useChat/useChat';
import ChatSidebar from '../components/Chat/ChatSidebar';
import ChatWindow from '../components/Chat/ChatWindow';

const Chat = () => {
  const {
    message,
    setMessage,
    messages,
    activeChat,
    setActiveChat,
    chats,
    handleSend
  } = useChat();

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 flex animate-fade-in">
      {/* Sidebar - Chat List */}
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />

      {/* Main Chat Area */}
      <ChatWindow
        activeChat={activeChat}
        messages={messages}
        message={message}
        setMessage={setMessage}
        handleSend={handleSend}
      />
    </div>
  );
};

export default Chat;