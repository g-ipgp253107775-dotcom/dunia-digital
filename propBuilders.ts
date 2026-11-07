import * as THREE from 'three';
import { MaterialLibrary, PALETTE } from './materials';
import { createSignboardTexture } from '../utils/textures';

// Build a composite 3-12 part blocky tree (Matcha or Deep Green)
export function createBlockyTree(
  materials: MaterialLibrary,
  type: 'matcha' | 'sakura' | 'pine' = 'matcha',
  scale = 1.0
): THREE.Group {
  const tree = new THREE.Group();

  // Trunk
  const trunkGeo = new THREE.BoxGeometry(0.8 * scale, 3.2 * scale, 0.8 * scale);
  const trunk = new THREE.Mesh(trunkGeo, materials.woodDark);
  trunk.position.y = 1.6 * scale;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);

  // Tree roots at base
  const rootGeo = new THREE.BoxGeometry(1.2 * scale, 0.4 * scale, 1.2 * scale);
  const roots = new THREE.Mesh(rootGeo, materials.woodDark);
  roots.position.y = 0.2 * scale;
  roots.castShadow = true;
  roots.receiveShadow = true;
  tree.add(roots);

  if (type === 'sakura') {
    // Sakura: Layered Strawberry Pink and Hot Pink foliage blocks
    const leafMat = materials.leafStrawberryPink;
    const layer1Geo = new THREE.BoxGeometry(3.6 * scale, 1.4 * scale, 3.6 * scale);
    const layer1 = new THREE.Mesh(layer1Geo, leafMat);
    layer1.position.y = 3.6 * scale;
    layer1.castShadow = true;
    tree.add(layer1);

    const layer2Geo = new THREE.BoxGeometry(2.8 * scale, 1.3 * scale, 2.8 * scale);
    const layer2 = new THREE.Mesh(layer2Geo, leafMat);
    layer2.position.y = 4.8 * scale;
    layer2.castShadow = true;
    tree.add(layer2);

    const layer3Geo = new THREE.BoxGeometry(1.8 * scale, 1.1 * scale, 1.8 * scale);
    const layer3 = new THREE.Mesh(layer3Geo, leafMat);
    layer3.position.y = 5.8 * scale;
    layer3.castShadow = true;
    tree.add(layer3);

    // Blossom accents (Hot pink flower clusters)
    const blossomMat = materials.hotPinkAccent;
    const bGeo = new THREE.BoxGeometry(0.5 * scale, 0.5 * scale, 0.5 * scale);
    const b1 = new THREE.Mesh(bGeo, blossomMat);
    b1.position.set(1.4 * scale, 3.6 * scale, 1.4 * scale);
    const b2 = new THREE.Mesh(bGeo, blossomMat);
    b2.position.set(-1.3 * scale, 4.4 * scale, 1.2 * scale);
    const b3 = new THREE.Mesh(bGeo, blossomMat);
    b3.position.set(1.2 * scale, 4.7 * scale, -1.1 * scale);
    tree.add(b1, b2, b3);

  } else if (type === 'pine') {
    // Deep Green Pine: tiered pyramid blocks
    const leafMat = materials.leafDeepGreen;
    const sizes = [3.2, 2.4, 1.6, 0.8];
    sizes.forEach((sz, idx) => {
      const pGeo = new THREE.BoxGeometry(sz * scale, 1.1 * scale, sz * scale);
      const pMesh = new THREE.Mesh(pGeo, leafMat);
      pMesh.position.y = (3.0 + idx * 0.9) * scale;
      pMesh.castShadow = true;
      tree.add(pMesh);
    });
  } else {
    // Matcha Green Oak: blocky rounded canopies
    const leafMat = materials.leafMatcha;
    const mainCanopyGeo = new THREE.BoxGeometry(3.4 * scale, 1.6 * scale, 3.4 * scale);
    const mainCanopy = new THREE.Mesh(mainCanopyGeo, leafMat);
    mainCanopy.position.y = 3.6 * scale;
    mainCanopy.castShadow = true;
    tree.add(mainCanopy);

    const topCanopyGeo = new THREE.BoxGeometry(2.4 * scale, 1.4 * scale, 2.4 * scale);
    const topCanopy = new THREE.Mesh(topCanopyGeo, leafMat);
    topCanopy.position.y = 4.9 * scale;
    topCanopy.castShadow = true;
    tree.add(topCanopy);

    // Corner offset foliage chunks for voxel aesthetic
    const chunkGeo = new THREE.BoxGeometry(1.2 * scale, 1.2 * scale, 1.2 * scale);
    const c1 = new THREE.Mesh(chunkGeo, leafMat);
    c1.position.set(1.5 * scale, 3.4 * scale, 0.5 * scale);
    const c2 = new THREE.Mesh(chunkGeo, leafMat);
    c2.position.set(-1.4 * scale, 3.8 * scale, -0.6 * scale);
    tree.add(c1, c2);
  }

  return tree;
}

// Build 3D Blocky Flower
export function createBlockyFlower(materials: MaterialLibrary, scale = 1.0): THREE.Group {
  const flower = new THREE.Group();

  // Stem
  const stemGeo = new THREE.BoxGeometry(0.08 * scale, 0.6 * scale, 0.08 * scale);
  const stemMat = materials.leafDeepGreen;
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = 0.3 * scale;
  flower.add(stem);

  // 4 Petals
  const petalGeo = new THREE.BoxGeometry(0.35 * scale, 0.12 * scale, 0.18 * scale);
  const p1 = new THREE.Mesh(petalGeo, materials.flowerPetal);
  p1.position.set(0.18 * scale, 0.6 * scale, 0);

  const p2 = new THREE.Mesh(petalGeo, materials.flowerPetal);
  p2.position.set(-0.18 * scale, 0.6 * scale, 0);

  const p3 = new THREE.Mesh(petalGeo, materials.flowerPetal);
  p3.rotation.y = Math.PI / 2;
  p3.position.set(0, 0.6 * scale, 0.18 * scale);

  const p4 = new THREE.Mesh(petalGeo, materials.flowerPetal);
  p4.rotation.y = Math.PI / 2;
  p4.position.set(0, 0.6 * scale, -0.18 * scale);

  // Center core (hot pink)
  const coreGeo = new THREE.BoxGeometry(0.18 * scale, 0.18 * scale, 0.18 * scale);
  const core = new THREE.Mesh(coreGeo, materials.flowerCenter);
  core.position.y = 0.65 * scale;

  flower.add(p1, p2, p3, p4, core);
  return flower;
}

// Build Fantasy Glowing Mushroom
export function createMushroom(materials: MaterialLibrary, scale = 1.0): THREE.Group {
  const shroom = new THREE.Group();

  // Stem
  const stemGeo = new THREE.CylinderGeometry(0.12 * scale, 0.18 * scale, 0.6 * scale, 6);
  const stem = new THREE.Mesh(stemGeo, materials.whiteStone);
  stem.position.y = 0.3 * scale;
  shroom.add(stem);

  // Cap (Strawberry Red / Pink)
  const capGeo = new THREE.CylinderGeometry(0.5 * scale, 0.1 * scale, 0.35 * scale, 8);
  const cap = new THREE.Mesh(capGeo, materials.strawberryRoof);
  cap.position.y = 0.65 * scale;
  shroom.add(cap);

  // Spots
  const spotGeo = new THREE.BoxGeometry(0.1 * scale, 0.05 * scale, 0.1 * scale);
  const spot1 = new THREE.Mesh(spotGeo, materials.whiteStone);
  spot1.position.set(0.25 * scale, 0.75 * scale, 0.15 * scale);
  const spot2 = new THREE.Mesh(spotGeo, materials.whiteStone);
  spot2.position.set(-0.25 * scale, 0.75 * scale, -0.15 * scale);
  shroom.add(spot1, spot2);

  return shroom;
}

// Build Floating Lily Pad for river
export function createLilyPad(materials: MaterialLibrary, scale = 1.0): THREE.Group {
  const pad = new THREE.Group();
  const padGeo = new THREE.CylinderGeometry(0.8 * scale, 0.8 * scale, 0.05 * scale, 8);
  const padMesh = new THREE.Mesh(padGeo, materials.leafMatcha);
  pad.add(padMesh);

  // Small flower in center
  const flGeo = new THREE.BoxGeometry(0.25 * scale, 0.15 * scale, 0.25 * scale);
  const fl = new THREE.Mesh(flGeo, materials.flowerPetal);
  fl.position.y = 0.1 * scale;
  pad.add(fl);

  return pad;
}

// Build Wooden Signboard with crisp procedural text
export function createWoodenSignboard(
  materials: MaterialLibrary,
  title: string,
  subtitle = 'ZON PORTAL ILMU'
): THREE.Group {
  const sign = new THREE.Group();

  // Two wooden posts
  const postGeo = new THREE.BoxGeometry(0.25, 2.8, 0.25);
  const postL = new THREE.Mesh(postGeo, materials.woodDark);
  postL.position.set(-1.4, 1.4, 0);
  postL.castShadow = true;

  const postR = new THREE.Mesh(postGeo, materials.woodDark);
  postR.position.set(1.4, 1.4, 0);
  postR.castShadow = true;

  // Post caps
  const capGeo = new THREE.BoxGeometry(0.35, 0.2, 0.35);
  const capL = new THREE.Mesh(capGeo, materials.strawberryRoof);
  capL.position.set(-1.4, 2.85, 0);
  const capR = new THREE.Mesh(capGeo, materials.strawberryRoof);
  capR.position.set(1.4, 2.85, 0);

  // Top crossbar
  const crossGeo = new THREE.BoxGeometry(3.2, 0.2, 0.25);
  const cross = new THREE.Mesh(crossGeo, materials.woodDark);
  cross.position.set(0, 2.6, 0);

  // Board itself with high-res text canvas
  const boardTexture = createSignboardTexture(title, subtitle);
  const boardMat = new THREE.MeshStandardMaterial({
    map: boardTexture,
    roughness: 0.6,
    metalness: 0.1,
  });

  const boardGeo = new THREE.BoxGeometry(3.0, 1.5, 0.12);
  const boardMesh = new THREE.Mesh(boardGeo, boardMat);
  boardMesh.position.set(0, 1.6, 0.1);
  boardMesh.castShadow = true;

  // Small hanging rope loops
  const ropeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 6);
  const ropeL = new THREE.Mesh(ropeGeo, materials.woodRope);
  ropeL.position.set(-0.9, 2.45, 0.05);
  const ropeR = new THREE.Mesh(ropeGeo, materials.woodRope);
  ropeR.position.set(0.9, 2.45, 0.05);

  sign.add(postL, postR, capL, capR, cross, boardMesh, ropeL, ropeR);
  return sign;
}

// Build a Glowing Portal Arch with swirling vortex & small floating crystal
export function createPortalArch(
  materials: MaterialLibrary,
  portalColor = PALETTE.HOT_PINK
): { portalGroup: THREE.Group; vortexMesh: THREE.Mesh; crystalMesh: THREE.Mesh } {
  const portalGroup = new THREE.Group();

  // Stone pillars on sides
  const pillarGeo = new THREE.BoxGeometry(0.8, 4.2, 0.8);
  const pillarL = new THREE.Mesh(pillarGeo, materials.whiteStone);
  pillarL.position.set(-1.8, 2.1, 0);
  pillarL.castShadow = true;

  const pillarR = new THREE.Mesh(pillarGeo, materials.whiteStone);
  pillarR.position.set(1.8, 2.1, 0);
  pillarR.castShadow = true;

  // Pillar bases (blocky stepped feet)
  const baseGeo = new THREE.BoxGeometry(1.2, 0.6, 1.2);
  const baseL = new THREE.Mesh(baseGeo, materials.dirtBlock);
  baseL.position.set(-1.8, 0.3, 0);
  const baseR = new THREE.Mesh(baseGeo, materials.dirtBlock);
  baseR.position.set(1.8, 0.3, 0);

  // Top lintel arch
  const lintelGeo = new THREE.BoxGeometry(4.4, 0.9, 0.9);
  const lintel = new THREE.Mesh(lintelGeo, materials.strawberryRoof);
  lintel.position.set(0, 4.4, 0);
  lintel.castShadow = true;

  // Gemstones inlaid in pillars
  const gemGeo = new THREE.OctahedronGeometry(0.28);
  const gemMat = new THREE.MeshStandardMaterial({
    color: portalColor,
    emissive: portalColor,
    emissiveIntensity: 0.9,
    roughness: 0.2,
    metalness: 0.5,
  });
  const gemL = new THREE.Mesh(gemGeo, gemMat);
  gemL.position.set(-1.8, 2.4, 0.45);
  const gemR = new THREE.Mesh(gemGeo, gemMat);
  gemR.position.set(1.8, 2.4, 0.45);

  // Outer Glowing Portal Ring
  const ringGeo = new THREE.TorusGeometry(1.6, 0.18, 12, 24);
  const ringMat = new THREE.MeshStandardMaterial({
    color: portalColor,
    emissive: portalColor,
    emissiveIntensity: 1.0,
    roughness: 0.2,
    metalness: 0.4,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.set(0, 2.2, 0);

  // Inner Swirling Energy Vortex
  const vortexGeo = new THREE.CircleGeometry(1.4, 20);
  const vortexMat = new THREE.MeshBasicMaterial({
    color: portalColor,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
  });
  const vortexMesh = new THREE.Mesh(vortexGeo, vortexMat);
  vortexMesh.position.set(0, 2.2, 0);

  // Small floating rotating crystal atop the portal lintel
  const crystalGeo = new THREE.OctahedronGeometry(0.45, 0);
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: portalColor,
    emissive: portalColor,
    emissiveIntensity: 1.2,
    roughness: 0.1,
    metalness: 0.2,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.9,
  });
  const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
  crystalMesh.position.set(0, 5.4, 0);

  // Small pedestal for crystal
  const pedGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.3, 6);
  const ped = new THREE.Mesh(pedGeo, materials.whiteStone);
  ped.position.set(0, 4.95, 0);

  portalGroup.add(
    pillarL, pillarR, baseL, baseR, lintel,
    gemL, gemR, ring, vortexMesh, ped, crystalMesh
  );

  return { portalGroup, vortexMesh, crystalMesh };
}

// Build a Blocky Wooden Suspension Bridge
export function createWoodenBridge(
  materials: MaterialLibrary,
  from: [number, number, number],
  to: [number, number, number]
): THREE.Group {
  const bridge = new THREE.Group();

  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const dist = start.distanceTo(end);

  const numPlanks = Math.max(4, Math.floor(dist / 1.1));
  const plankGeo = new THREE.BoxGeometry(1.6, 0.18, 0.75);

  for (let i = 0; i <= numPlanks; i++) {
    const t = i / numPlanks;
    // Interpolate with subtle catenary sag
    const p = new THREE.Vector3().lerpVectors(start, end, t);
    const sag = Math.sin(t * Math.PI) * 0.45;
    p.y -= sag;

    const plank = new THREE.Mesh(plankGeo, materials.woodPlank);
    plank.position.copy(p);
    plank.lookAt(end.x, p.y, end.z);
    plank.castShadow = true;
    plank.receiveShadow = true;
    bridge.add(plank);

    // Occasional rope posts & handrails
    if (i % 2 === 0) {
      const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 6);
      const postL = new THREE.Mesh(postGeo, materials.woodDark);
      postL.position.set(p.x - 0.75, p.y + 0.45, p.z);

      const postR = new THREE.Mesh(postGeo, materials.woodDark);
      postR.position.set(p.x + 0.75, p.y + 0.45, p.z);

      bridge.add(postL, postR);
    }
  }

  return bridge;
}
