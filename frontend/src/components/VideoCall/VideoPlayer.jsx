
import React from 'react';
import { MicOff, Clock } from 'lucide-react';

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const VideoPlayer = ({
    userVideo, myVideo,
    stream, callAccepted, callEnded,
    isMuted, isScreenSharing,
    name, callDuration
}) => {
    return (
        <div className="relative h-screen w-full flex flex-col">
            {/* Main Stage (Remote Video) */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                <video
                    playsInline
                    ref={userVideo}
                    autoPlay
                    className="w-full h-full object-contain"
                />
                {/* Remote User Status / Overlay */}
                <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-aurora-500 animate-pulse"></div>
                    <span className="font-medium text-sm">{name || 'Remote User'}</span>
                </div>
            </div>

            {/* Self View (PiP) */}
            <div className="absolute top-6 right-6 w-48 aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 group transition-all hover:scale-105 z-20">
                <video
                    playsInline
                    muted
                    ref={myVideo}
                    autoPlay
                    className={`w-full h-full object-cover ${isScreenSharing ? '' : 'scale-x-[-1]'}`}
                />
                <div className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/60 px-2 py-0.5 rounded text-gray-300">
                    YOU
                </div>
                {isMuted && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500/80 p-2 rounded-full">
                        <MicOff size={16} />
                    </div>
                )}
            </div>

            {/* Call Info / Timer */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/10 z-10">
                <Clock size={14} className="text-gray-400" />
                <span className="font-mono text-sm tracking-wide">{formatTime(callDuration)}</span>
            </div>
        </div>
    );
};

export default VideoPlayer;
