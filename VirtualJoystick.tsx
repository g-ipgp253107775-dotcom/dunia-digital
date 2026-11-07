import React, { useRef, useState, useEffect } from 'react';

interface VirtualJoystickProps {
  onMove: (vector: { x: number; z: number }) => void;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ onMove }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [activeTouchId, setActiveTouchId] = useState<number | null>(null);

  const radius = 48; // Max displacement radius

  const handleTouchStart = (e: React.TouchEvent) => {
    if (activeTouchId !== null) return;
    const touch = e.changedTouches[0];
    setActiveTouchId(touch.identifier);
    updateKnob(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (activeTouchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === activeTouchId) {
        updateKnob(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (activeTouchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchId) {
        setActiveTouchId(null);
        setKnobPos({ x: 0, y: 0 });
        onMove({ x: 0, z: 0 });
        break;
      }
    }
  };

  const updateKnob = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const clampedDist = Math.min(dist, radius);
    const angle = Math.atan2(dy, dx);

    const targetX = Math.cos(angle) * clampedDist;
    const targetY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: targetX, y: targetY });

    // Output normalized vector
    // Screen dy downwards corresponds to moving backwards (+Z in camera space)
    // Screen dy upwards corresponds to moving forwards (-Z in camera space)
    const normX = targetX / radius;
    const normZ = targetY / radius;
    onMove({ x: normX, z: -normZ });
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="relative w-28 h-28 rounded-full bg-[#36233B]/40 backdrop-blur-xs border-2 border-[#9DBB69] flex items-center justify-center select-none touch-none shadow-lg active:border-[#F5008F]"
      title="Kawalan Arah Maya"
    >
      {/* Direction Guide Crosshair */}
      <div className="absolute w-full h-[1px] bg-white/20" />
      <div className="absolute h-full w-[1px] bg-white/20" />

      {/* Movable Knob */}
      <div
        className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9DBB69] to-[#526B4C] border-2 border-white shadow-md transition-transform duration-75 flex items-center justify-center"
        style={{
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
        }}
      >
        <div className="w-4 h-4 rounded-full bg-[#FFF4E6]/60" />
      </div>
    </div>
  );
};
