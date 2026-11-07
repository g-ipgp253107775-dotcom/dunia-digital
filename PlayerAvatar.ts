import * as THREE from 'three';
import { MaterialLibrary, PALETTE } from '../world/materials';

export type AvatarAnimationState = 'idle' | 'walk' | 'run' | 'jump' | 'interact' | 'celebrate';

export type SpeedTier = 'perlahan' | 'sederhana' | 'pantas';

export class PlayerAvatar {
  public mesh: THREE.Group;
  public position: THREE.Vector3 = new THREE.Vector3(0, 3.65, 4); // Start at central plaza
  public rotationY: number = 0;
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public isGrounded: boolean = true;
  public animState: AvatarAnimationState = 'idle';
  public speedTier: SpeedTier = 'sederhana';

  // Sub-mesh parts for hierarchical limb animation
  private bodyGroup: THREE.Group;
  private headGroup: THREE.Group;
  private torsoMesh: THREE.Mesh;
  private backpackGroup: THREE.Group;
  private leftArmGroup: THREE.Group;
  private rightArmGroup: THREE.Group;
  private leftLegGroup: THREE.Group;
  private rightLegGroup: THREE.Group;

  // Animation cycle trackers
  private animTimer: number = 0;
  private celebrateTimer: number = 0;

  public setSpeedTier(tier: SpeedTier) {
    this.speedTier = tier;
  }

  constructor(materials: MaterialLibrary) {
    this.mesh = new THREE.Group();
    this.mesh.name = 'PlayerAvatar';

    // Base materials for character
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xF3C299, // Warm peach skin
      roughness: 0.8,
      metalness: 0.05,
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x2C1D11, // Dark brown hair
      roughness: 0.9,
    });

    const capMat = new THREE.MeshStandardMaterial({
      color: PALETTE.MATCHA_GREEN,
      roughness: 0.7,
      metalness: 0.1,
    });

    const capBrimMat = new THREE.MeshStandardMaterial({
      color: PALETTE.HOT_PINK,
      roughness: 0.6,
      metalness: 0.1,
    });

    const shirtMat = new THREE.MeshStandardMaterial({
      color: PALETTE.HOT_PINK,
      roughness: 0.7,
      metalness: 0.05,
    });

    const vestTrimMat = new THREE.MeshStandardMaterial({
      color: PALETTE.MATCHA_GREEN,
      roughness: 0.6,
      metalness: 0.1,
    });

    const shortsMat = new THREE.MeshStandardMaterial({
      color: PALETTE.DEEP_GREEN,
      roughness: 0.8,
      metalness: 0.05,
    });

    const bootMat = new THREE.MeshStandardMaterial({
      color: 0x4A2F1B, // Brown hiking boots
      roughness: 0.7,
    });

    const bagMat = new THREE.MeshStandardMaterial({
      color: 0x825330, // Leather rucksack
      roughness: 0.8,
    });

    // 1. Root Body Group
    this.bodyGroup = new THREE.Group();
    this.bodyGroup.position.y = 1.0; // Pivot above ground
    this.mesh.add(this.bodyGroup);

    // 2. Torso (Jacket with explorer pockets)
    const torsoGeo = new THREE.BoxGeometry(0.85, 1.0, 0.48);
    this.torsoMesh = new THREE.Mesh(torsoGeo, shirtMat);
    this.torsoMesh.position.y = 0.5;
    this.torsoMesh.castShadow = true;
    this.bodyGroup.add(this.torsoMesh);

    // Explorer Vest Pockets & Belt
    const pocketGeo = new THREE.BoxGeometry(0.28, 0.28, 0.08);
    const pL = new THREE.Mesh(pocketGeo, vestTrimMat);
    pL.position.set(-0.24, 0.45, 0.25);
    const pR = new THREE.Mesh(pocketGeo, vestTrimMat);
    pR.position.set(0.24, 0.45, 0.25);

    const beltGeo = new THREE.BoxGeometry(0.88, 0.16, 0.5);
    const belt = new THREE.Mesh(beltGeo, shortsMat);
    belt.position.set(0, 0.1, 0);

    const buckleGeo = new THREE.BoxGeometry(0.22, 0.18, 0.52);
    const buckle = new THREE.Mesh(buckleGeo, materials.gold);
    buckle.position.set(0, 0.1, 0);

    this.torsoMesh.add(pL, pR, belt, buckle);

    // 3. Explorer Backpack on Back
    this.backpackGroup = new THREE.Group();
    this.backpackGroup.position.set(0, 0.55, -0.32);

    const bagMain = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.75, 0.32), bagMat);
    bagMain.castShadow = true;

    // Rolled bedroll on top of backpack (Hot Pink)
    const rollGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.65, 8);
    const roll = new THREE.Mesh(rollGeo, capBrimMat);
    roll.rotation.z = Math.PI / 2;
    roll.position.set(0, 0.45, 0);

    // Small canteen flask on side (Matcha Green)
    const flaskGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 6);
    const flask = new THREE.Mesh(flaskGeo, capMat);
    flask.position.set(0.38, -0.1, 0);

    this.backpackGroup.add(bagMain, roll, flask);
    this.bodyGroup.add(this.backpackGroup);

    // 4. Head Group (with Hair & Explorer Cap)
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.25, 0);

    // Blocky Head
    const headGeo = new THREE.BoxGeometry(0.68, 0.68, 0.64);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Hair sides and back
    const hairTopGeo = new THREE.BoxGeometry(0.72, 0.2, 0.68);
    const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
    hairTop.position.set(0, 0.3, -0.02);

    const hairBackGeo = new THREE.BoxGeometry(0.72, 0.45, 0.15);
    const hairBack = new THREE.Mesh(hairBackGeo, hairMat);
    hairBack.position.set(0, 0.05, -0.3);
    this.headGroup.add(hairTop, hairBack);

    // Explorer Cap
    const capGeo = new THREE.BoxGeometry(0.74, 0.22, 0.72);
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0, 0.38, 0);

    // Cap Visor / Brim (Hot Pink)
    const brimGeo = new THREE.BoxGeometry(0.7, 0.08, 0.35);
    const brim = new THREE.Mesh(brimGeo, capBrimMat);
    brim.position.set(0, 0.32, 0.42);

    // Cap Badge / Emblem
    const badgeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.06);
    const badge = new THREE.Mesh(badgeGeo, materials.gold);
    badge.position.set(0, 0.42, 0.37);

    this.headGroup.add(cap, brim, badge);

    // Cute Eyes & Smile (Canvas texture or blocky geometry)
    const eyeGeo = new THREE.BoxGeometry(0.1, 0.12, 0.04);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1E120A });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.16, 0.02, 0.33);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.16, 0.02, 0.33);

    // Sparkle in eyes
    const eyeSparkleGeo = new THREE.BoxGeometry(0.04, 0.04, 0.05);
    const eyeSparkleMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const spL = new THREE.Mesh(eyeSparkleGeo, eyeSparkleMat);
    spL.position.set(-0.14, 0.05, 0.34);
    const spR = new THREE.Mesh(eyeSparkleGeo, eyeSparkleMat);
    spR.position.set(0.18, 0.05, 0.34);

    // Friendly smile
    const smileGeo = new THREE.BoxGeometry(0.2, 0.04, 0.04);
    const smile = new THREE.Mesh(smileGeo, eyeMat);
    smile.position.set(0, -0.16, 0.33);

    this.headGroup.add(eyeL, eyeR, spL, spR, smile);
    this.bodyGroup.add(this.headGroup);

    // 5. Left Arm Group (Pivoted at shoulder)
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.55, 0.9, 0);

    const armGeo = new THREE.BoxGeometry(0.25, 0.85, 0.28);
    const lArmMesh = new THREE.Mesh(armGeo, shirtMat);
    lArmMesh.position.y = -0.35;
    lArmMesh.castShadow = true;

    const lHand = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.24), skinMat);
    lHand.position.y = -0.8;
    this.leftArmGroup.add(lArmMesh, lHand);
    this.bodyGroup.add(this.leftArmGroup);

    // 6. Right Arm Group
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.55, 0.9, 0);

    const rArmMesh = new THREE.Mesh(armGeo, shirtMat);
    rArmMesh.position.y = -0.35;
    rArmMesh.castShadow = true;

    const rHand = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.24), skinMat);
    rHand.position.y = -0.8;
    this.rightArmGroup.add(rArmMesh, rHand);
    this.bodyGroup.add(this.rightArmGroup);

    // 7. Left Leg Group (Pivoted at hip)
    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.22, 0, 0);

    const legGeo = new THREE.BoxGeometry(0.32, 0.65, 0.34);
    const lLegMesh = new THREE.Mesh(legGeo, shortsMat);
    lLegMesh.position.y = -0.32;
    lLegMesh.castShadow = true;

    const lBoot = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.35, 0.44), bootMat);
    lBoot.position.set(0, -0.75, 0.05);
    lBoot.castShadow = true;

    this.leftLegGroup.add(lLegMesh, lBoot);
    this.bodyGroup.add(this.leftLegGroup);

    // 8. Right Leg Group
    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.22, 0, 0);

    const rLegMesh = new THREE.Mesh(legGeo, shortsMat);
    rLegMesh.position.y = -0.32;
    rLegMesh.castShadow = true;

    const rBoot = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.35, 0.44), bootMat);
    rBoot.position.set(0, -0.75, 0.05);
    rBoot.castShadow = true;

    this.rightLegGroup.add(rLegMesh, rBoot);
    this.bodyGroup.add(this.rightLegGroup);

    // Position setup
    this.mesh.position.copy(this.position);
  }

  // Trigger celebration animation (when crystal collected)
  public celebrate() {
    this.animState = 'celebrate';
    this.celebrateTimer = 2.2;
    this.velocity.y = 8.5; // Little happy hop
    this.isGrounded = false;
  }

  // Update position, physics, and procedural limb animations
  public update(
    delta: number,
    inputMove: { x: number; z: number },
    isJumping: boolean,
    cameraYaw: number,
    isFrozen: boolean = false
  ) {
    // If celebrate timer is active
    if (this.celebrateTimer > 0) {
      this.celebrateTimer -= delta;
      if (this.celebrateTimer <= 0) {
        this.animState = 'idle';
      }
    }

    if (isFrozen) {
      // Stand still in idle when house modal is open
      this.animState = 'idle';
      this.velocity.set(0, 0, 0);
      this.applyAnimations(delta);
      return;
    }

    // 1. Movement Vector based on camera direction
    const speed = this.speedTier === 'perlahan' ? 8.5 : this.speedTier === 'pantas' ? 16.0 : 12.0;
    const moveLen = Math.sqrt(inputMove.x * inputMove.x + inputMove.z * inputMove.z);

    if (moveLen > 0.05) {
      // Calculate world movement direction relative to camera yaw
      const forwardX = -Math.sin(cameraYaw);
      const forwardZ = -Math.cos(cameraYaw);
      const rightX = Math.cos(cameraYaw);
      const rightZ = -Math.sin(cameraYaw);

      const dirX = forwardX * inputMove.z + rightX * inputMove.x;
      const dirZ = forwardZ * inputMove.z + rightZ * inputMove.x;

      this.velocity.x = dirX * speed;
      this.velocity.z = dirZ * speed;

      // Smoothly rotate character to face travel direction
      const targetRotation = Math.atan2(dirX, dirZ);
      // Angular lerp
      let diff = targetRotation - this.rotationY;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.rotationY += diff * Math.min(1.0, delta * 14);

      if (this.animState !== 'celebrate' && this.isGrounded) {
        this.animState = moveLen > 0.8 ? 'run' : 'walk';
      }
    } else {
      // Decelerate
      this.velocity.x *= 0.65;
      this.velocity.z *= 0.65;
      if (this.animState !== 'celebrate' && this.isGrounded) {
        this.animState = 'idle';
      }
    }

    // 2. Jump & Gravity
    const gravity = 26.0;
    if (isJumping && this.isGrounded && this.animState !== 'celebrate') {
      this.velocity.y = 11.5;
      this.isGrounded = false;
      this.animState = 'jump';
    }

    if (!this.isGrounded) {
      this.velocity.y -= gravity * delta;
      if (this.animState !== 'celebrate') {
        this.animState = 'jump';
      }
    }

    // 3. Apply displacement
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.position.z += this.velocity.z * delta;

    // House & Landmark Colliders
    const houseColliders = [
      { x: -28, z: -22, radius: 3.2 },
      { x: 24, z: -26, radius: 3.2 },
      { x: 34, z: 10, radius: 3.2 },
      { x: 18, z: 30, radius: 3.2 },
      { x: -22, z: 26, radius: 3.4 },
      { x: -34, z: 2, radius: 3.2 },
      { x: -7.5, z: -6.5, radius: 3.0 }, // Adventure Watchtower
      { x: 0, z: 0, radius: 2.4 },       // Central Crystal plinth
    ];

    for (const hc of houseColliders) {
      const dx = this.position.x - hc.x;
      const dz = this.position.z - hc.z;
      const dist = Math.hypot(dx, dz);
      if (dist < hc.radius && dist > 0.001) {
        const push = hc.radius - dist;
        this.position.x += (dx / dist) * push;
        this.position.z += (dz / dist) * push;
      }
    }

    // 4. Ground Clamping / Heightmap Simulation
    const groundY = this.computeGroundHeight(this.position.x, this.position.z);

    if (this.position.y <= groundY) {
      this.position.y = groundY;
      this.velocity.y = 0;
      this.isGrounded = true;
      if (this.animState === 'jump') {
        this.animState = moveLen > 0.05 ? 'walk' : 'idle';
      }
    } else if (this.position.y > groundY + 0.15) {
      this.isGrounded = false;
    }

    // 5. Water Fall-off Rescue
    // If player falls off into the river below -4, softly teleport back to central plaza
    if (this.position.y < -3.5) {
      this.position.set(0, 3.8, 3.5);
      this.velocity.set(0, 0, 0);
      this.isGrounded = true;
      this.animState = 'idle';
    }

    // Boundary limit
    const distFromCenter = Math.sqrt(this.position.x * this.position.x + this.position.z * this.position.z);
    if (distFromCenter > 52) {
      const scale = 52 / distFromCenter;
      this.position.x *= scale;
      this.position.z *= scale;
    }

    // Apply to mesh
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.rotationY;

    // 6. Procedural limb animations
    this.applyAnimations(delta);
  }

  // Compute terrain ground elevation for walking on islands & bridges
  private computeGroundHeight(x: number, z: number): number {
    // 1. Central Plaza & Main Island
    const distCentral = Math.sqrt(x * x + z * z);
    if (distCentral <= 13.5) {
      return 3.65;
    }

    // 2. The 6 Floating Island platforms
    // Island 1: [-28, 4, -22]
    if (Math.hypot(x - (-28), z - (-22)) <= 9.0) return 4.0;
    // Island 2: [24, 7, -26]
    if (Math.hypot(x - 24, z - (-26)) <= 9.0) return 7.0;
    // Island 3: [34, 3, 10]
    if (Math.hypot(x - 34, z - 10) <= 9.0) return 3.0;
    // Island 4: [18, 5, 30]
    if (Math.hypot(x - 18, z - 30) <= 9.0) return 5.0;
    // Island 5: [-22, 6, 26]
    if (Math.hypot(x - (-22), z - 26) <= 9.0) return 6.0;
    // Island 6: [-34, 8, 2]
    if (Math.hypot(x - (-34), z - 2) <= 9.0) return 8.0;

    // 3. Bridges connecting central island to islands
    // Check if player is on any of the 6 bridge lines
    const bridgeTargets = [
      { x: -28, y: 4.0, z: -22 },
      { x: 24, y: 7.0, z: -26 },
      { x: 34, y: 3.0, z: 10 },
      { x: 18, y: 5.0, z: 30 },
      { x: -22, y: 6.0, z: 26 },
      { x: -34, y: 8.0, z: 2 },
    ];

    for (const b of bridgeTargets) {
      // Line from (0, 3.65, 0) to (b.x, b.y, b.z)
      const bx = b.x;
      const bz = b.z;
      const len = Math.hypot(bx, bz);
      // Project (x, z) onto line
      const dot = (x * bx + z * bz) / (len * len);
      if (dot >= 0.2 && dot <= 1.0) {
        const projX = dot * bx;
        const projZ = dot * bz;
        const distToBridge = Math.hypot(x - projX, z - projZ);
        if (distToBridge <= 2.8) {
          // On bridge!
          const interpY = 3.65 + (b.y - 3.65) * dot;
          return interpY;
        }
      }
    }

    // In water / off edge
    return -6.0;
  }

  // Procedural limb animation cycles
  private applyAnimations(delta: number) {
    this.animTimer += delta;

    switch (this.animState) {
      case 'idle': {
        // Gentle breathing bob
        const breath = Math.sin(this.animTimer * 2.5);
        this.bodyGroup.position.y = 1.0 + breath * 0.03;
        this.torsoMesh.rotation.x = breath * 0.02;
        this.leftArmGroup.rotation.x = breath * 0.04;
        this.rightArmGroup.rotation.x = -breath * 0.04;
        this.leftArmGroup.rotation.z = 0.08;
        this.rightArmGroup.rotation.z = -0.08;
        this.leftLegGroup.rotation.x = 0;
        this.rightLegGroup.rotation.x = 0;
        this.headGroup.rotation.y = Math.sin(this.animTimer * 1.2) * 0.06;
        break;
      }

      case 'walk':
      case 'run': {
        const speedMultiplier = this.animState === 'run' ? 12.0 : 8.5;
        const cycle = this.animTimer * speedMultiplier;
        const swing = Math.sin(cycle);

        // Body bobbing up and down with steps
        this.bodyGroup.position.y = 1.0 + Math.abs(Math.sin(cycle)) * 0.08;
        this.torsoMesh.rotation.x = this.animState === 'run' ? 0.12 : 0.06; // slight forward lean

        // Arms swing opposite to legs
        const armSwingAmp = this.animState === 'run' ? 0.75 : 0.45;
        this.leftArmGroup.rotation.x = -swing * armSwingAmp;
        this.rightArmGroup.rotation.x = swing * armSwingAmp;
        this.leftArmGroup.rotation.z = 0.1;
        this.rightArmGroup.rotation.z = -0.1;

        // Legs swing
        const legSwingAmp = this.animState === 'run' ? 0.8 : 0.55;
        this.leftLegGroup.rotation.x = swing * legSwingAmp;
        this.rightLegGroup.rotation.x = -swing * legSwingAmp;

        // Slight backpack bounce
        this.backpackGroup.position.y = 0.55 + Math.sin(cycle * 2) * 0.03;
        this.headGroup.rotation.y = 0;
        break;
      }

      case 'jump': {
        // Arms up in air
        this.leftArmGroup.rotation.x = -2.2;
        this.rightArmGroup.rotation.x = -2.2;
        this.leftArmGroup.rotation.z = 0.3;
        this.rightArmGroup.rotation.z = -0.3;

        // Legs slightly tucked
        this.leftLegGroup.rotation.x = 0.35;
        this.rightLegGroup.rotation.x = -0.2;
        this.torsoMesh.rotation.x = 0.08;
        break;
      }

      case 'celebrate': {
        // Cheerful jump and spin
        const spin = this.animTimer * 10;
        this.mesh.rotation.y = spin;

        // Arms raised in victory
        const wave = Math.sin(this.animTimer * 12);
        this.leftArmGroup.rotation.x = -2.6 + wave * 0.2;
        this.rightArmGroup.rotation.x = -2.6 - wave * 0.2;
        this.leftArmGroup.rotation.z = 0.4;
        this.rightArmGroup.rotation.z = -0.4;

        this.leftLegGroup.rotation.x = Math.sin(this.animTimer * 8) * 0.4;
        this.rightLegGroup.rotation.x = -Math.sin(this.animTimer * 8) * 0.4;
        this.headGroup.rotation.x = -0.2; // Look up
        break;
      }
    }
  }
}
