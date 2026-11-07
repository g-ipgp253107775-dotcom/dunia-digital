import * as THREE from 'three';
import { MaterialLibrary, PALETTE } from './materials';

export interface SceneryResult {
  group: THREE.Group;
  waterMesh: THREE.Mesh;
  waterfalls: { mesh: THREE.Mesh; initialY: number; speed: number }[];
  clouds: { group: THREE.Group; speed: number; initialX: number }[];
  particles: {
    instancedMesh: THREE.InstancedMesh;
    count: number;
    initialData: { x: number; y: number; z: number; phase: number; speed: number }[];
  };
}

export function buildScenery(materials: MaterialLibrary): SceneryResult {
  const group = new THREE.Group();
  group.name = 'Scenery';

  // ==========================================
  // 1. BIG RIVER BASIN (SUNGAI BESAR)
  // ==========================================
  // River water plane
  const waterGeo = new THREE.PlaneGeometry(160, 160, 32, 32);
  const waterMesh = new THREE.Mesh(waterGeo, materials.riverWater);
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.y = -6.0;
  waterMesh.receiveShadow = true;
  group.add(waterMesh);

  // Riverbed floor underneath water
  const bedGeo = new THREE.PlaneGeometry(170, 170);
  const bedMesh = new THREE.Mesh(bedGeo, materials.cliffRock);
  bedMesh.rotation.x = -Math.PI / 2;
  bedMesh.position.y = -8.5;
  group.add(bedMesh);

  // Stepping stones and river rocks
  const riverRocks = [
    { x: 12, z: -8, s: 2.2 },
    { x: -14, z: 12, s: 1.8 },
    { x: 22, z: 15, s: 2.5 },
    { x: -18, z: -16, s: 2.0 },
    { x: 0, z: 22, s: 1.6 },
    { x: -5, z: -20, s: 2.4 },
    { x: 18, z: -18, s: 1.9 },
  ];

  riverRocks.forEach((rk) => {
    const rGeo = new THREE.BoxGeometry(rk.s, 1.4, rk.s);
    const rMesh = new THREE.Mesh(rGeo, materials.whiteStone);
    rMesh.position.set(rk.x, -5.8, rk.z);
    rMesh.rotation.y = rk.s;
    group.add(rMesh);
  });

  // ==========================================
  // 2. BLOCKY WATERFALLS (AIR TERJUN BERTINGKAT)
  // ==========================================
  const waterfalls: SceneryResult['waterfalls'] = [];

  // Waterfall 1: East cliff of Main Island down to river
  // Waterfall 2: South-East Floating Island cliff
  // Waterfall 3: North-West island stream
  const waterfallPositions = [
    { startX: 13, startY: 1.8, startZ: 2, height: 7.8, width: 3.2, rotY: 0 },
    { startX: 30, startY: 1.5, startZ: 14, height: 7.5, width: 2.8, rotY: 0.5 },
    { startX: -26, startY: 2.5, startZ: -18, height: 8.5, width: 2.4, rotY: -0.4 },
  ];

  waterfallPositions.forEach((wf) => {
    const wfGeo = new THREE.BoxGeometry(wf.width, wf.height, 0.4);
    const wfMesh = new THREE.Mesh(wfGeo, materials.waterfallFoam);
    wfMesh.position.set(wf.startX, wf.startY - wf.height / 2, wf.startZ);
    wfMesh.rotation.y = wf.rotY;
    group.add(wfMesh);

    // Splash foam blocks at the bottom
    for (let sp = 0; sp < 4; sp++) {
      const spGeo = new THREE.BoxGeometry(0.8, 0.4, 0.8);
      const spMesh = new THREE.Mesh(spGeo, materials.waterfallFoam);
      spMesh.position.set(
        wf.startX + (sp - 1.5) * 0.7,
        -5.7,
        wf.startZ + (sp % 2 === 0 ? 0.4 : -0.4)
      );
      group.add(spMesh);
    }

    waterfalls.push({
      mesh: wfMesh,
      initialY: wf.startY - wf.height / 2,
      speed: 2.0
    });
  });

  // ==========================================
  // 3. BACKGROUND MOUNTAINS & ROLLING HILLS (GUNUNG & BUKIT)
  // ==========================================
  // Perimeter mountain peaks in Deep Green and Matcha Green
  const mountainConfigs = [
    // North Ridge
    { x: -45, y: 16, z: -65, w: 28, h: 32, d: 24, mat: materials.deepGreenGrass },
    { x: -15, y: 22, z: -70, w: 32, h: 44, d: 28, mat: materials.matchaGrass },
    { x: 20, y: 18, z: -68, w: 26, h: 36, d: 24, mat: materials.deepGreenGrass },
    { x: 50, y: 14, z: -62, w: 24, h: 28, d: 22, mat: materials.matchaGrass },

    // East Ridge
    { x: 68, y: 18, z: -25, w: 28, h: 36, d: 28, mat: materials.matchaGrass },
    { x: 72, y: 24, z: 10, w: 34, h: 48, d: 30, mat: materials.deepGreenGrass },
    { x: 65, y: 16, z: 45, w: 28, h: 32, d: 26, mat: materials.matchaGrass },

    // South Ridge
    { x: 35, y: 15, z: 68, w: 30, h: 30, d: 26, mat: materials.deepGreenGrass },
    { x: -5, y: 20, z: 72, w: 36, h: 40, d: 30, mat: materials.matchaGrass },
    { x: -40, y: 17, z: 66, w: 30, h: 34, d: 26, mat: materials.deepGreenGrass },

    // West Ridge
    { x: -70, y: 19, z: 30, w: 28, h: 38, d: 28, mat: materials.matchaGrass },
    { x: -75, y: 25, z: -10, w: 32, h: 50, d: 30, mat: materials.deepGreenGrass },
    { x: -68, y: 16, z: -45, w: 26, h: 32, d: 26, mat: materials.matchaGrass },
  ];

  mountainConfigs.forEach((m) => {
    // Stepped voxel mountain: base and peak
    const baseGeo = new THREE.BoxGeometry(m.w, m.h * 0.7, m.d);
    const baseMesh = new THREE.Mesh(baseGeo, m.mat);
    baseMesh.position.set(m.x, m.y - m.h * 0.15, m.z);
    baseMesh.receiveShadow = true;

    // Peak tier
    const peakGeo = new THREE.BoxGeometry(m.w * 0.6, m.h * 0.5, m.d * 0.6);
    const peakMesh = new THREE.Mesh(peakGeo, m.mat);
    peakMesh.position.set(m.x, m.y + m.h * 0.45, m.z);
    peakMesh.receiveShadow = true;

    // Strawberry pink / snow-crystal crest on top of highest peaks
    if (m.h > 40) {
      const capGeo = new THREE.BoxGeometry(m.w * 0.35, m.h * 0.18, m.d * 0.35);
      const capMesh = new THREE.Mesh(capGeo, materials.whiteStone);
      capMesh.position.set(m.x, m.y + m.h * 0.72, m.z);
      group.add(capMesh);
    }

    group.add(baseMesh, peakMesh);
  });

  // ==========================================
  // 4. DRIFTING 3D VOXEL CLOUDS (AWAN 3D)
  // ==========================================
  const clouds: SceneryResult['clouds'] = [];
  const cloudConfigs = [
    { x: -40, y: 34, z: -30, scale: 1.2, speed: 0.8 },
    { x: 10, y: 38, z: -45, scale: 1.4, speed: 1.1 },
    { x: 45, y: 32, z: -15, scale: 1.0, speed: 0.9 },
    { x: -20, y: 36, z: 35, scale: 1.3, speed: 1.2 },
    { x: 30, y: 40, z: 40, scale: 1.5, speed: 0.7 },
    { x: -55, y: 30, z: 10, scale: 1.1, speed: 1.0 },
  ];

  cloudConfigs.forEach((c) => {
    const cloudGrp = new THREE.Group();
    cloudGrp.position.set(c.x, c.y, c.z);

    // Voxel cloud composed of 4 overlapping soft white boxes
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(10 * c.scale, 2.8 * c.scale, 5 * c.scale), materials.cloud);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(6 * c.scale, 4.0 * c.scale, 4.5 * c.scale), materials.cloud);
    b2.position.set(0, 0.6 * c.scale, 0);
    const b3 = new THREE.Mesh(new THREE.BoxGeometry(4 * c.scale, 2.2 * c.scale, 6 * c.scale), materials.cloud);
    b3.position.set(2 * c.scale, -0.3 * c.scale, 0);

    cloudGrp.add(b1, b2, b3);
    group.add(cloudGrp);

    clouds.push({
      group: cloudGrp,
      speed: c.speed,
      initialX: c.x
    });
  });

  // ==========================================
  // 5. FLOATING MAGICAL LIGHT PARTICLES (InstancedMesh)
  // ==========================================
  const particleCount = 80;
  const particleGeo = new THREE.DodecahedronGeometry(0.2, 0);
  const particleMat = new THREE.MeshStandardMaterial({
    color: PALETTE.HOT_PINK,
    emissive: PALETTE.HOT_PINK,
    emissiveIntensity: 1.5,
    roughness: 0.2,
    metalness: 0.1,
  });

  const instancedMesh = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
  instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  const initialData: SceneryResult['particles']['initialData'] = [];
  const dummy = new THREE.Object3D();

  for (let i = 0; i < particleCount; i++) {
    const ang = Math.random() * Math.PI * 2;
    const radius = 6 + Math.random() * 38;
    const x = Math.cos(ang) * radius;
    const y = 3 + Math.random() * 14;
    const z = Math.sin(ang) * radius;
    const phase = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 1.0;

    initialData.push({ x, y, z, phase, speed });

    dummy.position.set(x, y, z);
    dummy.scale.setScalar(0.7 + Math.random() * 0.6);
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
  group.add(instancedMesh);

  return {
    group,
    waterMesh,
    waterfalls,
    clouds,
    particles: {
      instancedMesh,
      count: particleCount,
      initialData
    }
  };
}
