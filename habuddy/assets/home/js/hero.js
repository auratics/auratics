// The hero's 3D scene: the week screen on a phone that leans toward the
// pointer, with the habit's check-ins around it. Photo squares, like the
// app's day cells, ride two tilted orbits; a few are dashed bells still
// waiting on someone, and they ring. Friends' faces drift in close, and soft
// light rises behind. Without WebGL the plain screenshot stays as it is.

import * as THREE from './three.module.min.js';

const BASE = 'assets/home/img/';
const MOVES = [1, 2, 3, 4, 5, 7, 8, 9, 12, 14, 15, 16, 17, 18, 19, 20];
const FACES = ['jessi', 'zoe', 'noah', 'ava', 'ella'];
const SKY = 0xa8ccE6;
const CELL = '#22364A';

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

function screenGeometry(w, h, r) {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, r), 24);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  }
  return g;
}

function canvasTexture(size, draw) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  draw(ctx, size, texture);
  return texture;
}

function roundedPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** A day cell: the navy square with the day's photo in a circle. */
function photoCell(src) {
  return canvasTexture(256, (ctx, S, texture) => {
    roundedPath(ctx, 8, 8, S - 16, S - 16, 54);
    ctx.fillStyle = CELL;
    ctx.fill();
    const img = new Image();
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(S / 2, S / 2, S * 0.37, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, S * 0.13, S * 0.13, S * 0.74, S * 0.74);
      ctx.restore();
      texture.needsUpdate = true;
    };
    img.src = src;
  });
}

/** A day still waiting: dashed outline and a bell. */
function bellCell() {
  return canvasTexture(256, (ctx, S) => {
    ctx.setLineDash([22, 16]);
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#7FB3DA';
    roundedPath(ctx, 14, 14, S - 28, S - 28, 50);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 9;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.strokeStyle = '#A8CCE6';
    ctx.beginPath();
    ctx.moveTo(S * 0.34, S * 0.62);
    ctx.lineTo(S * 0.38, S * 0.56);
    ctx.lineTo(S * 0.38, S * 0.44);
    ctx.arc(S / 2, S * 0.44, S * 0.12, Math.PI, 0);
    ctx.lineTo(S * 0.62, S * 0.56);
    ctx.lineTo(S * 0.66, S * 0.62);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(S / 2, S * 0.68, S * 0.045, 0, Math.PI * 2);
    ctx.stroke();
  });
}

/** A friend's face in a ring. */
function faceTexture(src) {
  return canvasTexture(256, (ctx, S, texture) => {
    const img = new Image();
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(S / 2, S / 2, S / 2 - 14, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 14, 14, S - 28, S - 28);
      ctx.restore();
      ctx.lineWidth = 8;
      ctx.strokeStyle = 'rgba(168,204,230,0.9)';
      ctx.beginPath();
      ctx.arc(S / 2, S / 2, S / 2 - 8, 0, Math.PI * 2);
      ctx.stroke();
      texture.needsUpdate = true;
    };
    img.src = src;
  });
}

function dotTexture() {
  return canvasTexture(64, (ctx) => {
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.5)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  });
}

function glareTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 512;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 256, 512);
  grad.addColorStop(0, 'rgba(255,255,255,0.12)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.03)');
  grad.addColorStop(0.36, 'rgba(255,255,255,0)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);
  return new THREE.CanvasTexture(c);
}

const easeOutCubic = (t) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
function easeOutBack(t) {
  const x = Math.min(Math.max(t, 0), 1);
  const c = 1.6;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
}

function start() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const clock = new THREE.Clock(false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const key = new THREE.DirectionalLight(0xe6f1fa, 1.5);
  key.position.set(4, 6, 8);
  scene.add(key);
  const rim = new THREE.PointLight(SKY, 30, 20);
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
  phone.add(new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({ color: 0x070b10, metalness: 0.6, roughness: 0.3 })));

  const texture = new THREE.TextureLoader().load(art.dataset.screen, () => {
    art.classList.add('is-3d');
    clock.start();
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

  // A soft light behind it all.
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: dotTexture(), color: SKY, transparent: true, opacity: 0.16, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  halo.scale.set(12, 12, 1);
  halo.position.z = -3;
  scene.add(halo);

  // Day cells on two tilted orbits; every fifth one is a bell, still waiting.
  const cellGeo = new THREE.PlaneGeometry(1, 1);
  const bellTex = bellCell();
  const cells = [];
  const ORBITS = [
    { rx: 3.6, rz: 1.9, y: 0.9, tilt: 0.28, count: 9, speed: 0.16, size: 0.78 },
    { rx: 3.1, rz: 1.6, y: -1.4, tilt: -0.22, count: 8, speed: -0.12, size: 0.66 },
  ];
  let n = 0;
  ORBITS.forEach((orbit, o) => {
    for (let i = 0; i < orbit.count; i++) {
      const bell = n % 5 === 3;
      const material = new THREE.MeshBasicMaterial({
        map: bell ? bellTex : photoCell(BASE + `moves/move-${MOVES[n % MOVES.length]}.webp`),
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(cellGeo, material);
      mesh.userData = { orbit, angle: (i / orbit.count) * Math.PI * 2 + o * 0.4, bell, delay: 0.4 + n * 0.06, phase: n * 1.3 };
      scene.add(mesh);
      cells.push(mesh);
      n++;
    }
  });

  // Friends drifting close to the phone.
  const faces = FACES.map((name, i) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: faceTexture(BASE + `faces/${name}.webp`), transparent: true, depthWrite: false }));
    const a = (i / FACES.length) * Math.PI * 2 + 0.6;
    sprite.userData = { home: new THREE.Vector3(Math.cos(a) * 2.35, Math.sin(a) * 3.1, 0.9 + (i % 2) * 0.5), phase: i * 1.9, delay: 1 + i * 0.12 };
    scene.add(sprite);
    return sprite;
  });

  // Light rising, like warm breath on a cold morning.
  const COUNT = 160;
  const motes = new Float32Array(COUNT * 3);
  const rise = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    motes[i * 3] = (Math.random() - 0.5) * 14;
    motes[i * 3 + 1] = (Math.random() - 0.5) * 11;
    motes[i * 3 + 2] = -5 + Math.random() * 4;
    rise[i] = 0.05 + Math.random() * 0.18;
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motes, 3));
  const points = new THREE.Points(
    moteGeo,
    new THREE.PointsMaterial({ map: dotTexture(), color: SKY, size: 0.08, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  scene.add(points);

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fit = 8.4;
    camera.position.z = Math.max(fit / 2 / half, fit / 2 / (half * camera.aspect)) - 1;
    camera.updateProjectionMatrix();
    render();
  }

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
    if (!pointerSeen && !still) {
      target.x = Math.sin(t * 0.45) * 0.22;
      target.y = Math.sin(t * 0.32) * 0.12;
    }
    now.x += (target.x - now.x) * 0.06;
    now.y += (target.y - now.y) * 0.06;

    const rect = art.getBoundingClientRect();
    const scrolled = Math.min(Math.max(-rect.top / rect.height, 0), 1);

    phone.rotation.y = -0.28 + now.x * 0.7 + (1 - intro) * 0.6;
    phone.rotation.x = 0.06 + now.y * 0.45 + scrolled * 0.35;
    phone.rotation.z = 0.04 - now.x * 0.06;
    phone.position.y = (1 - intro) * -1.4 + (still ? 0 : Math.sin(t * 1.1) * 0.08);

    for (const cell of cells) {
      const d = cell.userData;
      const o = d.orbit;
      const a = d.angle + (still ? 0 : t * o.speed);
      const x = Math.cos(a) * o.rx * (1 + scrolled * 0.3);
      const z = Math.sin(a) * o.rz;
      const y = o.y + z * o.tilt + (still ? 0 : Math.sin(t * 0.9 + d.phase) * 0.08);
      cell.position.set(x + now.x * 0.5, y - now.y * 0.35, z);
      const grow = still ? 1 : easeOutBack((t - d.delay) / 0.8);
      // Nearer cells are larger; the ones behind fade a little.
      const depth = 0.85 + (z + o.rz) / (2 * o.rz) * 0.3;
      cell.scale.setScalar(Math.max(grow, 0.0001) * o.size * depth);
      cell.material.opacity = 0.55 + (z + o.rz) / (2 * o.rz) * 0.45;
      cell.rotation.set(now.y * 0.3, -a * 0.12 + now.x * 0.4, 0);
      // A bell rings now and then.
      if (d.bell && !still) {
        const ring = Math.max(0, Math.sin(t * 1.4 + d.phase));
        cell.rotation.z = Math.sin(t * 24) * 0.18 * Math.pow(ring, 8);
      }
    }

    for (const face of faces) {
      const d = face.userData;
      const grow = still ? 1 : easeOutBack((t - d.delay) / 0.9);
      face.scale.setScalar(Math.max(grow, 0.0001) * 0.9);
      face.position.set(
        d.home.x + now.x * 0.9,
        d.home.y - now.y * 0.6 + (still ? 0 : Math.sin(t * 0.8 + d.phase) * 0.14),
        d.home.z,
      );
    }

    const dt = Math.min(t - lastT, 0.05);
    lastT = t;
    if (!still) {
      const p = moteGeo.attributes.position;
      for (let i = 0; i < COUNT; i++) {
        let y = p.getY(i) + rise[i] * dt;
        if (y > 5.5) y = -5.5;
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
  for (const cell of cells) cell.scale.setScalar(0.0001);
  for (const face of faces) face.scale.setScalar(0.0001);
  play();
}
