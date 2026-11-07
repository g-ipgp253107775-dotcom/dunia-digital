import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Music,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { proceduralAudio, MusicState } from '../utils/proceduralAudio';

export const MusicPlayerBar: React.FC = () => {
  const [audioState, setAudioState] = useState(proceduralAudio.getState());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = proceduralAudio.subscribe(() => {
      setAudioState(proceduralAudio.getState());
    });
    return unsubscribe;
  }, []);

  const handlePlayPause = () => {
    if (audioState.state === 'playing') {
      proceduralAudio.pauseMusic();
    } else {
      proceduralAudio.resumeMusic();
    }
  };

  const handleStop = () => {
    proceduralAudio.stopMusic();
  };

  const handleToggleMute = () => {
    proceduralAudio.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    proceduralAudio.setVolume(val);
  };

  const isPlaying = audioState.state === 'playing';

  return (
    <div className="relative pointer-events-auto">
      {/* Compact Main Button Pill */}
      <div className="flex items-center gap-1.5 bg-[#FFFCF8]/95 border-2 border-[#E87991] p-1.5 rounded-2xl shadow-lg">
        {/* Play / Pause Toggle Button */}
        <button
          onClick={handlePlayPause}
          className={`p-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
            isPlaying
              ? 'bg-[#9DBB69] text-white shadow-xs'
              : 'bg-[#FFF4E6] text-[#36233B] hover:bg-[#F4A6B8]/30'
          }`}
          title={isPlaying ? 'Jeda Muzik' : 'Mainkan Muzik'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-white" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-[#F5008F] text-[#F5008F]" />
          )}
          <span className="text-[11px] font-black hidden sm:inline">
            {isPlaying ? 'Muzik Aktif' : 'Muzik'}
          </span>
        </button>

        {/* Mute Button */}
        <button
          onClick={handleToggleMute}
          className="p-2 rounded-xl bg-[#FFF4E6] hover:bg-[#F4A6B8]/20 text-[#36233B] transition-colors"
          title={audioState.isMuted ? 'Buka Suara' : 'Senyapkan Suara'}
        >
          {audioState.isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-[#E87991]" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#526B4C]" />
          )}
        </button>

        {/* Expand / Collapse Settings Dropdown */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg text-[#526B4C] hover:bg-[#FFF4E6] transition-colors"
          title="Kawal Kelantangan Muzik"
        >
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Control Card */}
      {isExpanded && (
        <div className="absolute top-12 right-0 w-64 bg-[#FFFCF8] border-2 border-[#E87991] rounded-2xl shadow-xl p-3.5 space-y-2.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-[#F4A6B8]/50 pb-2">
            <div className="flex items-center gap-1.5">
              <Music className="w-4 h-4 text-[#F5008F]" />
              <span className="text-xs font-black text-[#36233B]">
                🎵 Muzik Pulau Ilmu
              </span>
            </div>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                isPlaying ? 'bg-[#9DBB69]/20 text-[#526B4C]' : 'bg-[#FFF4E6] text-[#E87991]'
              }`}
            >
              {audioState.isDucked
                ? '🔉 Suara Redup (TTS)'
                : isPlaying
                ? 'Sedang Main'
                : audioState.state === 'paused'
                ? 'Dijeda'
                : 'Berhenti'}
            </span>
          </div>

          <div className="text-[10px] text-[#526B4C] leading-snug">
            Trek instrumental original bernada fantasi pengembaraan (piano lembut, marimba, loceng ajaib & sintesis).
          </div>

          {/* Volume Slider */}
          <div className="space-y-1 bg-[#FFF4E6] p-2.5 rounded-xl border border-[#9DBB69]/40">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#3b2a26]">
              <span>Kelantangan Muzik:</span>
              <span className="font-black text-[#F5008F]">
                {audioState.isMuted ? 'Mute' : `${Math.round(audioState.volume * 100)}%`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioState.isMuted ? 0 : audioState.volume}
              onChange={handleVolumeChange}
              className="w-full accent-[#F5008F] cursor-pointer h-1.5 bg-white rounded-lg"
            />
          </div>

          {/* Transport Buttons: Play, Pause, Stop */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={handlePlayPause}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5008F] text-white text-xs font-black rounded-xl shadow-xs hover:bg-[#d6007d]"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>Jeda</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Mainkan</span>
                </>
              )}
            </button>

            <button
              onClick={handleStop}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#FFF4E6] hover:bg-[#F4A6B8]/30 text-[#36233B] text-xs font-bold rounded-xl border border-[#E87991]/50"
            >
              <Square className="w-3 h-3 text-[#F5008F]" />
              <span>Henti</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
