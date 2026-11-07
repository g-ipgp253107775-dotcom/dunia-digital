import React, { useState } from 'react';
import { Sparkles, Play, FastForward, Heart, Trees } from 'lucide-react';
import { proceduralAudio } from '../utils/proceduralAudio';

interface StageCurtainProps {
  isOpen: boolean;
  onOpen: () => void;
  onSkip: () => void;
}

export const StageCurtain: React.FC<StageCurtainProps> = ({ isOpen, onOpen, onSkip }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isFullyGone, setIsFullyGone] = useState(false);

  const handleStart = () => {
    // Start music on user interaction
    proceduralAudio.startMusic();
    setIsOpening(true);

    setTimeout(() => {
      setIsFullyGone(true);
      onOpen();
    }, 2200);
  };

  const handleSkip = () => {
    proceduralAudio.startMusic();
    setIsFullyGone(true);
    onSkip();
  };

  if (isOpen && isFullyGone) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto overflow-hidden select-none">
      {/* ==========================================
          LEFT SATIN CURTAIN (Hot Pink #F5008F)
          ========================================== */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full z-20 transition-transform duration-[2200ms] ease-[cubic-bezier(0.25,1,0.5,1)] shadow-[15px_0_35px_rgba(0,0,0,0.4)] ${
          isOpening ? '-translate-x-[102%]' : 'translate-x-0'
        }`}
        style={{
          backgroundColor: '#F5008F',
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.18) 0px,
              rgba(255, 255, 255, 0.04) 22px,
              rgba(0, 0, 0, 0.22) 48px,
              rgba(255, 255, 255, 0.22) 72px,
              rgba(0, 0, 0, 0.28) 96px
            ),
            linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(0, 0, 0, 0.35) 100%)
          `,
        }}
      >
        {/* Top Valance Drapery */}
        <div
          className="absolute top-0 left-0 w-full h-14 border-b-4 border-[#FFF4E6]/60 shadow-md"
          style={{
            backgroundImage: `repeating-radial-gradient(circle at 50% 0%, #E87991, #F5008F 28px, #36233B 32px)`,
          }}
        />

        {/* Golden Tassel Cord & Tieback at edge */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-[#FFF4E6] border-2 border-[#E87991] shadow-lg flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#F5008F]" />
          </div>
          <div className="w-1 h-20 bg-gradient-to-b from-[#FFF4E6] to-[#E87991] shadow-sm" />
          <div className="w-4 h-6 rounded-b-lg bg-[#FFF4E6] border border-[#E87991]" />
        </div>
      </div>

      {/* ==========================================
          RIGHT SATIN CURTAIN (Strawberry Pink #F4A6B8)
          ========================================== */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full z-20 transition-transform duration-[2200ms] ease-[cubic-bezier(0.25,1,0.5,1)] shadow-[-15px_0_35px_rgba(0,0,0,0.4)] ${
          isOpening ? 'translate-x-[102%]' : 'translate-x-0'
        }`}
        style={{
          backgroundColor: '#F4A6B8',
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.25) 0px,
              rgba(255, 255, 255, 0.08) 22px,
              rgba(0, 0, 0, 0.18) 48px,
              rgba(255, 255, 255, 0.25) 72px,
              rgba(0, 0, 0, 0.22) 96px
            ),
            linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(0, 0, 0, 0.3) 100%)
          `,
        }}
      >
        {/* Top Valance Drapery */}
        <div
          className="absolute top-0 right-0 w-full h-14 border-b-4 border-[#FFF4E6]/60 shadow-md"
          style={{
            backgroundImage: `repeating-radial-gradient(circle at 50% 0%, #E87991, #F4A6B8 28px, #36233B 32px)`,
          }}
        />

        {/* Golden Tassel Cord & Tieback at edge */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-[#FFF4E6] border-2 border-[#E87991] shadow-lg flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#F5008F]" />
          </div>
          <div className="w-1 h-20 bg-gradient-to-b from-[#FFF4E6] to-[#E87991] shadow-sm" />
          <div className="w-4 h-6 rounded-b-lg bg-[#FFF4E6] border border-[#E87991]" />
        </div>
      </div>

      {/* ==========================================
          CENTER WELCOME TITLE CARD
          ========================================== */}
      <div
        className={`absolute inset-0 z-30 flex items-center justify-center p-4 transition-opacity duration-700 ${
          isOpening ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100'
        }`}
      >
        <div className="w-full max-w-lg bg-[#FFFCF8]/95 border-4 border-[#FFF4E6] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 text-center space-y-4">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#F5008F] text-white text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MISTERI DI SEBALIK SUNGAI • TAHUN 5</span>
          </div>

          <div>
            <span className="block text-xs sm:text-sm font-extrabold text-[#526B4C] uppercase tracking-wider mb-1">
              SELAMAT DATANG KE DUNIA PENGEMBARAAN
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#36233B] tracking-tight leading-tight">
              PENGEMBARAAN PULAU ILMU
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#E87991] mt-1.5">
              Panduan Guru Bahasa Melayu: 6 Rumah Penerokaan 3D Interaktif
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[#3b2a26] leading-relaxed bg-[#FFF4E6] p-3.5 rounded-2xl border border-[#F4A6B8]/50">
            Terokai perancangan kurikulum, kemahiran mendengar dan bertutur, pendekatan tematik kelestarian alam, serta pembelajaran inkuiri dan koperatif.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#F5008F] to-[#E87991] hover:from-[#d6007d] hover:to-[#d0657c] text-white text-sm font-black rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>BUKA TIRAI & MULAKAN</span>
            </button>

            <button
              onClick={handleSkip}
              className="w-full sm:w-auto px-5 py-3.5 bg-[#FFF4E6] hover:bg-white text-[#526B4C] text-xs font-bold rounded-2xl border border-[#9DBB69]/50 transition-colors flex items-center justify-center gap-1.5"
            >
              <FastForward className="w-4 h-4 text-[#9DBB69]" />
              <span>LANGKAU PEMBUKAAN</span>
            </button>
          </div>

          <div className="text-[11px] text-[#526B4C] flex items-center justify-center gap-1.5 pt-1">
            <span>🎵 Muzik latar akan dimulakan secara automatik selepas butang ditekan</span>
          </div>
        </div>
      </div>
    </div>
  );
};
