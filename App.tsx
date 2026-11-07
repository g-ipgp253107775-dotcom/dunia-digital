import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ThreeWorld, CameraMode, SpeedTier } from './components/ThreeWorld';
import { UIOverlay } from './components/UIOverlay';
import { HouseDetailModal } from './components/HouseDetailModal';
import { StageCurtain } from './components/StageCurtain';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { CertificateModal } from './components/CertificateModal';
import { HouseConfig, HOUSES_DATA } from './types';
import { proceduralAudio } from './utils/proceduralAudio';
import { AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'pulau_ilmu_crystals_v1';

export default function App() {
  // Stage curtain & guide modal state
  const [isCurtainsOpen, setIsCurtainsOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

  // House exploration states
  const [nearbyHouse, setNearbyHouse] = useState<HouseConfig | null>(null);
  const [activeHouseModal, setActiveHouseModal] = useState<HouseConfig | null>(null);

  // Gamification: Load saved crystals from localStorage
  const [collectedCrystals, setCollectedCrystals] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((id) => typeof id === 'number' && id >= 1 && id <= 6);
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Treasure chest proximity and state
  const [isNearChest, setIsNearChest] = useState<boolean>(false);
  const isChestUnlocked = collectedCrystals.length >= 6;

  // Reward toast notification
  const [rewardToast, setRewardToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const [presetKey, setPresetKey] = useState<'cerah' | 'senja' | 'fantasi'>('cerah');

  // Camera & Player Controls
  const [cameraMode, setCameraMode] = useState<CameraMode>('pengembaraan');
  const [speedTier, setSpeedTier] = useState<SpeedTier>('sederhana');

  // Virtual inputs for mobile/tablet
  const [virtualMove, setVirtualMove] = useState<{ x: number; z: number }>({ x: 0, z: 0 });
  const [virtualJump, setVirtualJump] = useState<boolean>(false);

  // References for camera reset & celebration triggers
  const resetCamFnRef = useRef<(() => void) | null>(null);
  const celebrationFnRef = useRef<(() => void) | null>(null);

  // Save to localStorage whenever collected crystals update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collectedCrystals));
    } catch {
      // Ignore storage errors
    }
  }, [collectedCrystals]);

  // WebGL support check
  const isWebGLAvailable = (() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  })();

  const handleRegisterResetCam = useCallback((fn: () => void) => {
    resetCamFnRef.current = fn;
  }, []);

  const handleRegisterCelebration = useCallback((fn: () => void) => {
    celebrationFnRef.current = fn;
  }, []);

  const handleResetCamera = useCallback(() => {
    setCameraMode('pengembaraan');
    if (resetCamFnRef.current) {
      resetCamFnRef.current();
    }
  }, []);

  const handleToggleCameraMode = useCallback(() => {
    setCameraMode((prev) => (prev === 'pengembaraan' ? 'dunia' : 'pengembaraan'));
  }, []);

  // When curtains finish sliding open, present Teacher Guide
  const handleCurtainsOpened = useCallback(() => {
    setIsCurtainsOpen(true);
    setIsGuideOpen(true);
  }, []);

  const handleSkipCurtains = useCallback(() => {
    setIsCurtainsOpen(true);
    setIsGuideOpen(true);
  }, []);

  const handleReopenCurtains = useCallback(() => {
    setIsCurtainsOpen(false);
  }, []);

  const handleOpenHouse = useCallback((house: HouseConfig) => {
    setActiveHouseModal(house);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveHouseModal(null);
  }, []);

  const showToast = useCallback((msg: string) => {
    setRewardToast(msg);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setRewardToast(null);
    }, 4000);
  }, []);

  const handleCollectCrystal = useCallback(
    (houseId: number) => {
      const houseData = HOUSES_DATA.find((h) => h.id === houseId);
      const crystalName = houseData?.crystalName || `Kristal Rumah ${houseId}`;

      setCollectedCrystals((prev) => {
        if (prev.includes(houseId)) return prev;
        const next = [...prev, houseId];

        // Celebration hop & spin
        if (celebrationFnRef.current) {
          celebrationFnRef.current();
        }

        if (next.length >= 6) {
          proceduralAudio.playFanfare();
          showToast(`MISI BERJAYA! Semua 6 Kristal Lengkap! Peti Harta Karun Telah Terbuka!`);
        } else {
          showToast(`Tahniah! Anda memperoleh ${crystalName}! (${next.length}/6 Kristal)`);
        }

        return next;
      });
    },
    [showToast]
  );

  const handleResetAdventure = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setCollectedCrystals([]);
    showToast('Kemajuan pengembaraan telah direset. Selamat meneroka semula Pulau Ilmu!');
  }, [showToast]);

  const handleNearChestChange = useCallback((isNear: boolean) => {
    setIsNearChest(isNear);
  }, []);

  if (!isWebGLAvailable) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#FFF4E6] p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl border-2 border-[#E87991] shadow-xl space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF4E6] flex items-center justify-center text-[#F5008F]">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#36233B]">
            WebGL Tidak Disokong
          </h2>
          <p className="text-sm font-semibold text-[#526B4C] leading-relaxed">
            Peranti atau pelayar web anda memerlukan sokongan WebGL dan akselerasi perkakasan (hardware acceleration) untuk memaparkan Dunia Digital 3D Pengembaraan Pulau Ilmu.
          </p>
          <div className="p-3 bg-[#FFF4E6] rounded-xl text-xs text-[#3b2a26]">
            Sila gunakan pelayar terkini seperti Google Chrome, Microsoft Edge, atau Firefox.
          </div>
        </div>
      </div>
    );
  }

  // Freeze player movement when any modal or curtain is active
  const isInputFrozen =
    !isCurtainsOpen || isGuideOpen || activeHouseModal !== null || isCertificateOpen;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#FFF4E6] select-none">
      {/* 3D Scene Viewport with Controllable Avatar & 6 Exploration Houses & 3D Chest */}
      <ThreeWorld
        onNearHouseChange={setNearbyHouse}
        onOpenHouse={handleOpenHouse}
        isChestUnlocked={isChestUnlocked}
        onNearChestChange={handleNearChestChange}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        isModalOpen={isInputFrozen}
        presetKey={presetKey}
        virtualMove={virtualMove}
        virtualJump={virtualJump}
        cameraMode={cameraMode}
        speedTier={speedTier}
        onResetCamRef={handleRegisterResetCam}
        onCelebrationRef={handleRegisterCelebration}
      />

      {/* 2D Interactive HUD Overlay */}
      <UIOverlay
        nearbyHouse={nearbyHouse}
        onOpenHouse={handleOpenHouse}
        collectedCrystals={collectedCrystals}
        onResetCamera={handleResetCamera}
        presetKey={presetKey}
        onChangePreset={setPresetKey}
        cameraMode={cameraMode}
        onToggleCameraMode={handleToggleCameraMode}
        speedTier={speedTier}
        onChangeSpeedTier={setSpeedTier}
        onOpenGuide={() => setIsGuideOpen(true)}
        onReopenCurtains={handleReopenCurtains}
        onVirtualMove={setVirtualMove}
        onVirtualJump={setVirtualJump}
        isModalOpen={isInputFrozen}
        isNearChest={isNearChest}
        isChestUnlocked={isChestUnlocked}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onResetAdventure={handleResetAdventure}
        rewardToast={rewardToast}
        onDismissToast={() => setRewardToast(null)}
      />

      {/* Stage Curtain Opening Animation */}
      <StageCurtain
        isOpen={isCurtainsOpen}
        onOpen={handleCurtainsOpened}
        onSkip={handleSkipCurtains}
      />

      {/* Teacher Guide Walkthrough Modal */}
      <TeacherGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Exploration House Information Modal with Malay Text-to-Speech */}
      <HouseDetailModal
        house={activeHouseModal}
        onClose={handleCloseModal}
        collectedCrystals={collectedCrystals}
        onCollectCrystal={handleCollectCrystal}
      />

      {/* Sijil Penghargaan Penjelajah Pulau Ilmu Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        collectedCount={collectedCrystals.length}
      />
    </main>
  );
}
