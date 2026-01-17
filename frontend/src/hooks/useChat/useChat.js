
import { useState } from 'react';

export const useChat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Hey team! How's the project going?", sender: "Satyam Katiyar", time: "10:30 AM", isMe: false },
        { id: 2, text: "Going great! Just finished the UI components.", sender: "Prachi Gangwar", time: "10:32 AM", isMe: false },
        { id: 3, text: "Awesome! I'll start integrating the backend then.", sender: "You", time: "10:33 AM", isMe: true },
        { id: 4, text: "Perfect. Let's sync up later today.", sender: "Satyam Katiyar", time: "10:35 AM", isMe: false },
    ]);
    const [activeChat, setActiveChat] = useState('Team Workspace');

    const chats = ['Team Workspace', 'Design Team', 'Engineering', 'General'];

    const handleSend = () => {
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: message,
                sender: "You",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: true
            };
            setMessages([...messages, newMessage]);
            setMessage('');
        }
    };

    return {
        message,
        setMessage,
        messages,
        activeChat,
        setActiveChat,
        chats,
        handleSend
    };
};
