import * as THREE from 'three';
import { MaterialLibrary } from './materials';
import { HOUSES_DATA, HouseConfig } from '../types';
import { buildExplorationHouse, BuiltHouse } from './houseBuilders';
import {
  createBlockyTree,
  createBlockyFlower,
  createMushroom,
} from './propBuilders';

export interface FloatingIslandResult {
  group: THREE.Group;
  bridgesGroup: THREE.Group;
  builtHouses: BuiltHouse[];
  animatedObjects: {
    object: THREE.Object3D;
    type: 'vortex' | 'crystal' | 'sway';
    initialY?: number;
    speed?: number;
  }[];
}

export function buildFloatingIslands(materials: MaterialLibrary): FloatingIslandResult {
  const group = new THREE.Group();
  group.name = 'FloatingIslands';

  const bridgesGroup = new THREE.Group();
  bridgesGroup.name = 'Bridges';

  const builtHouses: BuiltHouse[] = [];
  const animatedObjects: FloatingIslandResult['animatedObjects'] = [];

  HOUSES_DATA.forEach((houseConfig) => {
    const islandGroup = new THREE.Group();
    islandGroup.name = `Island_${houseConfig.id}`;
    islandGroup.position.set(houseConfig.position[0], houseConfig.position[1], houseConfig.position[2]);

    // ==========================================
    // 1. FLOATING ISLAND GEOMETRY & UNDERBELLY
    // ==========================================
    const width = 18;
    const depth = 18;
    const height = 2.8;

    // Grass Top
    const topGeo = new THREE.BoxGeometry(width, height, depth);
    const topMat = houseConfig.id === 5 ? materials.deepGreenGrass : materials.matchaGrass;
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 0;
    topMesh.receiveShadow = true;
    topMesh.castShadow = true;
    islandGroup.add(topMesh);

    // Dirt Loam Layer
    const dirtGeo = new THREE.BoxGeometry(width - 0.5, 3.2, depth - 0.5);
    const dirtMesh = new THREE.Mesh(dirtGeo, materials.dirtBlock);
    dirtMesh.position.y = -2.8;
    dirtMesh.receiveShadow = true;
    islandGroup.add(dirtMesh);

    // Inverted rocky floating underbelly
    const under1 = new THREE.Mesh(new THREE.BoxGeometry(width - 3, 2.5, depth - 3), materials.cliffRock);
    under1.position.y = -5.4;
    const under2 = new THREE.Mesh(new THREE.BoxGeometry(width - 7, 2.5, depth - 7), materials.cliffRock);
    under2.position.y = -7.6;
    const underTip = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.5, 3.5), materials.cliffRock);
    underTip.position.y = -9.8;
    underTip.rotation.y = 0.8;
    islandGroup.add(under1, under2, underTip);

    // Glowing root crystals underneath
    const rootGeo = new THREE.ConeGeometry(0.4, 2.2, 4);
    const rootMat = new THREE.MeshStandardMaterial({
      color: houseConfig.themeColor,
      emissive: houseConfig.themeColor,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });
    for (let r = 0; r < 4; r++) {
      const rx = (r - 1.5) * 2.8;
      const rz = (r % 2 === 0 ? 1 : -1) * 2.2;
      const rootMesh = new THREE.Mesh(rootGeo, rootMat);
      rootMesh.position.set(rx, -10.5, rz);
      rootMesh.rotation.x = Math.PI;
      islandGroup.add(rootMesh);
    }

    // ==========================================
    // 2. PATHWAYS & EMBANKMENTS
    // ==========================================
    const pathGeo = new THREE.BoxGeometry(4.0, 0.12, 10.0);
    const path = new THREE.Mesh(pathGeo, materials.stonePaver);
    path.position.set(0, 1.45, 2.0);
    path.receiveShadow = true;
    islandGroup.add(path);

    // Cozy Village Lantern Posts on Island Entrance
    const lanternPostGeo = new THREE.BoxGeometry(0.25, 2.4, 0.25);
    const lampL = new THREE.Mesh(lanternPostGeo, materials.woodDark);
    lampL.position.set(-2.8, 2.6, 6.0);
    const lampBoxL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.5), materials.flowerCenter);
    lampBoxL.position.set(-2.8, 3.8, 6.0);

    const lampR = new THREE.Mesh(lanternPostGeo, materials.woodDark);
    lampR.position.set(2.8, 2.6, 6.0);
    const lampBoxR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.5), materials.flowerCenter);
    lampBoxR.position.set(2.8, 3.8, 6.0);

    islandGroup.add(lampL, lampBoxL, lampR, lampBoxR);

    // ==========================================
    // 3. BUILD 3D EXPLORATION HOUSE
    // ==========================================
    const builtHouse = buildExplorationHouse(houseConfig, materials);
    builtHouses.push(builtHouse);
    group.add(builtHouse.group);

    animatedObjects.push({
      object: builtHouse.floatingIcon,
      type: 'crystal',
      initialY: builtHouse.floatingIcon.position.y,
      speed: 1.6
    });

    // Trees & Flowers on Island Perimeter
    const tree1 = createBlockyTree(materials, houseConfig.id % 2 === 0 ? 'sakura' : 'matcha', 1.0);
    tree1.position.set(5.8, 1.4, -4.5);
    islandGroup.add(tree1);

    const tree2 = createBlockyTree(materials, 'matcha', 0.85);
    tree2.position.set(-5.8, 1.4, -3.8);
    islandGroup.add(tree2);

    animatedObjects.push(
      { object: tree1, type: 'sway', speed: 1.0 },
      { object: tree2, type: 'sway', speed: 1.2 }
    );

    // Flowers & Mushrooms
    for (let f = 0; f < 6; f++) {
      const fl = createBlockyFlower(materials, 0.85);
      fl.position.set(3.5 + (f % 3) * 0.9, 1.4, 3.0 + (f > 2 ? 1.5 : 0));
      islandGroup.add(fl);
    }
    const shroom = createMushroom(materials, 0.9);
    shroom.position.set(-3.8, 1.4, 3.5);
    islandGroup.add(shroom);

    group.add(islandGroup);

    // ==========================================
    // 4. WIDE WALKABLE WOODEN SUSPENSION BRIDGE
    // ==========================================
    const startPoint: [number, number, number] = [
      houseConfig.position[0] * 0.35,
      3.65,
      houseConfig.position[2] * 0.35
    ];
    const endPoint: [number, number, number] = [
      houseConfig.position[0] * 0.82,
      houseConfig.position[1] + 1.4,
      houseConfig.position[2] * 0.82
    ];

    const bridge = createWideWalkableBridge(materials, startPoint, endPoint);
    bridgesGroup.add(bridge);
  });

  return {
    group,
    bridgesGroup,
    builtHouses,
    animatedObjects
  };
}

// Build a wide, safe, beautiful walkable bridge for player avatar
function createWideWalkableBridge(
  materials: MaterialLibrary,
  from: [number, number, number],
  to: [number, number, number]
): THREE.Group {
  const bridge = new THREE.Group();

  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const dist = start.distanceTo(end);

  const numPlanks = Math.max(6, Math.floor(dist / 1.2));
  const plankGeo = new THREE.BoxGeometry(3.2, 0.25, 0.95); // Wide 3.2m plank for easy walking

  for (let i = 0; i <= numPlanks; i++) {
    const t = i / numPlanks;
    const p = new THREE.Vector3().lerpVectors(start, end, t);
    // Very gentle sag so player can walk smoothly without tripping
    const sag = Math.sin(t * Math.PI) * 0.25;
    p.y -= sag;

    const plank = new THREE.Mesh(plankGeo, materials.woodPlank);
    plank.position.copy(p);
    plank.lookAt(end.x, p.y, end.z);
    plank.castShadow = true;
    plank.receiveShadow = true;
    bridge.add(plank);

    // Guard rails on both sides
    if (i % 2 === 0) {
      const postGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.1, 6);
      const postL = new THREE.Mesh(postGeo, materials.woodDark);
      postL.position.set(p.x - 1.5, p.y + 0.55, p.z);
      const postR = new THREE.Mesh(postGeo, materials.woodDark);
      postR.position.set(p.x + 1.5, p.y + 0.55, p.z);

      // Cute small lantern on every 4th plank
      if (i % 4 === 0) {
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 0.3), materials.flowerCenter);
        lamp.position.set(p.x + 1.5, p.y + 1.1, p.z);
        bridge.add(lamp);
      }

      bridge.add(postL, postR);
    }
  }

  // Continuous rope handrail on left & right
  const ropeLGeo = new THREE.BoxGeometry(0.12, 0.12, dist);
  const ropeL = new THREE.Mesh(ropeLGeo, materials.woodRope);
  const midPoint = new THREE.Vector3().lerpVectors(start, end, 0.5);
  ropeL.position.set(midPoint.x - 1.5, midPoint.y + 1.0, midPoint.z);
  ropeL.lookAt(end.x - 1.5, end.y + 1.0, end.z);

  const ropeR = new THREE.Mesh(ropeLGeo, materials.woodRope);
  ropeR.position.set(midPoint.x + 1.5, midPoint.y + 1.0, midPoint.z);
  ropeR.lookAt(end.x + 1.5, end.y + 1.0, end.z);

  bridge.add(ropeL, ropeR);

  return bridge;
}
