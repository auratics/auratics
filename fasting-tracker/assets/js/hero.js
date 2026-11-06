// The hero's 3D scene: the app's timer on a phone that leans toward the
// pointer, inside the app's progress ring, with a slow drift of mint dust.
// If WebGL is missing the plain screenshot in the page stays as it is.

import * as THREE from './three.module.min.js';

const MINT = 0x3cf2c8;
const TRACK = 0x1e2a47;
/** How far the ring fills: the screenshot shows 89% of a 16-hour goal. */
const PROGRESS = 0.89;

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
  grad.addColorStop(0, 'rgba(255,255,255,0.16)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.03)');
  grad.addColorStop(0.36, 'rgba(255,255,255,0)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);
  return new THREE.CanvasTexture(c);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
}

function start() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 6, 8);
  scene.add(key);
  const rim = new THREE.PointLight(MINT, 40, 20);
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
      new THREE.MeshStandardMaterial({ color: 0x0b1222, metalness: 0.5, roughness: 0.3 }),
    ),
  );

  const texture = new THREE.TextureLoader().load(art.dataset.screen, () => {
    art.classList.add('is-3d');
    render();
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

  // The ring, behind the phone, filling clockwise from the top like the app's.
  const ring = new THREE.Group();
  ring.position.z = -1.6;
  const R = 3.75;
  const TUBE = 0.11;
  ring.add(
    new THREE.Mesh(
      new THREE.TorusGeometry(R, TUBE * 0.8, 12, 160),
      new THREE.MeshBasicMaterial({ color: TRACK, transparent: true, opacity: 0.8 }),
    ),
  );
  const arcMat = new THREE.MeshBasicMaterial({ color: MINT, toneMapped: false });
  const arc = new THREE.Mesh(new THREE.BufferGeometry(), arcMat);
  // Torus arcs grow counterclockwise from +x: mirror, then turn to the top.
  arc.rotation.z = -Math.PI / 2;
  arc.scale.x = -1;
  ring.add(arc);
  const knob = new THREE.Mesh(
    new THREE.SphereGeometry(TUBE * 2.1, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0xf4f6fb }),
  );
  ring.add(knob);
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: dotTexture(),
      color: MINT,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  halo.scale.set(11, 11, 1);
  halo.position.z = -0.5;
  ring.add(halo);
  scene.add(ring);

  let shownArc = -1;
  function setArc(fraction) {
    if (Math.abs(fraction - shownArc) < 0.002) return;
    shownArc = fraction;
    arc.geometry.dispose();
    arc.geometry = new THREE.TorusGeometry(R, TUBE, 12, 160, Math.max(fraction, 0.001) * Math.PI * 2);
    const a = Math.PI / 2 - fraction * Math.PI * 2;
    knob.position.set(R * Math.cos(a), R * Math.sin(a), 0);
  }

  // Dust.
  const COUNT = 220;
  const dust = new Float32Array(COUNT * 3);
  const speed = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    dust[i * 3] = (Math.random() - 0.5) * 14;
    dust[i * 3 + 1] = (Math.random() - 0.5) * 11;
    dust[i * 3 + 2] = -5 + Math.random() * 5;
    speed[i] = 0.08 + Math.random() * 0.25;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3));
  const points = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      map: dotTexture(),
      color: MINT,
      size: 0.09,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(points);

  // Size: keep the whole ring in view whatever the box's shape.
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fitH = 9.0;
    const fitW = 8.8;
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

  const clock = new THREE.Clock();
  let lastT = 0;
  let visible = true;
  let running = false;

  function frame() {
    const t = clock.getElapsedTime();
    const intro = still ? 1 : easeOutCubic(t / 1.6);
    setArc(PROGRESS * (still ? 1 : easeOutCubic((t - 0.3) / 2.2)));

    if (!pointerSeen && !still) {
      target.x = Math.sin(t * 0.45) * 0.22;
      target.y = Math.sin(t * 0.32) * 0.12;
    }
    now.x += (target.x - now.x) * 0.06;
    now.y += (target.y - now.y) * 0.06;

    const rect = art.getBoundingClientRect();
    const scrolled = Math.min(Math.max(-rect.top / rect.height, 0), 1);

    phone.rotation.y = -0.32 + now.x * 0.7 + (1 - intro) * 0.6;
    phone.rotation.x = 0.06 + now.y * 0.45 + scrolled * 0.35;
    phone.rotation.z = 0.05 - now.x * 0.06;
    phone.position.y = (1 - intro) * -1.4 + (still ? 0 : Math.sin(t * 1.1) * 0.08);
    phone.position.x = 0.15;

    ring.rotation.y = now.x * 0.35;
    ring.rotation.x = now.y * 0.25 + scrolled * 0.2;

    const dt = Math.min(t - lastT, 0.05);
    lastT = t;
    if (!still) {
      const p = dustGeo.attributes.position;
      for (let i = 0; i < COUNT; i++) {
        let y = p.getY(i) + speed[i] * dt;
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
  setArc(0);
  play();
}
