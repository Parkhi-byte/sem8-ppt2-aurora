
import React from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, MessageSquare, Phone } from 'lucide-react';

const ControlBar = ({
    isMuted, toggleMute,
    isVideoOff, toggleVideo,
    isScreenSharing, handleScreenShare,
    showChat, setShowChat,
    unreadMessages,
    leaveCall
}) => {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur-xl px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/5 shadow-2xl z-20">

            <button
                onClick={toggleMute}
                className={`p-4 rounded-xl transition-all duration-200 ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                title="Toggle Mute"
            >
                {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            <button
                onClick={toggleVideo}
                className={`p-4 rounded-xl transition-all duration-200 ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                title="Toggle Camera"
            >
                {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
            </button>

            <button
                onClick={handleScreenShare}
                className={`p-4 rounded-xl transition-all duration-200 ${isScreenSharing ? 'bg-purple-500/20 text-purple-500' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                title="Share Screen"
            >
                <Monitor size={22} />
            </button>

            <button
                onClick={() => setShowChat(!showChat)}
                className={`p-4 rounded-xl transition-all duration-200 relative ${showChat ? 'bg-aurora-500/20 text-aurora-500' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                title="Chat"
            >
                <MessageSquare size={22} />
                {unreadMessages && !showChat && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </button>

            <div className="w-px h-10 bg-gray-700 mx-2"></div>

            <button
                onClick={leaveCall}
                className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 font-bold shadow-lg shadow-red-900/20 transition-all hover:scale-105"
            >
                <Phone size={22} className="rotate-[135deg]" />
            </button>
        </div>
    );
};

export default ControlBar;
