// The hero's 3D scene: the This Month screen on a phone that leans toward the
// pointer, inside a gold dial — the metre in the name — whose needle settles
// and keeps quivering like a live reading. Coins for the lira, the dollar, the
// euro and gold turn around it, and gold dust drifts down behind.
// If WebGL is missing the plain screenshot in the page stays as it is.

import * as THREE from './three.module.min.js';

const GOLD = 0xe9b64c;
const TRACK = 0x56442f;
/** The dial spans 270°, open at the bottom, and is read clockwise. */
const SWEEP = Math.PI * 1.5;
const DIAL_START = Math.PI * 1.25;
/** Where the needle settles, as a share of the dial. */
const READING = 0.68;
const TICKS = 28;

/** x, y, z, size and face of each coin, kept clear of the screen. */
const COINS = [
  [-2.55, 1.95, 0.5, 1.0, '₺'],
  [2.5, 2.45, -0.5, 0.85, '$'],
  [2.75, -1.35, 0.7, 1.1, '€'],
  [-2.85, -1.85, -0.3, 0.9, 'gr'],
  [-1.85, 3.45, -1.4, 0.7, '$'],
  [1.85, -3.35, -1.0, 0.75, '₺'],
  [3.55, 0.65, -2.0, 0.7, 'gr'],
  [-3.55, 0.25, -1.8, 0.65, '€'],
];

const art = document.querySelector('.hero .art');
const canvas = art && art.querySelector('canvas.scene');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas) {
  try {
    start();
  } catch (error) {
    console.warn('3D hero unavailable', error);
  }
}

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** A flat shape whose texture spans its whole bounding box. */
function screenGeometry(w, h, r) {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, r), 24);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  }
  return g;
}

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.6)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function glareTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 512;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 256, 512);
  grad.addColorStop(0, 'rgba(255,255,255,0.14)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.03)');
  grad.addColorStop(0.36, 'rgba(255,255,255,0)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);
  return new THREE.CanvasTexture(c);
}

/**
 * A warm room for the metal to reflect: without one, metallic gold renders
 * nearly black. Light above, espresso below, two soft windows for glints.
 */
function warmEnvironment(renderer) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, '#fff4dc');
  grad.addColorStop(0.4, '#e9b64c');
  grad.addColorStop(0.6, '#3a2a17');
  grad.addColorStop(1, '#0f0c09');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = 'rgba(255, 251, 240, 0.95)';
  ctx.beginPath();
  ctx.ellipse(70, 34, 30, 12, 0, 0, Math.PI * 2);
  ctx.ellipse(190, 48, 18, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  const texture = new THREE.CanvasTexture(c);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(texture).texture;
  texture.dispose();
  pmrem.dispose();
  return env;
}

/** A coin's face: struck gold, a raised rim, the symbol in the headline face. */
function drawCoinFace(ctx, symbol) {
  const S = 256;
  const grad = ctx.createRadialGradient(S * 0.38, S * 0.34, 10, S / 2, S / 2, S / 2);
  grad.addColorStop(0, '#fbe2a0');
  grad.addColorStop(0.55, '#e9b64c');
  grad.addColorStop(1, '#a8761f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = 'rgba(110, 72, 14, 0.55)';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 240, 200, 0.35)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#7a5212';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `800 ${symbol.length > 1 ? 104 : 136}px Headline, "DM Sans", sans-serif`;
  ctx.fillText(symbol, S / 2, S / 2 + 6);
}

function coinTexture(symbol) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  drawCoinFace(ctx, symbol);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  // Drawn again once the headline face has loaded, if it had not yet.
  document.fonts?.load('800 120px Headline').then(() => {
    drawCoinFace(ctx, symbol);
    texture.needsUpdate = true;
  });
  return texture;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
}

function easeOutBack(t) {
  const x = Math.min(Math.max(t, 0), 1);
  const c = 1.6;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
}

function start() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Stands at zero until the screen's image arrives, so the intro is seen.
  const clock = new THREE.Clock(false);

  const scene = new THREE.Scene();
  scene.environment = warmEnvironment(renderer);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xfff1d6, 1.6);
  key.position.set(4, 6, 8);
  scene.add(key);
  const rim = new THREE.PointLight(GOLD, 40, 20);
  rim.position.set(-4, 2, 2);
  scene.add(rim);

  // The phone.
  const phone = new THREE.Group();
  const W = 2.9;
  const H = 6.1;
  const bodyGeo = new THREE.ExtrudeGeometry(roundedRect(W, H, 0.46), {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.05,
    bevelSegments: 4,
    curveSegments: 24,
  });
  bodyGeo.computeBoundingBox();
  bodyGeo.translate(0, 0, -bodyGeo.boundingBox.max.z);
  phone.add(
    new THREE.Mesh(
      bodyGeo,
      new THREE.MeshStandardMaterial({ color: 0x0b0907, metalness: 0.6, roughness: 0.32 }),
    ),
  );

  const texture = new THREE.TextureLoader().load(art.dataset.screen, () => {
    art.classList.add('is-3d');
    clock.start();
    // Without motion the scene is drawn once, already settled.
    still ? frame() : render();
  });
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const screenW = 2.68;
  const screenH = screenW * (2868 / 1320);
  const screen = new THREE.Mesh(
    screenGeometry(screenW, screenH, 0.36),
    new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
  );
  screen.position.z = 0.004;
  phone.add(screen);

  const glare = new THREE.Mesh(
    screenGeometry(screenW, screenH, 0.36),
    new THREE.MeshBasicMaterial({ map: glareTexture(), transparent: true, depthWrite: false }),
  );
  glare.position.z = 0.008;
  phone.add(glare);
  scene.add(phone);

  // The dial, behind the phone: a track, the arc of the reading, a bead at
  // its end and graduations around the outside that light up as it passes.
  const dial = new THREE.Group();
  dial.position.z = -1.6;
  const R = 3.75;
  const TUBE = 0.1;
  const track = new THREE.Mesh(
    new THREE.TorusGeometry(R, TUBE * 0.8, 12, 160, SWEEP),
    new THREE.MeshBasicMaterial({ color: TRACK, transparent: true, opacity: 0.9 }),
  );
  track.rotation.z = DIAL_START - SWEEP;
  dial.add(track);

  const arc = new THREE.Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshBasicMaterial({ color: GOLD, toneMapped: false }),
  );
  dial.add(arc);
  const bead = new THREE.Mesh(
    new THREE.SphereGeometry(TUBE * 2.2, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0xfff1d0 }),
  );
  dial.add(bead);

  const ticks = [];
  for (let i = 0; i < TICKS; i++) {
    const major = i % 9 === 0 || i === TICKS - 1;
    const length = major ? 0.42 : 0.2;
    const tick = new THREE.Mesh(
      new THREE.BoxGeometry(major ? 0.07 : 0.045, length, 0.02),
      new THREE.MeshBasicMaterial({ color: TRACK }),
    );
    const a = DIAL_START - (i / (TICKS - 1)) * SWEEP;
    const r = R + 0.32 + length / 2;
    tick.position.set(r * Math.cos(a), r * Math.sin(a), 0);
    tick.rotation.z = a - Math.PI / 2;
    tick.userData.share = i / (TICKS - 1);
    ticks.push(tick);
    dial.add(tick);
  }

  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: dotTexture(),
      color: GOLD,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  halo.scale.set(11, 11, 1);
  halo.position.z = -0.5;
  dial.add(halo);
  scene.add(dial);

  const lit = new THREE.Color(GOLD);
  const unlit = new THREE.Color(TRACK);
  let shown = -1;
  function setReading(share) {
    if (Math.abs(share - shown) < 0.0015) return;
    shown = share;
    const length = Math.max(share, 0.001) * SWEEP;
    arc.geometry.dispose();
    arc.geometry = new THREE.TorusGeometry(R, TUBE, 12, 160, length);
    // A torus arc grows counterclockwise; start it where this reading ends.
    arc.rotation.z = DIAL_START - length;
    const a = DIAL_START - length;
    bead.position.set(R * Math.cos(a), R * Math.sin(a), 0);
    for (const tick of ticks) {
      tick.material.color.copy(tick.userData.share <= share + 0.001 ? lit : unlit);
    }
  }

  // The coins.
  const coinGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.09, 48);
  const edge = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.95, roughness: 0.3 });
  const faces = {};
  const coins = COINS.map(([x, y, z, size, symbol], i) => {
    faces[symbol] ??= new THREE.MeshStandardMaterial({
      map: coinTexture(symbol),
      metalness: 0.55,
      roughness: 0.38,
    });
    const coin = new THREE.Mesh(coinGeo, [edge, faces[symbol], faces[symbol]]);
    const holder = new THREE.Group();
    holder.add(coin);
    // Face to the camera; the holder turns it about its upright axis.
    coin.rotation.x = Math.PI / 2;
    holder.position.set(x, y, z);
    holder.userData = {
      home: new THREE.Vector3(x, y, z),
      size,
      turn: (i % 2 ? -1 : 1) * (0.35 + (i % 3) * 0.12),
      phase: i * 1.7,
      delay: 0.5 + i * 0.09,
    };
    scene.add(holder);
    return holder;
  });

  // Gold dust, settling.
  const COUNT = 200;
  const dust = new Float32Array(COUNT * 3);
  const speed = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    dust[i * 3] = (Math.random() - 0.5) * 14;
    dust[i * 3 + 1] = (Math.random() - 0.5) * 11;
    dust[i * 3 + 2] = -5 + Math.random() * 5;
    speed[i] = 0.06 + Math.random() * 0.2;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3));
  const points = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      map: dotTexture(),
      color: GOLD,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(points);

  // Size: keep the dial and the coins in view whatever the box's shape.
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fitH = 9.4;
    const fitW = 9.4;
    camera.position.z = Math.max(fitH / 2 / half, fitW / 2 / (half * camera.aspect)) - 1.2;
    camera.updateProjectionMatrix();
    render();
  }

  // Pointer and scroll, eased.
  const target = { x: 0, y: 0 };
  const now = { x: 0, y: 0 };
  let pointerSeen = false;
  addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      pointerSeen = true;
      target.x = e.clientX / innerWidth - 0.5;
      target.y = e.clientY / innerHeight - 0.5;
    },
    { passive: true },
  );

  let lastT = 0;
  let visible = true;
  let running = false;

  function frame() {
    const t = clock.getElapsedTime();
    const intro = still ? 1 : easeOutCubic(t / 1.6);

    // The needle sweeps up, overshoots a touch, then quivers on its reading.
    const settle = still ? 1 : easeOutBack((t - 0.3) / 2.2);
    const quiver = still ? 0 : (Math.sin(t * 0.7) * 0.02 + Math.sin(t * 2.3) * 0.006) * easeOutCubic((t - 2.5) / 1.5);
    setReading(Math.min(READING * settle + quiver, 1));

    if (!pointerSeen && !still) {
      target.x = Math.sin(t * 0.45) * 0.22;
      target.y = Math.sin(t * 0.32) * 0.12;
    }
    now.x += (target.x - now.x) * 0.06;
    now.y += (target.y - now.y) * 0.06;

    const rect = art.getBoundingClientRect();
    const scrolled = Math.min(Math.max(-rect.top / rect.height, 0), 1);

    phone.rotation.y = -0.3 + now.x * 0.7 + (1 - intro) * 0.6;
    phone.rotation.x = 0.06 + now.y * 0.45 + scrolled * 0.35;
    phone.rotation.z = 0.04 - now.x * 0.06;
    phone.position.y = (1 - intro) * -1.4 + (still ? 0 : Math.sin(t * 1.1) * 0.08);
    phone.position.x = 0.1;

    dial.rotation.y = now.x * 0.35;
    dial.rotation.x = now.y * 0.25 + scrolled * 0.2;

    // Coins pop in one by one, turn, bob, and drift apart as the page scrolls.
    for (const coin of coins) {
      const d = coin.userData;
      const grow = still ? 1 : easeOutBack((t - d.delay) / 0.9);
      coin.scale.setScalar(Math.max(grow, 0.0001) * d.size);
      const depth = 1 + (d.home.z + 2) * 0.25;
      const spread = 1 + scrolled * 0.35;
      coin.position.set(
        d.home.x * spread + now.x * 0.6 * depth,
        d.home.y * spread - now.y * 0.4 * depth + (still ? 0 : Math.sin(t * 0.9 + d.phase) * 0.12),
        d.home.z,
      );
      coin.rotation.y = still ? 0.35 * d.turn : t * d.turn + d.phase;
      coin.rotation.x = 0.25 * Math.sin(t * 0.5 + d.phase) + now.y * 0.3;
    }

    const dt = Math.min(t - lastT, 0.05);
    lastT = t;
    if (!still) {
      const p = dustGeo.attributes.position;
      for (let i = 0; i < COUNT; i++) {
        let y = p.getY(i) - speed[i] * dt;
        if (y < -5.5) y = 5.5;
        p.setY(i, y);
      }
      p.needsUpdate = true;
      points.rotation.y = now.x * 0.2;
    }

    render();
    if (running) requestAnimationFrame(frame);
  }

  function render() {
    renderer.render(scene, camera);
  }

  function play() {
    if (still) {
      frame();
      return;
    }
    if (running || !visible || document.hidden) return;
    running = true;
    lastT = clock.getElapsedTime();
    requestAnimationFrame(frame);
  }

  function pause() {
    running = false;
  }

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? play() : pause();
  }).observe(art);
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));

  resize();
  setReading(0);
  for (const coin of coins) coin.scale.setScalar(0.0001);
  play();
}
