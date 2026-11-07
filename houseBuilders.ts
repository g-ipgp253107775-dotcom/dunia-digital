import * as THREE from 'three';
import { MaterialLibrary, PALETTE } from './materials';
import { createWoodenSignboard } from './propBuilders';
import { HouseConfig } from '../types';

export interface BuiltHouse {
  group: THREE.Group;
  config: HouseConfig;
  interactionAura: THREE.Mesh;
  floatingIcon: THREE.Object3D;
  doorPosition: THREE.Vector3;
}

export function buildExplorationHouse(config: HouseConfig, materials: MaterialLibrary): BuiltHouse {
  const group = new THREE.Group();
  group.name = `House_${config.id}`;
  group.position.set(...config.position);

  // Door position in world space
  const doorPosition = new THREE.Vector3(...config.doorPosition);

  // Common Base Foundation (Stone blocks)
  const baseGeo = new THREE.BoxGeometry(7.2, 0.8, 7.2);
  const baseMesh = new THREE.Mesh(baseGeo, materials.whiteStone);
  baseMesh.position.y = 0.4;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Common Ground Interaction Aura (in front of door)
  const auraGeo = new THREE.RingGeometry(1.6, 2.2, 24);
  const auraMat = new THREE.MeshStandardMaterial({
    color: config.themeColor,
    emissive: config.themeColor,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  });
  const interactionAura = new THREE.Mesh(auraGeo, auraMat);
  interactionAura.rotation.x = -Math.PI / 2;
  // Local door offset
  const localDoorX = config.doorPosition[0] - config.position[0];
  const localDoorZ = config.doorPosition[2] - config.position[2];
  interactionAura.position.set(localDoorX, 0.85, localDoorZ);
  group.add(interactionAura);

  // Signboard in front
  const signboard = createWoodenSignboard(
    materials,
    config.content.signboardTitle,
    `RUMAH 0${config.id}`
  );
  signboard.position.set(localDoorX - 3.4, 0.8, localDoorZ + 0.5);
  signboard.rotation.y = 0.25;
  group.add(signboard);

  let floatingIcon: THREE.Object3D = new THREE.Group();

  // Unique 3D Architecture for each house
  switch (config.id) {
    case 1: {
      // ==========================================
      // RUMAH 1: PERPUSTAKAAN MAKLUMAT (Library House)
      // ==========================================
      // Main walls in Cream wood
      const wallGeo = new THREE.BoxGeometry(6.0, 3.8, 5.5);
      const wallMesh = new THREE.Mesh(wallGeo, materials.woodPlank);
      wallMesh.position.y = 2.7;
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;

      // Pitched Roof in Hot Pink / Strawberry Red
      const roofGeo = new THREE.ConeGeometry(4.8, 2.8, 4);
      const roofMesh = new THREE.Mesh(roofGeo, materials.hotPinkAccent);
      roofMesh.rotation.y = Math.PI / 4;
      roofMesh.position.y = 5.8;
      roofMesh.castShadow = true;

      // Wooden Door
      const doorGeo = new THREE.BoxGeometry(1.6, 2.4, 0.2);
      const doorMesh = new THREE.Mesh(doorGeo, materials.woodDark);
      doorMesh.position.set(0, 2.0, 2.8);

      // Door Gold Knob
      const knobGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const knob = new THREE.Mesh(knobGeo, materials.gold);
      knob.position.set(0.5, 2.0, 2.95);

      // Bookshelf bay windows
      const windowL = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 0.3), materials.strawberryRoof);
      windowL.position.set(-1.8, 2.8, 2.8);
      const windowR = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 0.3), materials.strawberryRoof);
      windowR.position.set(1.8, 2.8, 2.8);

      // 3D Open Book on Gable Peak (Floating Icon)
      const bookGroup = new THREE.Group();
      bookGroup.position.set(0, 7.5, 0);

      const pageL = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 1.1), materials.whiteStone);
      pageL.position.set(-0.4, 0, 0);
      pageL.rotation.z = 0.25;

      const pageR = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 1.1), materials.whiteStone);
      pageR.position.set(0.4, 0, 0);
      pageR.rotation.z = -0.25;

      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 1.1), materials.strawberryRoof);

      bookGroup.add(pageL, pageR, spine);
      floatingIcon = bookGroup;

      group.add(wallMesh, roofMesh, doorMesh, knob, windowL, windowR, bookGroup);
      break;
    }

    case 2: {
      // ==========================================
      // RUMAH 2: PUSAT SASARAN (Target Lodge)
      // ==========================================
      const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(5.8, 4.0, 5.8), materials.whiteStone);
      wallMesh.position.y = 2.8;
      wallMesh.castShadow = true;

      // Stepped Pagoda Roof in Matcha Green
      const roofMesh = new THREE.ConeGeometry(4.8, 2.6, 4);
      const roof = new THREE.Mesh(roofMesh, materials.matchaGrass);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 5.9;

      // Wooden Arch Doorway
      const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.5, 0.2), materials.woodDark);
      doorMesh.position.set(0, 2.05, 2.95);

      // Archery / Target Rings on Facade
      const targetGroup = new THREE.Group();
      targetGroup.position.set(0, 6.8, 0);

      const r1 = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.12, 8, 20), materials.strawberryRoof);
      const r2 = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.1, 8, 20), materials.whiteStone);
      const r3 = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.08, 8, 20), materials.matchaGrass);
      const centerBull = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), materials.gold);

      // Arrow piercing the bullseye
      const arrowShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 6), materials.woodDark);
      arrowShaft.rotation.x = Math.PI / 4;
      arrowShaft.position.set(0, 0, 0.4);

      targetGroup.add(r1, r2, r3, centerBull, arrowShaft);
      floatingIcon = targetGroup;

      group.add(wallMesh, roof, doorMesh, targetGroup);
      break;
    }

    case 3: {
      // ==========================================
      // RUMAH 3: RUMAH ALAM SEKITAR (Eco House & Waterwheel)
      // ==========================================
      const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(6.0, 3.6, 5.6), materials.woodPlank);
      wallMesh.position.y = 2.6;
      wallMesh.castShadow = true;

      // Turf / Living Grass Roof (Matcha Green with flowers)
      const roofGeo = new THREE.ConeGeometry(5.0, 2.5, 4);
      const roof = new THREE.Mesh(roofGeo, materials.matchaGrass);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 5.6;

      const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.2), materials.woodDark);
      doorMesh.position.set(-2.95, 2.0, 0);
      doorMesh.rotation.y = Math.PI / 2;

      // Side Traditional Waterwheel
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(3.4, 2.2, 0);

      const wheelRim = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.12, 8, 16), materials.woodDark);
      const spoke1 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.15, 0.12), materials.woodPlank);
      const spoke2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 0.12), materials.woodPlank);
      wheelGroup.add(wheelRim, spoke1, spoke2);

      // Chimney with climbing vine
      const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.2, 0.8), materials.cliffRock);
      chimney.position.set(1.5, 6.0, -1.2);

      // Floating Tree & Leaf Icon
      const treeIcon = new THREE.Group();
      treeIcon.position.set(0, 7.4, 0);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.8, 6), materials.woodDark);
      const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7, 0), materials.matchaGrass);
      canopy.position.y = 0.8;
      treeIcon.add(trunk, canopy);
      floatingIcon = treeIcon;

      group.add(wallMesh, roof, doorMesh, wheelGroup, chimney, treeIcon);
      break;
    }

    case 4: {
      // ==========================================
      // RUMAH 4: MAKMAL INKUIRI & PENYIASATAN (Detective Lab)
      // ==========================================
      const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(5.6, 4.0, 5.6), materials.whiteStone);
      wallMesh.position.y = 2.8;
      wallMesh.castShadow = true;

      // Roof with Strawberry Pink eaves
      const roof = new THREE.Mesh(new THREE.ConeGeometry(4.6, 2.6, 4), materials.strawberryRoof);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 5.9;

      const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.2), materials.woodDark);
      doorMesh.position.set(0, 2.0, 2.85);

      // Observatory Telescope / Magnifying Lens on roof
      const magGroup = new THREE.Group();
      magGroup.position.set(0, 7.2, 0);

      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.12, 8, 20), materials.gold);
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.85, 16), materials.riverWater);
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6), materials.woodDark);
      handle.position.set(0.8, -0.8, 0);
      handle.rotation.z = Math.PI / 4;

      magGroup.add(ring, lens, handle);
      floatingIcon = magGroup;

      group.add(wallMesh, roof, doorMesh, magGroup);
      break;
    }

    case 5: {
      // ==========================================
      // RUMAH 5: DEWAN KOPERATIF (Cooperation Guildhall)
      // ==========================================
      const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(6.2, 3.8, 6.2), materials.woodPlank);
      wallMesh.position.y = 2.7;
      wallMesh.castShadow = true;

      // Deep Green Roof with Timber Gables
      const roof = new THREE.Mesh(new THREE.ConeGeometry(5.2, 2.6, 4), materials.deepGreenGrass);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 5.8;

      const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.5, 0.2), materials.woodDark);
      doorMesh.position.set(0, 2.05, 3.15);

      // Round Meeting Porch in front of door
      const porchGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.3, 12);
      const porch = new THREE.Mesh(porchGeo, materials.whiteStone);
      porch.position.set(0, 0.95, localDoorZ * 0.5);

      // Friendship Banner Totem (Floating Icon)
      const bannerGroup = new THREE.Group();
      bannerGroup.position.set(0, 7.4, 0);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 6), materials.woodDark);
      const flag1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.05), materials.hotPinkAccent);
      flag1.position.set(0.4, 0.5, 0);
      const flag2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.05), materials.matchaGrass);
      flag2.position.set(0.35, 0.1, 0);

      bannerGroup.add(pole, flag1, flag2);
      floatingIcon = bannerGroup;

      group.add(wallMesh, roof, doorMesh, porch, bannerGroup);
      break;
    }

    case 6: {
      // ==========================================
      // RUMAH 6: MENARA PENTAKSIRAN (Assessment Hall & Tower)
      // ==========================================
      // Two-tier Stepped Tower
      const tier1 = new THREE.Mesh(new THREE.BoxGeometry(5.8, 3.6, 5.8), materials.whiteStone);
      tier1.position.y = 2.6;
      tier1.castShadow = true;

      const tier2 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.4, 4.2), materials.whiteStone);
      tier2.position.y = 5.4;
      tier2.castShadow = true;

      // Steeple Roof in Hot Pink
      const roof = new THREE.Mesh(new THREE.ConeGeometry(3.2, 3.2, 4), materials.hotPinkAccent);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 8.0;

      const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.2), materials.woodDark);
      doorMesh.position.set(2.95, 2.0, 0);
      doorMesh.rotation.y = -Math.PI / 2;

      // Giant Golden Star / Trophy on top (Floating Icon)
      const starGroup = new THREE.Group();
      starGroup.position.set(0, 10.2, 0);

      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), materials.gold);
      const ribbonL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.05), materials.strawberryRoof);
      ribbonL.position.set(-0.25, -0.6, 0);
      ribbonL.rotation.z = 0.3;
      const ribbonR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.05), materials.strawberryRoof);
      ribbonR.position.set(0.25, -0.6, 0);
      ribbonR.rotation.z = -0.3;

      starGroup.add(star, ribbonL, ribbonR);
      floatingIcon = starGroup;

      group.add(tier1, tier2, roof, doorMesh, starGroup);
      break;
    }
  }

  return {
    group,
    config,
    interactionAura,
    floatingIcon,
    doorPosition,
  };
}
