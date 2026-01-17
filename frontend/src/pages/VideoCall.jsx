import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Video, Sparkles, MapPin, Loader2, ArrowLeft, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const VideoCall = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL or Auth
  const initialRoom = searchParams.get('room') || 'aurora-room';
  const initialName = user?.name || 'User';

  const [room, setRoom] = useState(initialRoom);
  const [name, setName] = useState(initialName);
  const [isJoined, setIsJoined] = useState(false);
  const [jitsiLoaded, setJitsiLoaded] = useState(false);

  const handleJoin = useCallback((e) => {
    if (e) e.preventDefault();
    if (!room || !name) {
      toast.error('Please enter both room name and your name');
      return;
    }

    // Update URL to reflect current room
    setSearchParams({ room });
    setIsJoined(true);
  }, [room, name, setSearchParams]);

  const handleClose = useCallback(() => {
    setIsJoined(false);
    setJitsiLoaded(false);
    toast.info('Left the meeting');
  }, []);

  if (isJoined) {
    return (
      <MeetingView
        room={room}
        name={name}
        handleClose={handleClose}
        jitsiLoaded={jitsiLoaded}
        setJitsiLoaded={setJitsiLoaded}
      />
    );
  }

  return (
    <LobbyView
      room={room}
      setRoom={setRoom}
      name={name}
      setName={setName}
      handleJoin={handleJoin}
    />
  );
};

// Sub-component for the Meeting Interface
const MeetingView = ({ room, name, handleClose, jitsiLoaded, setJitsiLoaded }) => {
  const configOverwrite = useMemo(() => ({
    startWithAudioMuted: true,
    disableThirdPartyRequests: true,
    prejoinPageEnabled: false,
    theme: {
      default: 'dark'
    },
    resolution: 720,
    constraints: {
      video: {
        height: {
          ideal: 720,
          max: 720,
          min: 240
        }
      }
    }
  }), []);

  const interfaceConfigOverwrite = useMemo(() => ({
    TOOLBAR_BUTTONS: [
      'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
      'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
      'sharedvideo', 'settings', 'raisehand',
      'videoquality', 'filmstrip', 'tileview', 'videobackgroundblur', 'mute-everyone'
    ],
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    DEFAULT_BACKGROUND: '#0B0C15',
    DEFAULT_REMOTE_DISPLAY_NAME: 'Fellow Aurora User',
  }), []);

  return (
    <div className="h-screen w-full bg-[#0B0C15] relative flex flex-col overflow-hidden">
      {/* Custom Header */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={handleClose}
          className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 transition-all border border-white/10 shadow-lg"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Leave</span>
        </button>
      </div>

      {/* Loading State Overlay */}
      {!jitsiLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0B0C15] z-40">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
              <Loader2 size={48} className="text-blue-500 animate-spin relative z-10" />
            </div>
            <p className="text-gray-400 font-medium animate-pulse">Securely connecting to room...</p>
          </div>
        </div>
      )}

      <JitsiMeeting
        domain="meet.jit.si"
        roomName={room}
        configOverwrite={configOverwrite}
        interfaceConfigOverwrite={interfaceConfigOverwrite}
        userInfo={{ displayName: name }}
        onApiReady={(externalApi) => {
          externalApi.on('videoConferenceJoined', () => setJitsiLoaded(true));
          externalApi.on('videoConferenceLeft', handleClose);
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
          iframeRef.style.border = 'none';
          iframeRef.style.background = '#0B0C15';
        }}
      />
    </div>
  );
};

// Sub-component for the Lobby Interface
const LobbyView = ({ room, setRoom, name, setName, handleJoin }) => {
  const [copied, setCopied] = useState(false);

  const copyInvite = () => {
    const url = `${window.location.origin}/video-call?room=${encodeURIComponent(room)}`;
    navigator.clipboard.writeText(url);
    toast.success('Invitation link copied to clipboard');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0C15] text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900/0 to-gray-900/0"></div>
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-violet-600 shadow-2xl shadow-blue-500/20 mb-6 animate-float">
            <Video size={36} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Aurora Meet
          </h1>
          <p className="text-gray-400 font-medium">Free, unlimited video conferencing</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleJoin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Display Name</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300 -z-10"></div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Sparkles size={18} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-900/50 border border-white/10 text-white placeholder-gray-500 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-transparent focus:ring-1 focus:ring-white/20 transition-all font-medium"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
                Room Name
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300 -z-10"></div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 pointer-events-none text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full bg-gray-900/50 border border-white/10 text-white placeholder-gray-500 rounded-xl py-3.5 pl-11 pr-12 focus:outline-none focus:border-transparent focus:ring-1 focus:ring-white/20 transition-all font-medium"
                    placeholder="e.g. Daily Standup"
                  />
                  <button
                    type="button"
                    onClick={copyInvite}
                    className="absolute right-2 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Copy Invite Link"
                  >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              <span>Join Meeting Now</span>
              <Sparkles size={18} className="transition-transform group-hover:rotate-12" />
            </button>

            <div className="text-center">
              <p className="text-[10px] text-gray-500/80">
                Powered by <span className="font-bold text-gray-500">Jitsi Meet</span> • No signup required
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;