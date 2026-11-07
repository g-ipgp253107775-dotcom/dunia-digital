import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles } from 'lucide-react';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MaterialLibrary, PALETTE } from '../world/materials';
import { buildMainIsland } from '../world/mainIslandBuilder';
import { buildFloatingIslands } from '../world/islandBuilder';
import { buildScenery } from '../world/sceneryBuilder';
import { PlayerAvatar } from '../character/PlayerAvatar';
import { ENVIRONMENT_PRESETS, HouseConfig } from '../types';

export type CameraMode = 'pengembaraan' | 'dunia';
export type SpeedTier = 'perlahan' | 'sederhana' | 'pantas';

interface ThreeWorldProps {
  onNearHouseChange: (house: HouseConfig | null) => void;
  onOpenHouse: (house: HouseConfig) => void;
  isChestUnlocked: boolean;
  onNearChestChange: (isNear: boolean, isUnlocked: boolean) => void;
  onOpenCertificate: () => void;
  isModalOpen: boolean;
  presetKey: 'cerah' | 'senja' | 'fantasi';
  virtualMove: { x: number; z: number };
  virtualJump: boolean;
  cameraMode: CameraMode;
  speedTier: SpeedTier;
  onResetCamRef?: (fn: () => void) => void;
  onCelebrationRef?: (fn: () => void) => void;
}

export const ThreeWorld: React.FC<ThreeWorldProps> = ({
  onNearHouseChange,
  onOpenHouse,
  isChestUnlocked,
  onNearChestChange,
  onOpenCertificate,
  isModalOpen,
  presetKey,
  virtualMove,
  virtualJump,
  cameraMode,
  speedTier,
  onResetCamRef,
  onCelebrationRef,
}) => {
  const [isLoadingScene, setIsLoadingScene] = useState(true);
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerAvatar | null>(null);
  const nearbyHouseRef = useRef<HouseConfig | null>(null);

  // Lighting refs for preset switching
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  // Keyboard input state
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Third-person camera orbit angles
  const cameraYaw = useRef<number>(0);
  const cameraPitch = useRef<number>(0.32); // Slight downward angle
  const cameraDistance = useRef<number>(10.5);

  // Sync virtual move and jump into refs for animation loop
  const virtualMoveRef = useRef(virtualMove);
  virtualMoveRef.current = virtualMove;

  const virtualJumpRef = useRef(virtualJump);
  virtualJumpRef.current = virtualJump;

  const isModalOpenRef = useRef(isModalOpen);
  isModalOpenRef.current = isModalOpen;

  const cameraModeRef = useRef(cameraMode);
  cameraModeRef.current = cameraMode;

  const speedTierRef = useRef(speedTier);
  speedTierRef.current = speedTier;

  const isChestUnlockedRef = useRef(isChestUnlocked);
  isChestUnlockedRef.current = isChestUnlocked;

  const isNearChestRef = useRef<boolean>(false);

  const onNearHouseChangeRef = useRef(onNearHouseChange);
  onNearHouseChangeRef.current = onNearHouseChange;

  const onOpenHouseRef = useRef(onOpenHouse);
  onOpenHouseRef.current = onOpenHouse;

  const onNearChestChangeRef = useRef(onNearChestChange);
  onNearChestChangeRef.current = onNearChestChange;

  const onOpenCertificateRef = useRef(onOpenCertificate);
  onOpenCertificateRef.current = onOpenCertificate;

  // Update speed tier on player
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setSpeedTier(speedTier);
    }
  }, [speedTier]);

  // Update environmental lighting when presetKey changes
  useEffect(() => {
    if (!sceneRef.current || !dirLightRef.current || !hemiLightRef.current) return;
    const preset = ENVIRONMENT_PRESETS[presetKey] || ENVIRONMENT_PRESETS.cerah;

    sceneRef.current.background = new THREE.Color(preset.skyColor);
    if (sceneRef.current.fog) {
      sceneRef.current.fog.color = new THREE.Color(preset.fogColor);
    }

    dirLightRef.current.color = new THREE.Color(preset.sunColor);
    dirLightRef.current.intensity = preset.sunIntensity;

    hemiLightRef.current.color = new THREE.Color(preset.hemiSkyColor);
    hemiLightRef.current.groundColor = new THREE.Color(preset.hemiGroundColor);
  }, [presetKey]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const initialPreset = ENVIRONMENT_PRESETS[presetKey] || ENVIRONMENT_PRESETS.cerah;
    scene.background = new THREE.Color(initialPreset.skyColor);
    scene.fog = new THREE.FogExp2(initialPreset.fogColor, 0.007);

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.5, 400);
    camera.position.set(0, 10, 18);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. RoomEnvironment reflection map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting Rig (Key, Fill, Rim)
    const hemiLight = new THREE.HemisphereLight(
      initialPreset.hemiSkyColor,
      initialPreset.hemiGroundColor,
      1.1
    );
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(initialPreset.sunColor, initialPreset.sunIntensity);
    dirLight.position.set(38, 55, 30);
    dirLight.castShadow = !isSoftwareGl;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 160;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.bias = -0.0004;
    dirLight.shadow.normalBias = 0.02;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    const ambientLight = new THREE.AmbientLight(0xFFF4E6, 0.4);
    scene.add(ambientLight);

    // 6. Material Library & World Generation
    const materials = new MaterialLibrary();

    // Build Main Island
    const mainIsland = buildMainIsland(materials);
    scene.add(mainIsland.group);

    // Build 6 Floating Islands with Exploration Houses and Walkable Bridges
    const floatingIslands = buildFloatingIslands(materials);
    scene.add(floatingIslands.group);
    scene.add(floatingIslands.bridgesGroup);

    // Build Scenery (River, Waterfalls, Mountains, Clouds, Particles)
    const scenery = buildScenery(materials);
    scene.add(scenery.group);

    // 7. Instantiate Player Avatar
    const player = new PlayerAvatar(materials);
    scene.add(player.mesh);
    playerRef.current = player;

    // Celebration callback
    if (onCelebrationRef) {
      onCelebrationRef(() => {
        player.celebrate();
      });
    }

    // Reset camera callback
    if (onResetCamRef) {
      onResetCamRef(() => {
        cameraYaw.current = player.rotationY;
        cameraPitch.current = 0.32;
        cameraDistance.current = 10.5;
      });
    }

    // 8. Keyboard Event Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code;
      keysPressed.current[code] = true;

      // E key to interact with nearby house or treasure chest
      if (code === 'KeyE' && !isModalOpenRef.current) {
        if (nearbyHouseRef.current) {
          onOpenHouseRef.current(nearbyHouseRef.current);
        } else if (isNearChestRef.current) {
          onOpenCertificateRef.current();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 9. Mouse Orbit Dragging for Third-Person Camera
    let isMouseDown = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      // Allow drag with Left or Right click
      isMouseDown = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      cameraYaw.current -= dx * 0.005;
      cameraPitch.current = Math.max(0.08, Math.min(1.15, cameraPitch.current + dy * 0.005));
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleWheel = (e: WheelEvent) => {
      cameraDistance.current = Math.max(5.0, Math.min(22.0, cameraDistance.current + e.deltaY * 0.015));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);

    // Touch orbit for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouchDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        // Only drag camera if touch starts in right half of screen (left half is joystick)
        if (touch.clientX > window.innerWidth * 0.35) {
          isTouchDragging = true;
          touchStartX = touch.clientX;
          touchStartY = touch.clientY;
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchDragging || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;

      cameraYaw.current -= dx * 0.006;
      cameraPitch.current = Math.max(0.08, Math.min(1.15, cameraPitch.current + dy * 0.006));
    };

    const handleTouchEnd = () => {
      isTouchDragging = false;
    };

    renderer.domElement.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // 10. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 11. Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();
    const currentCamTarget = new THREE.Vector3();
    const dummyObj = new THREE.Object3D();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Gather Keyboard & Virtual Joystick Inputs
      let inputX = 0;
      let inputZ = 0;
      let isJumping = false;

      const keys = keysPressed.current;
      if (keys['KeyW'] || keys['ArrowUp']) inputZ -= 1;
      if (keys['KeyS'] || keys['ArrowDown']) inputZ += 1;
      if (keys['KeyA'] || keys['ArrowLeft']) inputX -= 1;
      if (keys['KeyD'] || keys['ArrowRight']) inputX += 1;
      if (keys['Space']) isJumping = true;

      // Merge with virtual joystick
      if (Math.abs(virtualMoveRef.current.x) > 0.05 || Math.abs(virtualMoveRef.current.z) > 0.05) {
        inputX = virtualMoveRef.current.x;
        inputZ = virtualMoveRef.current.z;
      }
      if (virtualJumpRef.current) {
        isJumping = true;
      }

      // Update Player Physics & Procedural Limb Animations
      player.update(
        delta,
        { x: inputX, z: inputZ },
        isJumping,
        cameraYaw.current,
        isModalOpenRef.current
      );

      // Camera Handling (Mod Pengembaraan vs Mod Pandangan Dunia)
      if (cameraModeRef.current === 'dunia') {
        // Mod Pandangan Dunia: Overview of entire archipelago
        const worldViewPos = new THREE.Vector3(0, 48, 68);
        const worldTarget = new THREE.Vector3(0, 4, 0);
        camera.position.lerp(worldViewPos, 0.06);
        currentCamTarget.lerp(worldTarget, 0.06);
        camera.lookAt(currentCamTarget);
      } else {
        // Mod Pengembaraan: Smooth Third-Person Camera Following
        const targetY = player.position.y + 1.6;
        currentCamTarget.lerp(new THREE.Vector3(player.position.x, targetY, player.position.z), 0.12);

        // Desired camera position in spherical coords
        const camX = currentCamTarget.x + Math.sin(cameraYaw.current) * Math.cos(cameraPitch.current) * cameraDistance.current;
        const camY = currentCamTarget.y + Math.sin(cameraPitch.current) * cameraDistance.current;
        const camZ = currentCamTarget.z + Math.cos(cameraYaw.current) * Math.cos(cameraPitch.current) * cameraDistance.current;

        camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.12);
        camera.lookAt(currentCamTarget);
      }

      // ==========================================
      // House Proximity Detection & Glowing Auras
      // ==========================================
      let foundNearby: HouseConfig | null = null;
      floatingIslands.builtHouses.forEach((bh) => {
        const dist = player.position.distanceTo(bh.doorPosition);
        if (dist <= bh.config.interactionRadius) {
          foundNearby = bh.config;
          // Pulse the aura brightly
          bh.interactionAura.scale.setScalar(1.0 + Math.sin(elapsedTime * 4.0) * 0.12);
          if (bh.interactionAura.material instanceof THREE.MeshStandardMaterial) {
            bh.interactionAura.material.opacity = 0.85 + Math.sin(elapsedTime * 4.0) * 0.15;
          }
        } else {
          bh.interactionAura.scale.setScalar(1.0);
          if (bh.interactionAura.material instanceof THREE.MeshStandardMaterial) {
            bh.interactionAura.material.opacity = 0.4;
          }
        }
      });

      const currentNearby = nearbyHouseRef.current as HouseConfig | null;
      const nextNearby = foundNearby as HouseConfig | null;
      if (currentNearby?.id !== nextNearby?.id) {
        nearbyHouseRef.current = nextNearby;
        onNearHouseChangeRef.current(nextNearby);
      }

      // ==========================================
      // Treasure Chest Proximity & Animation Update
      // ==========================================
      if (mainIsland.treasureChest) {
        mainIsland.treasureChest.update(delta, elapsedTime, isChestUnlockedRef.current);
        const chestDist = player.position.distanceTo(mainIsland.treasureChest.interactionPosition);
        const isNear = chestDist <= mainIsland.treasureChest.interactionRadius;
        if (isNear !== isNearChestRef.current) {
          isNearChestRef.current = isNear;
          onNearChestChangeRef.current(isNear, isChestUnlockedRef.current);
        }
      }

      // ==========================================
      // World Animations
      // ==========================================
      // Central Giant Crystal
      if (mainIsland.giantCrystalMesh) {
        mainIsland.giantCrystalMesh.rotation.y = elapsedTime * 0.8;
        mainIsland.giantCrystalMesh.position.y = 8.4 + Math.sin(elapsedTime * 1.5) * 0.35;
      }
      if (mainIsland.crystalLight) {
        mainIsland.crystalLight.intensity = 4.5 + Math.sin(elapsedTime * 2.5) * 1.5;
      }

      // Main Island Swaying Trees
      mainIsland.animatedMeshes.forEach((item) => {
        if (item.type === 'sway') {
          item.mesh.rotation.z = Math.sin(elapsedTime * (item.speed || 1.0)) * 0.035;
        }
      });

      // Floating Icons Above Houses
      floatingIslands.animatedObjects.forEach((item) => {
        if (item.type === 'crystal') {
          item.object.rotation.y = elapsedTime * (item.speed || 1.6);
          if (item.initialY !== undefined) {
            item.object.position.y = item.initialY + Math.sin(elapsedTime * 2.0) * 0.25;
          }
        } else if (item.type === 'sway') {
          item.object.rotation.z = Math.sin(elapsedTime * (item.speed || 1.0)) * 0.03;
        }
      });

      // River Water Flow & Waterfalls
      if (materials.waterTexture) {
        materials.waterTexture.offset.x = (elapsedTime * 0.04) % 1;
        materials.waterTexture.offset.y = (elapsedTime * 0.02) % 1;
      }
      scenery.waterfalls.forEach((wf) => {
        wf.mesh.position.y = wf.initialY + Math.sin(elapsedTime * 6.0) * 0.08;
      });

      // Drifting Clouds
      scenery.clouds.forEach((c) => {
        c.group.position.x += delta * c.speed * 2.5;
        if (c.group.position.x > 85) c.group.position.x = -85;
      });

      // Magical Light Particles
      const { instancedMesh, count, initialData } = scenery.particles;
      for (let i = 0; i < count; i++) {
        const p = initialData[i];
        const curY = p.y + Math.sin(elapsedTime * p.speed + p.phase) * 1.2;
        const curX = p.x + Math.cos(elapsedTime * 0.5 * p.speed + p.phase) * 0.8;
        dummyObj.position.set(curX, curY, p.z);
        dummyObj.scale.setScalar(0.7 + Math.sin(elapsedTime * 2.0 + p.phase) * 0.3);
        dummyObj.updateMatrix();
        instancedMesh.setMatrixAt(i, dummyObj.matrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;

      // Render
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();
    setIsLoadingScene(false);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      materials.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden cursor-crosshair"
    >
      {isLoadingScene && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#FFF4E6] text-center p-4">
          <div className="w-16 h-16 rounded-3xl bg-[#F5008F] text-white flex items-center justify-center shadow-xl animate-bounce mb-3">
            <Sparkles className="w-8 h-8 fill-white" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#36233B]">
            MEMUATKAN PULAU ILMU 3D...
          </h3>
          <p className="text-xs font-semibold text-[#526B4C] mt-1">
            Menjana dunia blok 3D, pulau terapung dan rumah penerokaan
          </p>
        </div>
      )}
    </div>
  );
};
