import * as THREE from 'three';
import {
  createPlankTexture,
  createStonePaverTexture,
  createGrassBlockSideTexture,
  createCartoonWaterTexture,
} from '../utils/textures';

// Master Palette Constants
export const PALETTE = {
  HOT_PINK: 0xF5008F,
  MATCHA_GREEN: 0x9DBB69,
  STRAWBERRY_PINK: 0xF4A6B8,
  STRAWBERRY_RED: 0xE87991,
  CREAM: 0xFFF4E6,
  SOFT_WHITE: 0xFFFCF8,
  DEEP_GREEN: 0x526B4C,
  WOOD_BROWN: 0x7A4E2D,
  WOOD_DARK: 0x4D2F17,
  WOOD_LIGHT: 0xA67246,
  DIRT_LOAM: 0x6E4935,
  WATER_TEAL: 0x64B5C6,
  WATER_FOAM: 0xEEFFFF,
  GOLD_ACCENT: 0xF4C542,
  ROPE_COLOR: 0xD8B888,
};

export class MaterialLibrary {
  public plankTexture = createPlankTexture();
  public stoneTexture = createStonePaverTexture();
  public grassSideTexture = createGrassBlockSideTexture();
  public waterTexture = createCartoonWaterTexture();

  // Grass Tops
  public matchaGrass = new THREE.MeshStandardMaterial({
    color: PALETTE.MATCHA_GREEN,
    roughness: 0.85,
    metalness: 0.05,
    flatShading: true,
  });

  public deepGreenGrass = new THREE.MeshStandardMaterial({
    color: PALETTE.DEEP_GREEN,
    roughness: 0.85,
    metalness: 0.05,
    flatShading: true,
  });

  // Dirt & Cliff rock
  public dirtBlock = new THREE.MeshStandardMaterial({
    color: PALETTE.DIRT_LOAM,
    roughness: 0.95,
    metalness: 0.0,
    flatShading: true,
  });

  public cliffRock = new THREE.MeshStandardMaterial({
    color: 0x826754,
    roughness: 0.9,
    metalness: 0.05,
    flatShading: true,
  });

  // Wood Materials
  public woodPlank = new THREE.MeshStandardMaterial({
    map: this.plankTexture,
    color: PALETTE.WOOD_LIGHT,
    roughness: 0.7,
    metalness: 0.05,
  });

  public woodDark = new THREE.MeshStandardMaterial({
    color: PALETTE.WOOD_DARK,
    roughness: 0.8,
    metalness: 0.05,
  });

  public woodRope = new THREE.MeshStandardMaterial({
    color: PALETTE.ROPE_COLOR,
    roughness: 0.9,
    metalness: 0.0,
  });

  // Stone & Pathways
  public stonePaver = new THREE.MeshStandardMaterial({
    map: this.stoneTexture,
    color: PALETTE.CREAM,
    roughness: 0.75,
    metalness: 0.05,
  });

  public whiteStone = new THREE.MeshStandardMaterial({
    color: PALETTE.SOFT_WHITE,
    roughness: 0.6,
    metalness: 0.1,
    flatShading: true,
  });

  // Roof & Accent
  public strawberryRoof = new THREE.MeshStandardMaterial({
    color: PALETTE.STRAWBERRY_RED,
    roughness: 0.6,
    metalness: 0.1,
    flatShading: true,
  });

  public hotPinkAccent = new THREE.MeshStandardMaterial({
    color: PALETTE.HOT_PINK,
    roughness: 0.4,
    metalness: 0.15,
    flatShading: true,
  });

  // Foliage
  public leafMatcha = new THREE.MeshStandardMaterial({
    color: PALETTE.MATCHA_GREEN,
    roughness: 0.7,
    metalness: 0.05,
    flatShading: true,
  });

  public leafDeepGreen = new THREE.MeshStandardMaterial({
    color: PALETTE.DEEP_GREEN,
    roughness: 0.7,
    metalness: 0.05,
    flatShading: true,
  });

  public leafStrawberryPink = new THREE.MeshStandardMaterial({
    color: PALETTE.STRAWBERRY_PINK,
    roughness: 0.6,
    metalness: 0.05,
    flatShading: true,
  });

  public flowerPetal = new THREE.MeshStandardMaterial({
    color: PALETTE.STRAWBERRY_PINK,
    roughness: 0.5,
    metalness: 0.0,
  });

  public flowerCenter = new THREE.MeshStandardMaterial({
    color: PALETTE.HOT_PINK,
    roughness: 0.4,
    metalness: 0.2,
    emissive: PALETTE.HOT_PINK,
    emissiveIntensity: 0.3,
  });

  // Water & Waterfall
  public riverWater = new THREE.MeshPhysicalMaterial({
    color: PALETTE.WATER_TEAL,
    map: this.waterTexture,
    transparent: true,
    opacity: 0.88,
    roughness: 0.1,
    metalness: 0.1,
    reflectivity: 0.7,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
  });

  public waterfallFoam = new THREE.MeshStandardMaterial({
    color: PALETTE.WATER_FOAM,
    emissive: 0xCCEFFF,
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.85,
    roughness: 0.3,
  });

  // Glowing Crystals
  public giantCrystal = new THREE.MeshPhysicalMaterial({
    color: PALETTE.HOT_PINK,
    emissive: PALETTE.HOT_PINK,
    emissiveIntensity: 0.85,
    roughness: 0.15,
    metalness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.92,
  });

  public islandCrystal = new THREE.MeshPhysicalMaterial({
    color: PALETTE.STRAWBERRY_PINK,
    emissive: PALETTE.HOT_PINK,
    emissiveIntensity: 0.7,
    roughness: 0.2,
    metalness: 0.3,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.9,
  });

  // Portal Ring
  public portalRing = new THREE.MeshStandardMaterial({
    color: PALETTE.HOT_PINK,
    emissive: PALETTE.HOT_PINK,
    emissiveIntensity: 1.2,
    roughness: 0.2,
    metalness: 0.3,
    transparent: true,
    opacity: 0.85,
  });

  public portalVortex = new THREE.MeshBasicMaterial({
    color: PALETTE.STRAWBERRY_PINK,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
  });

  // Clouds
  public cloud = new THREE.MeshStandardMaterial({
    color: PALETTE.SOFT_WHITE,
    roughness: 0.95,
    metalness: 0.0,
    flatShading: true,
    transparent: true,
    opacity: 0.92,
  });

  // Gold Trophy / Accent
  public gold = new THREE.MeshStandardMaterial({
    color: PALETTE.GOLD_ACCENT,
    roughness: 0.3,
    metalness: 0.8,
  });

  public dispose() {
    this.plankTexture.dispose();
    this.stoneTexture.dispose();
    this.grassSideTexture.dispose();
    this.waterTexture.dispose();
  }
}
