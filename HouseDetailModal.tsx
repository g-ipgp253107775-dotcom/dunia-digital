import React, { useState, useEffect } from 'react';
import { HouseConfig } from '../types';
import { textToSpeech, SpeechState, VoiceInfo } from '../utils/textToSpeech';
import { proceduralAudio } from '../utils/proceduralAudio';
import {
  X,
  Volume2,
  Pause,
  Play,
  Square,
  RotateCcw,
  Sparkles,
  BookOpen,
  Target,
  TreePine,
  Search,
  Users,
  ClipboardCheck,
  Check,
  ShieldCheck,
  Gauge,
} from 'lucide-react';

interface HouseDetailModalProps {
  house: HouseConfig | null;
  onClose: () => void;
  collectedCrystals: number[]; // array of collected house IDs
  onCollectCrystal: (houseId: number) => void;
}

export const HouseDetailModal: React.FC<HouseDetailModalProps> = ({
  house,
  onClose,
  collectedCrystals,
  onCollectCrystal,
}) => {
  const [speechState, setSpeechState] = useState<SpeechState>('idle');
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [voiceInfo, setVoiceInfo] = useState<VoiceInfo>({
    voice: null,
    name: 'Sistem Lalai',
    lang: 'ms-MY',
    isMalayMalaysia: false,
    note: '',
  });

  useEffect(() => {
    // Check voice info
    setVoiceInfo(textToSpeech.getVoiceInfo());

    // Register callback for TTS state changes
    textToSpeech.registerStateCallback((state) => {
      setSpeechState(state);
      if (state === 'playing') {
        proceduralAudio.duckAudio(true);
      } else {
        proceduralAudio.duckAudio(false);
      }
    });

    // Cleanup when house changes or modal unmounts
    return () => {
      textToSpeech.stop();
      proceduralAudio.duckAudio(false);
      textToSpeech.registerStateCallback(() => {});
    };
  }, [house]);

  if (!house) return null;

  const isCollected = collectedCrystals.includes(house.id);

  const handlePlayTTS = () => {
    if (speechState === 'paused') {
      textToSpeech.resume();
      proceduralAudio.duckAudio(true);
    } else {
      textToSpeech.setRate(speechRate);
      textToSpeech.speak(house.content.speechScript);
      proceduralAudio.duckAudio(true);
    }
  };

  const handlePauseTTS = () => {
    textToSpeech.pause();
    proceduralAudio.duckAudio(false);
  };

  const handleStopTTS = () => {
    textToSpeech.stop();
    proceduralAudio.duckAudio(false);
  };

  const handleRestartTTS = () => {
    textToSpeech.stop();
    textToSpeech.setRate(speechRate);
    textToSpeech.speak(house.content.speechScript);
  };

  const handleChangeRate = (rate: number) => {
    setSpeechRate(rate);
    textToSpeech.setRate(rate);
    if (speechState === 'playing') {
      // Re-trigger with new rate seamlessly
      textToSpeech.stop();
      textToSpeech.speak(house.content.speechScript);
    }
  };

  const handleCollect = () => {
    if (isCollected) return;
    textToSpeech.stop();
    proceduralAudio.duckAudio(false);
    proceduralAudio.playCrystalChime(house.id);
    onCollectCrystal(house.id);
    onClose();
  };

  const renderIcon = (name: string) => {
    const props = { className: 'w-6 h-6 text-white' };
    switch (name) {
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Target': return <Target {...props} />;
      case 'TreePine': return <TreePine {...props} />;
      case 'Search': return <Search {...props} />;
      case 'Users': return <Users {...props} />;
      case 'ClipboardCheck': return <ClipboardCheck {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  // Helper to render markdown bolding **text** cleanly
  const renderFormattedText = (raw: string) => {
    const parts = raw.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-extrabold text-[#F5008F]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end p-2 sm:p-6 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-xl max-h-[92vh] flex flex-col bg-[#FFFCF8]/95 border-2 border-[#E87991] rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Header */}
        <div
          className="p-4 sm:p-5 text-white flex items-center justify-between relative shadow-sm"
          style={{ backgroundColor: house.themeColor }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-xs">
              {renderIcon(house.iconName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-md">
                  RUMAH 0{house.id}
                </span>
                <span className="text-xs font-bold text-white/90">
                  {house.content.badge}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-wide drop-shadow-xs">
                {house.content.signboardTitle}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              textToSpeech.stop();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition-colors shadow-xs"
            title="Tutup (Sambung Berjalan)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text-to-Speech Control Center */}
        <div className="bg-[#FFF4E6] border-b border-[#F4A6B8]/50 p-3 sm:px-5 sm:py-3.5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Primary Action Button */}
            {speechState === 'playing' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePauseTTS}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-[#9DBB69] hover:bg-[#88a555] text-white text-xs font-black rounded-xl shadow-xs transition-colors"
                >
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Jeda Suara</span>
                </button>
                <button
                  onClick={handleStopTTS}
                  className="p-1.5 bg-[#FFF4E6] hover:bg-[#F4A6B8]/30 text-[#36233B] rounded-xl border border-[#E87991]/50 transition-colors"
                  title="Hentikan Bacaan"
                >
                  <Square className="w-4 h-4 text-[#F5008F]" />
                </button>
                <button
                  onClick={handleRestartTTS}
                  className="p-1.5 bg-[#FFF4E6] hover:bg-[#F4A6B8]/30 text-[#36233B] rounded-xl border border-[#E87991]/50 transition-colors"
                  title="Ulang Dari Awal"
                >
                  <RotateCcw className="w-4 h-4 text-[#526B4C]" />
                </button>
              </div>
            ) : speechState === 'paused' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayTTS}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-[#F5008F] hover:bg-[#d6007d] text-white text-xs font-black rounded-xl shadow-xs transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Sambung Bacaan</span>
                </button>
                <button
                  onClick={handleStopTTS}
                  className="p-1.5 bg-[#FFF4E6] hover:bg-[#F4A6B8]/30 text-[#36233B] rounded-xl border border-[#E87991]/50"
                  title="Hentikan Bacaan"
                >
                  <Square className="w-4 h-4 text-[#F5008F]" />
                </button>
              </div>
            ) : (
              <button
                onClick={handlePlayTTS}
                className="flex items-center gap-2 px-4 py-2 bg-[#F5008F] hover:bg-[#d6007d] text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95"
              >
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>🔊 DENGAR PENERANGAN (TTS)</span>
              </button>
            )}

            {/* Reading Speed Multipliers */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#9DBB69]/40 text-[11px] font-bold text-[#526B4C]">
              <Gauge className="w-3.5 h-3.5 text-[#9DBB69] ml-1 mr-0.5" />
              <span>Kelajuan:</span>
              {[0.8, 1.0, 1.25].map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleChangeRate(spd)}
                  className={`px-2 py-0.5 rounded-lg transition-colors ${
                    speechRate === spd
                      ? 'bg-[#9DBB69] text-white'
                      : 'hover:bg-[#FFF4E6] text-[#36233B]'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Voice Status Indicator */}
          <div className="flex items-center justify-between text-[11px] text-[#526B4C] font-semibold pt-0.5">
            <div className="flex items-center gap-1.5 truncate">
              <span
                className={`w-2 h-2 rounded-full ${
                  speechState === 'playing'
                    ? 'bg-[#F5008F] animate-ping'
                    : speechState === 'paused'
                    ? 'bg-amber-500'
                    : 'bg-[#9DBB69]'
                }`}
              />
              <span className="truncate">
                {speechState === 'playing'
                  ? 'Sedang membaca kandungan...'
                  : speechState === 'paused'
                  ? 'Bacaan dijeda'
                  : speechState === 'ended'
                  ? 'Bacaan selesai'
                  : 'Sedia untuk dibacakan'}
              </span>
            </div>

            <div className="text-[10px] text-[#3b2a26]/70 truncate max-w-[220px]">
              {voiceInfo.isMalayMalaysia ? '🇲🇾 Suara BM Malaysia Aktif' : 'Enjin Suara Lalai'}
            </div>
          </div>
        </div>

        {/* Academic Content Sections (Organized List Format) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-sm flex-1 scrollbar-thin">
          {house.content.sections.map((sec, sIdx) => (
            <div
              key={sIdx}
              className="bg-white p-3.5 rounded-2xl border border-[#F4A6B8]/50 shadow-xs space-y-2"
            >
              <h3 className="text-xs font-black text-[#526B4C] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E87991]" />
                {sec.title}
              </h3>

              <ul className="space-y-1.5 text-xs text-[#3b2a26] leading-relaxed">
                {sec.items.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-2">
                    {sec.isNumbered ? (
                      <span className="w-4 h-4 rounded-full bg-[#FFF4E6] text-[#F5008F] font-black flex items-center justify-center shrink-0 text-[10px] border border-[#F4A6B8]/50 mt-0.5">
                        {iIdx + 1}
                      </span>
                    ) : (
                      <span className="text-[#9DBB69] font-black shrink-0 mt-0.5">•</span>
                    )}
                    <span className="flex-1">{renderFormattedText(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {house.content.importantNotes && (
            <div className="bg-[#FFF4E6] p-3 rounded-xl border border-[#9DBB69]/50 text-xs text-[#526B4C] font-medium leading-relaxed">
              <span className="font-bold text-[#F5008F]">💡 Catatan Guru: </span>
              {house.content.importantNotes.map((note, idx) => (
                <span key={idx}>{note}</span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions: Collect Crystal & Close */}
        <div className="bg-[#FFF4E6] p-3.5 sm:px-5 border-t border-[#E87991]/40 flex flex-wrap items-center justify-between gap-3">
          {/* Crystal Reward Collection Button */}
          {isCollected ? (
            <button
              disabled
              className="flex items-center gap-2 px-5 py-2.5 bg-[#9DBB69]/30 text-[#526B4C] border border-[#9DBB69] rounded-2xl text-xs font-black shadow-xs cursor-not-allowed opacity-90"
            >
              <ShieldCheck className="w-4 h-4 text-[#526B4C]" />
              <span>KRISTAL TELAH DIKUMPUL</span>
            </button>
          ) : (
            <button
              onClick={handleCollect}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F5008F] to-[#E87991] hover:from-[#d6007d] hover:to-[#d0657c] text-white rounded-2xl text-xs font-black shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>SELESAI MENEROKA – KUMPUL KRISTAL</span>
            </button>
          )}

          <button
            onClick={() => {
              textToSpeech.stop();
              onClose();
            }}
            className="px-4 py-2 bg-white hover:bg-[#FFFCF8] text-[#36233B] text-xs font-bold rounded-xl border border-[#E87991]/50 shadow-xs transition-colors"
          >
            Tutup (Sambung Berjalan)
          </button>
        </div>
      </div>
    </div>
  );
};
