import * as THREE from 'three';
import { MaterialLibrary, PALETTE } from './materials';
import { createBlockyTree, createBlockyFlower, createMushroom } from './propBuilders';
import { buildTreasureChest, BuiltTreasureChest } from './treasureChestBuilder';

export interface MainIslandResult {
  group: THREE.Group;
  giantCrystalMesh: THREE.Mesh;
  crystalLight: THREE.PointLight;
  treasureChest: BuiltTreasureChest;
  animatedMeshes: {
    mesh: THREE.Object3D;
    type: 'crystal' | 'sway' | 'waterfall';
    initialY?: number;
    speed?: number;
  }[];
}

export function buildMainIsland(materials: MaterialLibrary): MainIslandResult {
  const group = new THREE.Group();
  group.name = 'MainIsland';

  const animatedMeshes: MainIslandResult['animatedMeshes'] = [];

  // ==========================================
  // 1. MAIN ISLAND VOXEL TERRAIN TIERS
  // ==========================================
  // Island Top Plateau (Matcha Green)
  const topGeo = new THREE.BoxGeometry(26, 3.5, 26);
  const topMesh = new THREE.Mesh(topGeo, materials.matchaGrass);
  topMesh.position.set(0, 1.75, 0);
  topMesh.receiveShadow = true;
  group.add(topMesh);

  // Upper Sub-Terrace (East side elevation)
  const upperTierGeo = new THREE.BoxGeometry(12, 1.5, 10);
  const upperTier = new THREE.Mesh(upperTierGeo, materials.matchaGrass);
  upperTier.position.set(6, 4.25, -6);
  upperTier.receiveShadow = true;
  group.add(upperTier);

  // Dirt / Loam layers below
  const dirtGeo = new THREE.BoxGeometry(25, 4.0, 25);
  const dirtMesh = new THREE.Mesh(dirtGeo, materials.dirtBlock);
  dirtMesh.position.set(0, -2.0, 0);
  dirtMesh.receiveShadow = true;
  group.add(dirtMesh);

  // Rocky stepped underbelly
  const rockStep1 = new THREE.Mesh(new THREE.BoxGeometry(20, 3.0, 20), materials.cliffRock);
  rockStep1.position.set(0, -5.5, 0);
  const rockStep2 = new THREE.Mesh(new THREE.BoxGeometry(14, 3.0, 14), materials.cliffRock);
  rockStep2.position.set(0, -8.5, 0);
  const rockTip = new THREE.Mesh(new THREE.BoxGeometry(6, 2.5, 6), materials.cliffRock);
  rockTip.position.set(0, -11.0, 0);
  group.add(rockStep1, rockStep2, rockTip);

  // ==========================================
  // 2. CENTRAL PLAZA & GIANT GLOWING CRYSTAL
  // ==========================================
  // Cream Cobblestone central plaza
  const plazaGeo = new THREE.CylinderGeometry(6.5, 7.0, 0.25, 12);
  const plaza = new THREE.Mesh(plazaGeo, materials.stonePaver);
  plaza.position.set(0, 3.65, 0);
  plaza.receiveShadow = true;
  group.add(plaza);

  // Outer plaza ring border
  const plazaRingGeo = new THREE.TorusGeometry(6.6, 0.35, 8, 24);
  const plazaRing = new THREE.Mesh(plazaRingGeo, materials.strawberryRoof);
  plazaRing.rotation.x = Math.PI / 2;
  plazaRing.position.set(0, 3.75, 0);
  group.add(plazaRing);

  // Stepped Plinth for Giant Crystal
  const plinthStep1 = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.4, 0.6, 8), materials.whiteStone);
  plinthStep1.position.set(0, 4.0, 0);
  plinthStep1.castShadow = true;
  plinthStep1.receiveShadow = true;

  const plinthStep2 = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.4, 0.8, 8), materials.whiteStone);
  plinthStep2.position.set(0, 4.6, 0);
  plinthStep2.castShadow = true;

  const plinthPillar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 1.4), materials.hotPinkAccent);
  plinthPillar.position.set(0, 5.4, 0);

  group.add(plinthStep1, plinthStep2, plinthPillar);

  // GIANT GLOWING CRYSTAL (Double-pointed faceted Octahedron)
  const giantCrystalGeo = new THREE.OctahedronGeometry(2.2, 0);
  const giantCrystalMesh = new THREE.Mesh(giantCrystalGeo, materials.giantCrystal);
  giantCrystalMesh.position.set(0, 8.4, 0);
  giantCrystalMesh.castShadow = true;
  group.add(giantCrystalMesh);

  // Pulsing PointLight for central crystal
  const crystalLight = new THREE.PointLight(PALETTE.HOT_PINK, 5.0, 24);
  crystalLight.position.set(0, 8.4, 0);
  group.add(crystalLight);

  animatedMeshes.push({
    mesh: giantCrystalMesh,
    type: 'crystal',
    initialY: 8.4,
    speed: 1.2
  });

  // 4 Surrounding Rune Obelisks on plaza perimeter
  const obeliskAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  obeliskAngles.forEach((ang) => {
    const obX = Math.cos(ang) * 4.8;
    const obZ = Math.sin(ang) * 4.8;

    const obBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.8, 0.8), materials.whiteStone);
    obBase.position.set(obX, 4.5, obZ);
    obBase.castShadow = true;

    const obGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.35), materials.hotPinkAccent);
    obGem.position.set(obX, 5.8, obZ);

    group.add(obBase, obGem);
  });

  // ==========================================
  // 3. ADVENTURE TOWER & TREEHOUSE (MENARA PENGEMBARAAN)
  // ==========================================
  const towerGroup = new THREE.Group();
  towerGroup.position.set(-7.5, 3.5, -6.5);

  // Tower 4 corner wooden stilts
  const stiltGeo = new THREE.BoxGeometry(0.6, 8.0, 0.6);
  const corners = [
    [-2, -2],
    [2, -2],
    [-2, 2],
    [2, 2],
  ];
  corners.forEach(([cx, cz]) => {
    const stilt = new THREE.Mesh(stiltGeo, materials.woodDark);
    stilt.position.set(cx, 4.0, cz);
    stilt.castShadow = true;
    towerGroup.add(stilt);
  });

  // Tower Level 1 Platform
  const floor1Geo = new THREE.BoxGeometry(5.2, 0.4, 5.2);
  const floor1 = new THREE.Mesh(floor1Geo, materials.woodPlank);
  floor1.position.set(0, 4.0, 0);
  floor1.castShadow = true;
  towerGroup.add(floor1);

  // Tower Level 2 Platform & Balcony
  const floor2Geo = new THREE.BoxGeometry(5.2, 0.4, 5.2);
  const floor2 = new THREE.Mesh(floor2Geo, materials.woodPlank);
  floor2.position.set(0, 7.8, 0);
  floor2.castShadow = true;
  towerGroup.add(floor2);

  // Enclosed Room on Level 1-2
  const roomGeo = new THREE.BoxGeometry(3.6, 3.4, 3.6);
  const room = new THREE.Mesh(roomGeo, materials.woodPlank);
  room.position.set(0, 5.9, 0);
  room.castShadow = true;
  towerGroup.add(room);

  // Balustrade railings around Level 2
  const railGeo = new THREE.BoxGeometry(5.0, 0.8, 0.15);
  const railN = new THREE.Mesh(railGeo, materials.woodDark);
  railN.position.set(0, 8.3, -2.4);
  const railS = new THREE.Mesh(railGeo, materials.woodDark);
  railS.position.set(0, 8.3, 2.4);
  const railE = new THREE.Mesh(railGeo, materials.woodDark);
  railE.rotation.y = Math.PI / 2;
  railE.position.set(2.4, 8.3, 0);
  const railW = new THREE.Mesh(railGeo, materials.woodDark);
  railW.rotation.y = Math.PI / 2;
  railW.position.set(-2.4, 8.3, 0);
  towerGroup.add(railN, railS, railE, railW);

  // Pitch Hip Roof in Strawberry Red
  const roofGeo = new THREE.ConeGeometry(4.2, 3.0, 4);
  const roof = new THREE.Mesh(roofGeo, materials.strawberryRoof);
  roof.rotation.y = Math.PI / 4;
  roof.position.set(0, 10.2, 0);
  roof.castShadow = true;
  towerGroup.add(roof);

  // Flagpole & Adventure Pennant (Hot Pink)
  const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.4, 6);
  const pole = new THREE.Mesh(poleGeo, materials.woodDark);
  pole.position.set(0, 12.4, 0);

  const flagGeo = new THREE.BoxGeometry(1.6, 0.8, 0.05);
  const flag = new THREE.Mesh(flagGeo, materials.hotPinkAccent);
  flag.position.set(0.8, 12.8, 0);
  towerGroup.add(pole, flag);

  // Wooden Ladder climbing up
  const ladderGeo = new THREE.BoxGeometry(1.0, 4.0, 0.15);
  const ladder = new THREE.Mesh(ladderGeo, materials.woodDark);
  ladder.position.set(0, 2.0, 2.6);
  towerGroup.add(ladder);

  group.add(towerGroup);

  // ==========================================
  // 4. PATHWAYS, TREES & FLORA ON MAIN ISLAND
  // ==========================================
  // Cobblestone walkway arms branching out to bridges
  const branchDirections = [
    { x: -11, z: -8, rot: 0.6 },
    { x: 10, z: -10, rot: -0.8 },
    { x: 11, z: 4, rot: 0.2 },
    { x: 7, z: 10, rot: 1.1 },
    { x: -8, z: 9, rot: 2.2 },
    { x: -12, z: 1, rot: 3.1 },
  ];

  branchDirections.forEach((br) => {
    const pathGeo = new THREE.BoxGeometry(2.4, 0.1, 7.0);
    const path = new THREE.Mesh(pathGeo, materials.stonePaver);
    path.position.set(br.x / 1.7, 3.55, br.z / 1.7);
    path.rotation.y = br.rot;
    path.receiveShadow = true;
    group.add(path);
  });

  // Trees on main island
  const mainIslandTrees = [
    { type: 'sakura' as const, x: -7, z: 5, s: 1.1 },
    { type: 'sakura' as const, x: -4, z: 8, s: 0.9 },
    { type: 'matcha' as const, x: 7, z: -2, s: 1.2 },
    { type: 'matcha' as const, x: 8, z: 6, s: 1.0 },
    { type: 'pine' as const, x: 3, z: -8, s: 1.2 },
    { type: 'sakura' as const, x: 8, z: -7, s: 1.1 },
    { type: 'matcha' as const, x: -8, z: -1, s: 0.95 },
  ];

  mainIslandTrees.forEach((t) => {
    const tree = createBlockyTree(materials, t.type, t.s);
    tree.position.set(t.x, 3.5, t.z);
    group.add(tree);

    animatedMeshes.push({
      mesh: tree,
      type: 'sway',
      speed: 0.8 + Math.random() * 0.4
    });
  });

  // Flowers and Mushrooms scattered
  for (let i = 0; i < 22; i++) {
    const ang = (i / 22) * Math.PI * 2 + (i % 3);
    const dist = 5.5 + (i % 6);
    const fx = Math.cos(ang) * dist;
    const fz = Math.sin(ang) * dist;

    if (i % 3 === 0) {
      const shroom = createMushroom(materials, 0.8 + (i % 3) * 0.2);
      shroom.position.set(fx, 3.5, fz);
      group.add(shroom);
    } else {
      const flower = createBlockyFlower(materials, 0.9 + (i % 2) * 0.3);
      flower.position.set(fx, 3.5, fz);
      group.add(flower);

      animatedMeshes.push({
        mesh: flower,
        type: 'sway',
        speed: 1.2 + (i % 3) * 0.3
      });
    }
  }

  // Wooden campsite barrels & crates near tower
  const barrelGeo = new THREE.CylinderGeometry(0.4, 0.45, 0.9, 8);
  const b1 = new THREE.Mesh(barrelGeo, materials.woodDark);
  b1.position.set(-4.5, 3.95, -5.0);
  const b2 = new THREE.Mesh(barrelGeo, materials.woodDark);
  b2.position.set(-4.0, 3.95, -4.2);
  const crateGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
  const crate = new THREE.Mesh(crateGeo, materials.woodPlank);
  crate.position.set(-4.2, 3.9, -6.0);
  group.add(b1, b2, crate);

  // 3D TREASURE CHEST IN MAIN PLAZA
  const treasureChest = buildTreasureChest(materials);
  group.add(treasureChest.group);

  return {
    group,
    giantCrystalMesh,
    crystalLight,
    treasureChest,
    animatedMeshes
  };
}
