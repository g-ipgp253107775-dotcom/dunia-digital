import React, { useState } from 'react';
import { HouseConfig, HOUSES_DATA, ENVIRONMENT_PRESETS } from '../types';
import { CameraMode, SpeedTier } from './ThreeWorld';
import { VirtualJoystick } from './VirtualJoystick';
import { MusicPlayerBar } from './MusicPlayerBar';
import {
  RotateCcw,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowUp,
  HelpCircle,
  Eye,
  Gauge,
  Film,
  Award,
  RefreshCw,
  X,
  AlertTriangle,
  Gift,
} from 'lucide-react';

interface UIOverlayProps {
  nearbyHouse: HouseConfig | null;
  onOpenHouse: (house: HouseConfig) => void;
  collectedCrystals: number[];
  onResetCamera: () => void;
  presetKey: 'cerah' | 'senja' | 'fantasi';
  onChangePreset: (preset: 'cerah' | 'senja' | 'fantasi') => void;
  cameraMode: CameraMode;
  onToggleCameraMode: () => void;
  speedTier: SpeedTier;
  onChangeSpeedTier: (tier: SpeedTier) => void;
  onOpenGuide: () => void;
  onReopenCurtains: () => void;
  onVirtualMove: (vector: { x: number; z: number }) => void;
  onVirtualJump: (isJumping: boolean) => void;
  isModalOpen: boolean;
  // Gamification & Treasure Chest props
  isNearChest: boolean;
  isChestUnlocked: boolean;
  onOpenCertificate: () => void;
  onResetAdventure: () => void;
  rewardToast: string | null;
  onDismissToast: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({
  nearbyHouse,
  onOpenHouse,
  collectedCrystals,
  onResetCamera,
  presetKey,
  onChangePreset,
  cameraMode,
  onToggleCameraMode,
  speedTier,
  onChangeSpeedTier,
  onOpenGuide,
  onReopenCurtains,
  onVirtualMove,
  onVirtualJump,
  isModalOpen,
  isNearChest,
  isChestUnlocked,
  onOpenCertificate,
  onResetAdventure,
  rewardToast,
  onDismissToast,
}) => {
  const totalCrystals = HOUSES_DATA.length; // 6
  const collectedCount = collectedCrystals.length;
  const progressPercent = Math.round((collectedCount / totalCrystals) * 100);

  // Modal for reset confirmation
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  // Mobile drawer state for crystal panel
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-5 overflow-hidden">
      {/* ==========================================
          REWARD TOAST BANNER (Top Center Notification)
          ========================================== */}
      {rewardToast && (
        <div className="pointer-events-auto fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-[#F5008F] via-[#E87991] to-[#9DBB69] text-white rounded-2xl shadow-2xl border-2 border-white">
            <div className="w-9 h-9 rounded-xl bg-white/25 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-yellow-200 animate-spin" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-yellow-200">
                GANJARAN KRISTAL ILMU
              </div>
              <div className="text-xs sm:text-sm font-extrabold">{rewardToast}</div>
            </div>
            <button
              onClick={onDismissToast}
              className="ml-2 w-6 h-6 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          TOP HEADER: PANDUAN GURU, MUSIC & CONTROLS
          ========================================== */}
      <div className="pointer-events-auto flex flex-wrap items-start justify-between gap-2.5 max-w-full">
        {/* Brand Banner */}
        <div className="bg-[#FFFCF8]/95 border-2 border-[#E87991] rounded-2xl shadow-lg px-4 py-2.5 max-w-md backdrop-blur-xs">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F5008F] text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              PANDUAN GURU
            </span>
            <span className="text-[10px] font-bold text-[#526B4C] bg-[#FFF4E6] px-2 py-0.5 rounded-md border border-[#9DBB69]/40">
              Tahun 5 • Bahasa Melayu
            </span>
          </div>

          <h1 className="text-base sm:text-lg font-black text-[#36233B] tracking-tight leading-tight">
            PENGEMBARAAN PULAU ILMU
          </h1>
          <p className="text-[11px] font-semibold text-[#E87991] tracking-wide">
            Misteri di Sebalik Sungai – Lima Sahabat Menyelamatkan Alam
          </p>
        </div>

        {/* Top Control Bar: Music, Camera Mode, Speed, Presets & Help */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Procedural Music Player */}
          <MusicPlayerBar />

          {/* Camera Mode Switcher (Adventure vs World View) */}
          <button
            onClick={onToggleCameraMode}
            className={`px-3 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 border-2 shadow-lg transition-all ${
              cameraMode === 'dunia'
                ? 'bg-[#36233B] text-white border-[#36233B]'
                : 'bg-[#FFFCF8]/95 text-[#526B4C] border-[#9DBB69] hover:bg-[#FFF4E6]'
            }`}
            title="Tukar Mod Kamera"
          >
            <Eye className="w-3.5 h-3.5 text-[#F5008F]" />
            <span className="hidden sm:inline">
              {cameraMode === 'dunia' ? 'Mod Pandangan Dunia' : 'Mod Pengembaraan'}
            </span>
          </button>

          {/* Avatar Speed Selector Pill */}
          <div className="hidden sm:flex items-center bg-[#FFFCF8]/95 border-2 border-[#E87991]/70 p-1 rounded-2xl shadow-lg text-[11px] font-bold text-[#526B4C]">
            <Gauge className="w-3.5 h-3.5 text-[#E87991] ml-1.5 mr-1" />
            <span className="mr-1 text-[10px] text-[#3b2a26]">Kelajuan:</span>
            {(['perlahan', 'sederhana', 'pantas'] as SpeedTier[]).map((t) => (
              <button
                key={t}
                onClick={() => onChangeSpeedTier(t)}
                className={`px-2 py-0.5 rounded-xl capitalize transition-colors ${
                  speedTier === t
                    ? 'bg-[#F5008F] text-white font-black shadow-xs'
                    : 'hover:bg-[#FFF4E6] text-[#36233B]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Environmental Presets */}
          <div className="hidden sm:flex items-center bg-[#FFFCF8]/95 border-2 border-[#E87991]/70 p-1 rounded-2xl shadow-lg">
            <button
              onClick={() => onChangePreset('cerah')}
              className={`p-1.5 rounded-xl transition-colors ${
                presetKey === 'cerah' ? 'bg-[#9DBB69] text-white' : 'text-[#526B4C] hover:bg-[#FFF4E6]'
              }`}
              title="Suasana Siang Ceria"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangePreset('senja')}
              className={`p-1.5 rounded-xl transition-colors ${
                presetKey === 'senja' ? 'bg-[#E87991] text-white' : 'text-[#526B4C] hover:bg-[#FFF4E6]'
              }`}
              title="Suasana Senja Emas"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangePreset('fantasi')}
              className={`p-1.5 rounded-xl transition-colors ${
                presetKey === 'fantasi' ? 'bg-[#36233B] text-white' : 'text-[#526B4C] hover:bg-[#FFF4E6]'
              }`}
              title="Suasana Malam Kristal"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Camera Reset */}
          <button
            onClick={onResetCamera}
            className="p-2 sm:px-3 sm:py-2 bg-[#FFF4E6] hover:bg-white text-[#3b2a26] text-xs font-bold rounded-2xl border-2 border-[#E87991]/60 shadow-lg transition-colors flex items-center gap-1.5"
            title="Kembalikan Pandangan Asal Kamera"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#F5008F]" />
            <span className="hidden sm:inline text-[11px]">Pandangan Asal</span>
          </button>

          {/* Teacher Guide Helper Button (?) */}
          <button
            onClick={onOpenGuide}
            className="p-2 sm:px-3 sm:py-2 bg-[#9DBB69] hover:bg-[#88a555] text-white text-xs font-black rounded-2xl shadow-lg transition-all flex items-center gap-1.5"
            title="Buka Panduan Guru"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">Panduan Guru</span>
          </button>

          {/* Reopen Curtain Button */}
          <button
            onClick={onReopenCurtains}
            className="p-2 rounded-2xl bg-[#FFFCF8]/95 hover:bg-[#FFF4E6] text-[#E87991] border-2 border-[#E87991]/60 shadow-lg transition-colors"
            title="Ulang Pembukaan Tirai Pentas"
          >
            <Film className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Crystal Drawer Toggle */}
          <button
            onClick={() => setIsMobilePanelOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-2xl bg-[#F5008F] text-white font-black text-xs shadow-lg flex items-center gap-1.5"
            title="Lihat Koleksi Kristal"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{collectedCount}/6</span>
          </button>
        </div>
      </div>

      {/* ==========================================
          SIDE PANELS: MISI ANDA & KOLEKSI KRISTAL
          ========================================== */}
      <div className="flex justify-between items-start pointer-events-none my-auto">
        {/* Left Panel: Misi Anda (Desktop) */}
        {!isModalOpen && (
          <div className="pointer-events-auto hidden lg:block w-72 bg-[#FFFCF8]/95 border-2 border-[#9DBB69] rounded-2xl shadow-xl p-3.5 space-y-2 backdrop-blur-xs">
            <div className="flex items-center justify-between border-b border-[#9DBB69]/30 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9DBB69]" />
                <h2 className="text-xs font-black text-[#36233B] uppercase tracking-wide">
                  MISI ANDA
                </h2>
              </div>
              <span className="text-[10px] font-bold text-[#526B4C] bg-[#FFF4E6] px-2 py-0.5 rounded-md">
                6 Rumah Ilmu
              </span>
            </div>

            <p className="text-xs font-semibold text-[#526B4C] leading-snug">
              Jalankan watak pengembara cilik meneroka enam rumah pembelajaran di pulau!
            </p>

            <div className="space-y-1.5 pt-1">
              {HOUSES_DATA.map((h) => {
                const isCollected = collectedCrystals.includes(h.id);
                const isNear = nearbyHouse?.id === h.id;
                return (
                  <div
                    key={h.id}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      isNear
                        ? 'bg-[#F5008F] text-white border-[#F5008F] shadow-sm translate-x-1'
                        : isCollected
                        ? 'bg-[#9DBB69]/20 text-[#3b2a26] border-[#9DBB69]/60'
                        : 'bg-[#FFF4E6] text-[#3b2a26] border-[#F4A6B8]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                          isNear
                            ? 'bg-white text-[#F5008F]'
                            : isCollected
                            ? 'bg-[#9DBB69] text-white'
                            : 'bg-[#E87991] text-white'
                        }`}
                      >
                        {h.id}
                      </span>
                      <span className="truncate">{h.content.signboardTitle}</span>
                    </div>

                    {isCollected ? (
                      <CheckCircle2 className="w-4 h-4 text-[#526B4C] shrink-0" />
                    ) : isNear ? (
                      <span className="text-[10px] bg-white text-[#F5008F] px-1.5 py-0.5 rounded-md font-black shrink-0">
                        [E]
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#E87991] shrink-0 font-semibold">Terkunci</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Panel: KOLEKSI KRISTAL ILMU (Desktop & Mobile Drawer) */}
        {(!isModalOpen || isMobilePanelOpen) && (
          <div
            className={`pointer-events-auto w-72 sm:w-80 bg-[#FFFCF8]/95 border-2 border-[#E87991] rounded-3xl shadow-2xl p-4 space-y-3 backdrop-blur-xs transition-all ${
              isMobilePanelOpen
                ? 'fixed inset-x-4 top-20 z-40 max-h-[80vh] overflow-y-auto block'
                : 'hidden lg:block'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E87991]/30 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#F5008F] flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-[#36233B] uppercase tracking-wide">
                    KOLEKSI KRISTAL ILMU
                  </h2>
                  <div className="text-[10px] font-bold text-[#E87991]">
                    {collectedCount}/6 KRISTAL DIKUMPULKAN
                  </div>
                </div>
              </div>

              {isMobilePanelOpen && (
                <button
                  onClick={() => setIsMobilePanelOpen(false)}
                  className="p-1 rounded-full text-stone-500 hover:bg-[#FFF4E6]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* PAPARAN KEMAJUAN (Animated Progress Bar: 0/6 - 6/6) */}
            <div className="space-y-1.5 bg-[#FFF4E6] p-2.5 rounded-2xl border border-[#F4A6B8]/40">
              <div className="flex items-center justify-between text-xs font-extrabold text-[#526B4C]">
                <span>Kemajuan Pengembaraan:</span>
                <span className="text-[#F5008F] font-black">
                  {collectedCount} / {totalCrystals} ({progressPercent}%)
                </span>
              </div>

              <div className="w-full h-3 bg-stone-200/80 rounded-full overflow-hidden p-0.5 border border-[#E87991]/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#F5008F] via-[#E87991] to-[#9DBB69] transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[9px] font-bold text-stone-500 px-0.5">
                <span>0/6</span>
                <span>1/6</span>
                <span>2/6</span>
                <span>3/6</span>
                <span>4/6</span>
                <span>5/6</span>
                <span className="text-[#9DBB69] font-black">6/6 Lengkap</span>
              </div>
            </div>

            {/* 6 Crystal Grid Slots */}
            <div className="grid grid-cols-2 gap-2">
              {HOUSES_DATA.map((h) => {
                const isCollected = collectedCrystals.includes(h.id);
                return (
                  <div
                    key={h.id}
                    className={`flex items-center gap-2 p-2 rounded-2xl border transition-all ${
                      isCollected
                        ? 'bg-gradient-to-br from-[#FFFCF8] to-[#FFF4E6] border-[#F5008F] shadow-[0_0_12px_rgba(245,0,143,0.2)]'
                        : 'bg-white/80 border-dashed border-[#E87991]/40 opacity-70'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                        isCollected
                          ? 'bg-gradient-to-br from-[#F5008F] to-[#E87991] text-white shadow-md animate-pulse'
                          : 'bg-[#FFF4E6] text-stone-400'
                      }`}
                    >
                      {isCollected ? (
                        <Sparkles className="w-4 h-4 fill-white" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-stone-400" />
                      )}
                    </div>

                    <div className="overflow-hidden leading-tight">
                      <div className="text-[11px] font-black text-[#36233B] truncate">
                        {h.crystalName}
                      </div>
                      <div className="text-[9px] font-bold">
                        {isCollected ? (
                          <span className="text-[#526B4C] flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5 text-[#9DBB69]" /> Selesai
                          </span>
                        ) : (
                          <span className="text-stone-400">Terkunci</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* All 6 Crystals Success Message & Certificate Button */}
            {collectedCount === 6 ? (
              <div className="space-y-2 pt-1 animate-in zoom-in-95 duration-300">
                <div className="p-2.5 bg-gradient-to-r from-[#9DBB69]/25 to-[#F5008F]/20 border-2 border-[#9DBB69] rounded-2xl text-center space-y-1">
                  <div className="text-xs font-black text-[#526B4C] flex items-center justify-center gap-1.5">
                    <Award className="w-4 h-4 text-[#F5008F]" />
                    <span>TAHNIAH! SEMUA KRISTAL LENGKAP!</span>
                  </div>
                  <p className="text-[10px] font-semibold text-[#3b2a26] leading-tight">
                    Peti Harta Karun di plaza tengah telah terbuka!
                  </p>
                </div>

                <button
                  onClick={onOpenCertificate}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-[#F5008F] via-[#E87991] to-[#f78233] hover:brightness-110 active:scale-98 text-white rounded-2xl text-xs font-black shadow-lg border-2 border-white flex items-center justify-center gap-2 transition-transform"
                >
                  <Award className="w-4 h-4 text-yellow-200" />
                  <span>BUKA SIJIL PENGHARGAAN</span>
                </button>
              </div>
            ) : (
              <div className="p-2 bg-[#FFF4E6] rounded-xl border border-[#F4A6B8]/40 text-center text-[10px] font-semibold text-[#526B4C]">
                Cari lagi <strong className="text-[#F5008F]">{totalCrystals - collectedCount} kristal</strong> untuk membuka Peti Harta Karun di tengah pulau!
              </div>
            )}

            {/* Bottom Actions: Reset Adventure */}
            <div className="border-t border-[#E87991]/20 pt-2 flex items-center justify-between text-[11px]">
              <span className="text-[10px] font-bold text-stone-500">Kemajuan disimpan secara automatik</span>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-[10px] font-bold text-stone-500 hover:text-red-500 transition-colors flex items-center gap-1"
                title="Padam kemajuan dan mula semula"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          FLOATING INTERACTION PROMPT: HOUSE OR TREASURE CHEST
          ========================================== */}
      {/* 1. Proximity to an Exploration House */}
      {nearbyHouse && !isModalOpen && !isNearChest && (
        <div className="pointer-events-auto mx-auto mb-4 animate-bounce">
          <button
            onClick={() => onOpenHouse(nearbyHouse)}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#F5008F] to-[#E87991] text-white rounded-2xl shadow-2xl border-2 border-white hover:scale-105 active:scale-95 transition-transform"
          >
            <div className="w-8 h-8 rounded-xl bg-white/25 flex items-center justify-center font-black text-sm">
              E
            </div>
            <div className="text-left">
              <div className="text-xs font-black tracking-wide uppercase">
                TEKAN E UNTUK TEROKA
              </div>
              <div className="text-[11px] font-bold text-white/90">
                {nearbyHouse.content.signboardTitle}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* 2. Proximity to the Central 3D Treasure Chest */}
      {isNearChest && !isModalOpen && (
        <div className="pointer-events-auto mx-auto mb-4 animate-bounce">
          {isChestUnlocked ? (
            <button
              onClick={onOpenCertificate}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#F5008F] via-[#E87991] to-[#9DBB69] text-white rounded-2xl shadow-2xl border-2 border-yellow-200 hover:scale-105 active:scale-95 transition-transform"
            >
              <div className="w-9 h-9 rounded-xl bg-white/25 flex items-center justify-center font-black text-sm">
                <Award className="w-5 h-5 text-yellow-200 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black tracking-wide uppercase text-yellow-200">
                  MISI PENGEMBARAAN BERJAYA!
                </div>
                <div className="text-xs font-extrabold text-white">
                  TEKAN E ATAU KLIK UNTUK BUKA SIJIL PENGHARGAAN
                </div>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-3 px-6 py-3 bg-[#36233B]/95 text-white rounded-2xl shadow-2xl border-2 border-[#E87991]">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-red-300">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black tracking-wide text-red-300 uppercase">
                  PETI HARTA KARUN TERKUNCI
                </div>
                <div className="text-[11px] font-bold text-stone-200">
                  Kumpulkan 6 Kristal Ilmu untuk membuka peti ini ({collectedCount}/6). Baki lagi {totalCrystals - collectedCount} kristal!
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          BOTTOM CONTROLS: JOYSTICK (Mobile) & DESKTOP GUIDE
          ========================================== */}
      <div className="pointer-events-auto flex items-end justify-between w-full max-w-5xl mx-auto">
        {/* Mobile Virtual Joystick (Left) */}
        <div className="block lg:hidden">
          {!isModalOpen && <VirtualJoystick onMove={onVirtualMove} />}
        </div>

        {/* Desktop Keyboard Controls Help Bar (Centered) */}
        <div className="hidden lg:flex items-center gap-4 bg-[#FFFCF8]/95 border-2 border-[#E87991] px-4 py-2 rounded-2xl shadow-lg text-xs font-bold text-[#526B4C] backdrop-blur-xs">
          <span className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 bg-[#FFF4E6] text-[#F5008F] rounded-md border border-[#F4A6B8]/50 font-black">
              W A S D
            </span>
            <span>Bergerak</span>
          </span>

          <span className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 bg-[#FFF4E6] text-[#F5008F] rounded-md border border-[#F4A6B8]/50 font-black">
              Space
            </span>
            <span>Lompat</span>
          </span>

          <span className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 bg-[#FFF4E6] text-[#F5008F] rounded-md border border-[#F4A6B8]/50 font-black">
              E
            </span>
            <span>Interaksi / Buka</span>
          </span>

          <span className="flex items-center gap-1.5 text-[#3b2a26]">
            <span>🖱️ Seret Tetikus: Pusing Kamera</span>
          </span>
        </div>

        {/* Mobile Action Buttons (Right) */}
        <div className="flex lg:hidden flex-col items-end gap-3 pb-2">
          {/* Prominent Mobile "Teroka Sekarang" Button when near a house */}
          {nearbyHouse && !isModalOpen && !isNearChest && (
            <button
              onClick={() => onOpenHouse(nearbyHouse)}
              className="px-5 py-3 bg-[#F5008F] active:bg-[#d6007d] text-white text-xs font-black rounded-2xl shadow-xl border-2 border-white flex items-center gap-2 animate-pulse"
            >
              <Sparkles className="w-4 h-4" />
              <span>TEROKA SEKARANG</span>
            </button>
          )}

          {/* Prominent Mobile "Buka Sijil" Button when near chest */}
          {isNearChest && !isModalOpen && isChestUnlocked && (
            <button
              onClick={onOpenCertificate}
              className="px-5 py-3 bg-[#9DBB69] active:bg-[#86a354] text-white text-xs font-black rounded-2xl shadow-xl border-2 border-white flex items-center gap-2 animate-pulse"
            >
              <Award className="w-4 h-4 text-yellow-200" />
              <span>BUKA SIJIL</span>
            </button>
          )}

          {/* Jump Button */}
          {!isModalOpen && (
            <button
              onTouchStart={() => onVirtualJump(true)}
              onTouchEnd={() => onVirtualJump(false)}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9DBB69] to-[#526B4C] active:scale-95 text-white font-black text-xs flex flex-col items-center justify-center border-2 border-white shadow-xl"
              title="Lompat"
            >
              <ArrowUp className="w-5 h-5 mb-0.5" />
              <span>LOMPAT</span>
            </button>
          )}
        </div>
      </div>

      {/* ==========================================
          RESET ADVENTURE CONFIRMATION MODAL
          ========================================== */}
      {showResetConfirm && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFCF8] border-3 border-[#E87991] rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-[#36233B]">
              Reset Pengembaraan Pulau Ilmu?
            </h3>

            <p className="text-xs font-medium text-[#526B4C] leading-relaxed">
              Adakah anda pasti mahu memadamkan semua <strong className="text-[#F5008F]">{collectedCount} Kristal Ilmu</strong> yang telah dikumpulkan dan memulakan semula pengembaraan dari awal?
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetAdventure();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-98 text-xs font-black text-white shadow-md"
              >
                Ya, Reset Mula Semula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
