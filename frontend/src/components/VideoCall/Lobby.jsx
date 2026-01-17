
import React from 'react';
import { Users, Copy, Phone, Clock, PhoneIncoming, Mic, MicOff, Video, VideoOff, Camera } from 'lucide-react';

const Lobby = ({
    me, idToCall, setIdToCall, callUser,
    scheduledDate, setScheduledDate,
    generatedLink, setGeneratedLink,
    showNotification,
    receivingCall, name, answerCall,
    stream, myVideo, isMuted, toggleMute, toggleVideo,
    enableMedia
}) => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6 z-10 relative">

            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                {/* Left Logic Column */}
                <div className="space-y-8 relative z-20">
                    <div className="text-center lg:text-left space-y-2">
                        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-aurora-400 via-purple-400 to-pink-400 animate-gradient-x">
                            FutureCall
                        </h1>
                        <p className="text-gray-400 text-lg font-light max-w-lg mx-auto lg:mx-0">
                            A next-generation P2P conferencing experience. Secure, fast, and beautiful.
                        </p>
                    </div>

                    <div className="grid gap-6">

                        {/* 1. Identity Card */}
                        <div className="glass-card p-5 rounded-2xl border border-white/10 shadow-2xl space-y-3 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-aurora-500/5 group-hover:bg-aurora-500/10 transition-colors duration-500"></div>
                            <label className="text-xs font-bold text-aurora-300 uppercase tracking-widest relative z-10 flex items-center gap-2">
                                <Users size={14} /> Your Identity
                            </label>
                            <div className="flex gap-3 relative z-10">
                                <div className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-gray-300 flex items-center select-all">
                                    {me || <span className="animate-pulse">Generating ID...</span>}
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(me);
                                        showNotification("ID copied to clipboard!");
                                    }}
                                    className="p-3 bg-aurora-600 hover:bg-aurora-500 text-white rounded-xl shadow-lg shadow-aurora-500/20 transition-all hover:scale-105 active:scale-95"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>
                        </div>

                        {/* 2. Start Call Card */}
                        <div className="glass-card p-5 rounded-2xl border border-white/10 shadow-2xl space-y-3 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-purple-600/5 group-hover:bg-purple-600/10 transition-colors duration-500"></div>
                            <label className="text-xs font-bold text-purple-300 uppercase tracking-widest relative z-10 flex items-center gap-2">
                                <Phone size={14} /> Instant Call
                            </label>
                            <div className="flex gap-3 relative z-10">
                                <input
                                    type="text"
                                    placeholder="Enter Remote User ID"
                                    value={idToCall}
                                    onChange={(e) => setIdToCall(e.target.value)}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white placeholder-gray-600"
                                />
                                <button
                                    onClick={() => callUser(idToCall)}
                                    disabled={!idToCall || !me}
                                    className="px-6 py-3 bg-gradient-to-r from-aurora-600 to-purple-600 hover:from-aurora-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                                >
                                    <Phone size={20} /> Call
                                </button>
                            </div>
                        </div>

                        {/* 3. Schedule Card */}
                        <div className="glass-card p-5 rounded-2xl border border-white/10 shadow-2xl space-y-3 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-pink-600/5 group-hover:bg-pink-600/10 transition-colors duration-500"></div>
                            <label className="text-xs font-bold text-pink-300 uppercase tracking-widest relative z-10 flex items-center gap-2">
                                <Clock size={14} /> Schedule for Later
                            </label>

                            <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                                <input
                                    type="datetime-local"
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                />
                                <button
                                    onClick={() => {
                                        const simpleId = Math.random().toString(36).substr(2, 9);
                                        const link = `${window.location.origin}/video-call?roomID=${simpleId}`;
                                        setGeneratedLink(link);
                                        navigator.clipboard.writeText(link);
                                        showNotification("Link created & copied!", "info");
                                    }}
                                    className="px-4 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl shadow-lg shadow-pink-500/20 transition-all whitespace-nowrap text-sm"
                                >
                                    Generate Link
                                </button>
                            </div>

                            {generatedLink && (
                                <div className="relative z-10 p-3 bg-black/60 rounded-xl border border-pink-500/30 flex items-center justify-between group/link cursor-pointer hover:border-pink-500 transition-colors"
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedLink);
                                        showNotification("Link copied!", "info");
                                    }}>
                                    <span className="text-xs font-mono text-pink-200 truncate mr-2">{generatedLink}</span>
                                    <Copy size={14} className="text-gray-500 group-hover/link:text-white transition-colors" />
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Incoming Call Alert */}
                    {receivingCall && (
                        <div className="fixed top-10 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-gray-900/90 backdrop-blur-xl border border-aurora-500/50 p-4 rounded-2xl shadow-2xl z-50 animate-bounce-short flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-aurora-500 rounded-full animate-ping opacity-75"></div>
                                    <div className="relative z-10 p-3 bg-aurora-600 rounded-full">
                                        <PhoneIncoming size={24} className="text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{name || 'Unknown Caller'}</h3>
                                    <p className="text-xs text-aurora-300 font-medium uppercase tracking-wider">Incoming Video Call...</p>
                                </div>
                            </div>
                            <button
                                onClick={answerCall}
                                className="px-6 py-2 bg-gradient-to-r from-aurora-500 to-purple-600 hover:from-aurora-400 hover:to-purple-500 text-white rounded-lg font-bold shadow-lg shadow-purple-900/20 transition-all hover:scale-105"
                            >
                                Answer
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Preview Column */}
                <div className="relative aspect-video bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
                    {stream ? (
                        <>
                            <video
                                playsInline
                                muted
                                ref={myVideo}
                                autoPlay
                                className="w-full h-full object-cover transform scale-x-[-1]"
                            />
                            {/* Setup Overlay */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/5">
                                <button
                                    onClick={toggleMute}
                                    className={`p-3 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                                >
                                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                                </button>
                                <button
                                    onClick={toggleVideo}
                                    className={`p-3 rounded-full transition-all ${!stream?.getVideoTracks()[0]?.enabled ? 'bg-red-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                                >
                                    {/* Note: Logic for toggleVideo icon might need check on track enabled directly if state is not perfectly synced, but isVideoOff prop should work */}
                                    <Video size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-4">
                            <div className="w-16 h-16 rounded-full border-2 border-gray-700 flex items-center justify-center">
                                <Camera size={32} />
                            </div>
                            <p className="text-sm">Camera is off</p>
                            <button
                                onClick={enableMedia}
                                className="px-6 py-2 bg-aurora-600 hover:bg-aurora-500 rounded-full text-white font-bold transition-all hover:scale-105"
                            >
                                Enable Camera & Mic
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Lobby;
