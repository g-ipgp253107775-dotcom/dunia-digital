import * as THREE from 'three';

// Create a procedural wooden plank canvas texture
export function createPlankTexture(colorHex = '#8B5A2B', highlightHex = '#A06E3B', darkHex = '#5A3816'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 256, 256);

  // Draw 4 horizontal planks
  const plankHeight = 64;
  for (let i = 0; i < 4; i++) {
    const y = i * plankHeight;
    // Plank border shadow
    ctx.fillStyle = darkHex;
    ctx.fillRect(0, y, 256, 3);

    // Plank highlight top
    ctx.fillStyle = highlightHex;
    ctx.fillRect(0, y + 3, 256, 2);

    // Wood grain lines
    ctx.fillStyle = darkHex;
    ctx.globalAlpha = 0.25;
    for (let j = 0; j < 8; j++) {
      const lineY = y + 10 + j * 6;
      ctx.fillRect(0, lineY, 256, 1.5);
    }
    ctx.globalAlpha = 1.0;

    // Nails
    ctx.fillStyle = '#2A1808';
    ctx.beginPath();
    ctx.arc(16, y + plankHeight / 2, 3, 0, Math.PI * 2);
    ctx.arc(240, y + plankHeight / 2, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Create a cobblestone / stylized stone paving texture
export function createStonePaverTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#DDD1C1'; // mortar
  ctx.fillRect(0, 0, 256, 256);

  const stones = [
    { x: 10, y: 10, w: 100, h: 50, color: '#FFF4E6' },
    { x: 125, y: 10, w: 120, h: 50, color: '#EFE2D1' },
    { x: 10, y: 70, w: 70, h: 55, color: '#E8D9C5' },
    { x: 95, y: 70, w: 150, h: 55, color: '#FFF4E6' },
    { x: 10, y: 135, w: 110, h: 50, color: '#F2E5D4' },
    { x: 135, y: 135, w: 110, h: 50, color: '#FFF8F0' },
    { x: 10, y: 195, w: 130, h: 50, color: '#E6D7C3' },
    { x: 155, y: 195, w: 90, h: 50, color: '#FFF4E6' },
  ];

  stones.forEach((s) => {
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.roundRect(s.x, s.y, s.w, s.h, 6);
    ctx.fill();

    // subtle bevel highlight
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Create grass block side texture (Matcha Green top with stylized wavy edge over dirt)
export function createGrassBlockSideTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dirt base (rich warm brown/strawberry loam)
  ctx.fillStyle = '#6E4935';
  ctx.fillRect(0, 0, 128, 128);

  // Dirt speckles
  ctx.fillStyle = '#8A5D44';
  for (let i = 0; i < 20; i++) {
    const rx = (i * 27) % 120;
    const ry = 40 + ((i * 37) % 80);
    ctx.fillRect(rx, ry, 6, 6);
  }

  // Top matcha grass overhang with cartoon drippings
  ctx.fillStyle = '#9DBB69';
  ctx.fillRect(0, 0, 128, 28);

  const drips = [
    { x: 8, w: 12, h: 42 },
    { x: 28, w: 16, h: 36 },
    { x: 50, w: 14, h: 46 },
    { x: 72, w: 16, h: 38 },
    { x: 96, w: 18, h: 44 },
  ];

  drips.forEach((d) => {
    ctx.beginPath();
    ctx.roundRect(d.x, 20, d.w, d.h - 20, [0, 0, 4, 4]);
    ctx.fill();
  });

  // Top highlight rim
  ctx.fillStyle = '#B4D180';
  ctx.fillRect(0, 0, 128, 6);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Create stylized river water surface texture
export function createCartoonWaterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base clear teal-matcha water
  ctx.fillStyle = '#77C5D5';
  ctx.fillRect(0, 0, 512, 512);

  // Cartoon foam contours
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.55;

  const curves = [
    { y: 60, rx: 80 },
    { y: 150, rx: 120 },
    { y: 240, rx: 90 },
    { y: 340, rx: 140 },
    { y: 440, rx: 70 },
  ];

  curves.forEach((c) => {
    ctx.beginPath();
    ctx.moveTo(0, c.y);
    ctx.bezierCurveTo(120, c.y - 20, 240, c.y + 20, 360, c.y - 15);
    ctx.bezierCurveTo(420, c.y + 10, 480, c.y - 10, 512, c.y);
    ctx.stroke();

    // Floating foam bubbles
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(c.rx, c.y + 12, 5, 0, Math.PI * 2);
    ctx.arc(c.rx + 220, c.y - 10, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// Create a high-res wooden signboard canvas texture with crisp title and subtitle
export function createSignboardTexture(title: string, subtitle = 'ZON PORTAL ILMU'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Wood board background
  ctx.fillStyle = '#6E421E';
  ctx.beginPath();
  ctx.roundRect(8, 8, 496, 240, 16);
  ctx.fill();

  // Outer border with gold nails
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#3D200A';
  ctx.stroke();

  // Inner wooden panel
  ctx.fillStyle = '#FFF4E6'; // Cream board
  ctx.beginPath();
  ctx.roundRect(24, 24, 464, 208, 12);
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = '#E87991'; // Strawberry Red border accent
  ctx.stroke();

  // Corner bolts
  const corners = [
    [36, 36],
    [476, 36],
    [36, 220],
    [476, 220],
  ];
  ctx.fillStyle = '#8B5A2B';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Small badge on top
  ctx.fillStyle = '#F5008F'; // Hot pink badge
  ctx.beginPath();
  ctx.roundRect(140, 36, 232, 28, 8);
  ctx.fill();

  ctx.font = 'bold 15px Fredoka, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(subtitle, 256, 55);

  // Main Title text
  ctx.font = '900 28px Fredoka, Nunito, sans-serif';
  ctx.fillStyle = '#36233B';
  ctx.textAlign = 'center';

  // If title is long, break or fit
  if (title.length > 20) {
    const parts = title.split(' ');
    if (parts.length >= 2) {
      const mid = Math.ceil(parts.length / 2);
      const line1 = parts.slice(0, mid).join(' ');
      const line2 = parts.slice(mid).join(' ');
      ctx.fillText(line1, 256, 120);
      ctx.fillText(line2, 256, 160);
    } else {
      ctx.fillText(title, 256, 135);
    }
  } else {
    ctx.fillText(title, 256, 135);
  }

  // Small decorative stars
  ctx.font = '18px sans-serif';
  ctx.fillStyle = '#9DBB69';
  ctx.fillText('✦  TAHUN 5  ✦', 256, 195);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
