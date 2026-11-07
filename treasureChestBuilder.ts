import * as THREE from 'three';
import { MaterialLibrary, PALETTE } from './materials';

export interface BuiltTreasureChest {
  group: THREE.Group;
  lidGroup: THREE.Group;
  lockMesh: THREE.Mesh;
  chestLight: THREE.PointLight;
  orbitingCrystalsGroup: THREE.Group;
  auraMesh: THREE.Mesh;
  position: THREE.Vector3;
  interactionPosition: THREE.Vector3;
  interactionRadius: number;
  update: (delta: number, elapsedTime: number, isUnlocked: boolean) => void;
}

export function buildTreasureChest(materials: MaterialLibrary): BuiltTreasureChest {
  const group = new THREE.Group();
  group.name = 'TreasureChest';

  const chestPos = new THREE.Vector3(4.2, 3.65, 3.8);
  group.position.copy(chestPos);

  // Interaction position in front of chest
  const interactionPosition = new THREE.Vector3(4.2, 3.65, 5.5);
  const interactionRadius = 4.2;

  // Stone plinth beneath the chest
  const plinthGeo = new THREE.BoxGeometry(2.6, 0.3, 2.0);
  const plinth = new THREE.Mesh(plinthGeo, materials.whiteStone);
  plinth.position.y = 0.15;
  plinth.receiveShadow = true;
  group.add(plinth);

  // Ground interaction circle
  const auraGeo = new THREE.RingGeometry(1.4, 1.8, 24);
  const auraMat = new THREE.MeshStandardMaterial({
    color: PALETTE.GOLD_ACCENT,
    emissive: PALETTE.GOLD_ACCENT,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  const auraMesh = new THREE.Mesh(auraGeo, auraMat);
  auraMesh.rotation.x = -Math.PI / 2;
  auraMesh.position.set(0, 0.32, 1.5);
  group.add(auraMesh);

  // 1. CHEST LOWER BASE
  const baseWidth = 1.8;
  const baseHeight = 0.85;
  const baseDepth = 1.2;

  const baseGeo = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
  const chestBase = new THREE.Mesh(baseGeo, materials.woodDark);
  chestBase.position.y = 0.3 + baseHeight / 2;
  chestBase.castShadow = true;
  chestBase.receiveShadow = true;
  group.add(chestBase);

  // Gold Trim bands on base
  const bandL = new THREE.Mesh(new THREE.BoxGeometry(0.12, baseHeight + 0.04, baseDepth + 0.04), materials.gold);
  bandL.position.set(-0.65, 0.3 + baseHeight / 2, 0);
  const bandR = new THREE.Mesh(new THREE.BoxGeometry(0.12, baseHeight + 0.04, baseDepth + 0.04), materials.gold);
  bandR.position.set(0.65, 0.3 + baseHeight / 2, 0);
  group.add(bandL, bandR);

  // 2. CHEST LID (Pivoted at back edge)
  const lidGroup = new THREE.Group();
  // Pivot at top back of the base
  lidGroup.position.set(0, 0.3 + baseHeight, -baseDepth / 2);

  // Curved / Beveled Lid Top
  const lidGeo = new THREE.CylinderGeometry(baseDepth / 2, baseDepth / 2, baseWidth, 12, 1, false, 0, Math.PI);
  const lidMesh = new THREE.Mesh(lidGeo, materials.woodDark);
  lidMesh.rotation.z = Math.PI / 2;
  lidMesh.rotation.x = -Math.PI / 2;
  lidMesh.position.set(0, 0, baseDepth / 2);
  lidMesh.castShadow = true;
  lidGroup.add(lidMesh);

  // Gold Trim bands on lid
  const lidBandL = new THREE.Mesh(
    new THREE.TorusGeometry(baseDepth / 2 + 0.02, 0.05, 8, 16, Math.PI),
    materials.gold
  );
  lidBandL.rotation.y = Math.PI / 2;
  lidBandL.position.set(-0.65, 0, baseDepth / 2);

  const lidBandR = new THREE.Mesh(
    new THREE.TorusGeometry(baseDepth / 2 + 0.02, 0.05, 8, 16, Math.PI),
    materials.gold
  );
  lidBandR.rotation.y = Math.PI / 2;
  lidBandR.position.set(0.65, 0, baseDepth / 2);

  lidGroup.add(lidBandL, lidBandR);
  group.add(lidGroup);

  // 3. PADLOCK (Visible when locked, disappears when unlocked)
  const lockGroup = new THREE.Group();
  lockGroup.position.set(0, 0.3 + baseHeight * 0.75, baseDepth / 2 + 0.08);

  const lockBody = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.12), materials.gold);
  const lockShackle = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.04, 6, 12, Math.PI), materials.gold);
  lockShackle.position.y = 0.14;
  lockGroup.add(lockBody, lockShackle);
  group.add(lockGroup);

  // 4. CHEST INTERIOR LIGHT (Emits Hot Pink & Gold glow when open)
  const chestLight = new THREE.PointLight(PALETTE.HOT_PINK, 0.2, 12);
  chestLight.position.set(0, 1.2, 0);
  group.add(chestLight);

  // 5. SIX ORBITING CRYSTALS (Shown above open chest)
  const orbitingCrystalsGroup = new THREE.Group();
  orbitingCrystalsGroup.position.set(0, 2.2, 0);
  orbitingCrystalsGroup.visible = false;

  const crystalColors = [
    PALETTE.HOT_PINK,       // 1. Maklumat
    PALETTE.MATCHA_GREEN,   // 2. Objektif
    PALETTE.STRAWBERRY_RED, // 3. Tematik
    PALETTE.STRAWBERRY_PINK,// 4. Inkuiri
    PALETTE.DEEP_GREEN,     // 5. Kerjasama
    PALETTE.GOLD_ACCENT,    // 6. Pentaksiran
  ];

  const miniCrystals: THREE.Mesh[] = [];
  const crystalRadius = 1.35;

  crystalColors.forEach((color, i) => {
    const angle = (i / 6) * Math.PI * 2;
    const miniGeo = new THREE.OctahedronGeometry(0.24, 0);
    const miniMat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 1.2,
      roughness: 0.15,
      metalness: 0.4,
    });
    const miniMesh = new THREE.Mesh(miniGeo, miniMat);
    miniMesh.position.set(Math.cos(angle) * crystalRadius, 0, Math.sin(angle) * crystalRadius);
    orbitingCrystalsGroup.add(miniMesh);
    miniCrystals.push(miniMesh);
  });

  group.add(orbitingCrystalsGroup);

  // Target lid angle interpolation
  let currentLidAngle = 0;

  const update = (delta: number, elapsedTime: number, isUnlocked: boolean) => {
    const targetAngle = isUnlocked ? -1.35 : 0;
    currentLidAngle = THREE.MathUtils.damp(currentLidAngle, targetAngle, 4.0, delta);
    lidGroup.rotation.x = currentLidAngle;

    if (isUnlocked) {
      lockGroup.visible = false;
      orbitingCrystalsGroup.visible = true;
      orbitingCrystalsGroup.rotation.y = elapsedTime * 1.4;

      // Bobbing crystals
      miniCrystals.forEach((mc, idx) => {
        mc.position.y = Math.sin(elapsedTime * 3.0 + idx * 1.0) * 0.15;
        mc.rotation.y = elapsedTime * 2.0;
      });

      // Bright pulsing interior light
      chestLight.color.setHex(Math.sin(elapsedTime * 2) > 0 ? PALETTE.HOT_PINK : PALETTE.GOLD_ACCENT);
      chestLight.intensity = 3.8 + Math.sin(elapsedTime * 4.0) * 1.2;

      // Aura pulses gold
      auraMesh.scale.setScalar(1.0 + Math.sin(elapsedTime * 3.0) * 0.12);
      if (auraMat) {
        auraMat.color.setHex(PALETTE.HOT_PINK);
        auraMat.opacity = 0.85 + Math.sin(elapsedTime * 3.0) * 0.15;
      }
    } else {
      lockGroup.visible = true;
      orbitingCrystalsGroup.visible = false;
      chestLight.intensity = 0.2;
      auraMesh.scale.setScalar(1.0);
      if (auraMat) {
        auraMat.color.setHex(PALETTE.GOLD_ACCENT);
        auraMat.opacity = 0.45;
      }
    }
  };

  return {
    group,
    lidGroup,
    lockMesh: lockBody,
    chestLight,
    orbitingCrystalsGroup,
    auraMesh,
    position: chestPos,
    interactionPosition,
    interactionRadius,
    update,
  };
}
