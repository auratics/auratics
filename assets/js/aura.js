// The home page's 3D scene: the studio's apps as icon tiles orbiting a soft,
// breathing glow — the aura in the name. The scene leans toward the pointer
// and tilts as the page scrolls. Pointing at a tile brings it forward and
// names it; a click or tap opens that app's page.
// The tiles come from the plain icon links in the page, which stay as they
// are if WebGL is missing.

import * as THREE from './three.module.min.js';

const VIOLET = 0x8f7cff;
const MINT = 0x3cf2c8;
const ORBIT = 3.0;
const TILE = 1.25;

const art = document.querySelector('.intro .art');
const canvas = art && art.querySelector('canvas.scene');
const label = art && art.querySelector('.tile-label');
const links = art ? [...art.querySelectorAll('[data-tile]')] : [];
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && links.length) {
  try {
    start();
  } catch (error) {
    console.warn('3D scene unavailable', error);
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
function faceGeometry(w, h, r) {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, r), 16);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  }
  return g;
}

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,255,255,0.5)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function glow(texture, color, size, opacity) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  sprite.scale.set(size, size, 1);
  sprite.userData.base = opacity;
  return sprite;
}

function clamp01(t) {
  return Math.min(Math.max(t, 0), 1);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - clamp01(t), 3);
}

function easeOutBack(t) {
  const x = clamp01(t);
  const c = 1.5;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
}

function start() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Stands at zero until every icon has arrived, so the intro is seen whole.
  const clock = new THREE.Clock(false);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 5, 8);
  scene.add(key);
  const rim = new THREE.PointLight(VIOLET, 30, 20);
  rim.position.set(-4, 2, 3);
  scene.add(rim);

  const dot = dotTexture();
  const system = new THREE.Group();
  scene.add(system);

  // The aura: a dark glass core inside layers of light, and a wire shell
  // turning slowly around it.
  const aura = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.62, 48, 32),
    new THREE.MeshStandardMaterial({
      color: 0x1b1733,
      emissive: 0x2b1f6e,
      emissiveIntensity: 0.6,
      metalness: 0.3,
      roughness: 0.2,
    }),
  );
  aura.add(core);
  const shell = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.05, 1)),
    new THREE.LineBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.28 }),
  );
  aura.add(shell);
  const halos = [
    glow(dot, VIOLET, 5.2, 0.42),
    glow(dot, MINT, 3.4, 0.22),
    glow(dot, 0xffffff, 1.5, 0.18),
  ];
  halos[1].position.set(0.35, -0.2, 0.1);
  halos.forEach((h) => aura.add(h));
  system.add(aura);

  // The orbit: a tilted plane the tiles travel in, its path drawn faintly.
  const orbit = new THREE.Group();
  orbit.rotation.set(-1.18, 0, 0.16);
  const path = new THREE.Mesh(
    new THREE.TorusGeometry(ORBIT, 0.008, 6, 200),
    new THREE.MeshBasicMaterial({ color: 0xb6a9ff, transparent: true, opacity: 0.22 }),
  );
  orbit.add(path);
  const outer = new THREE.Mesh(
    new THREE.TorusGeometry(ORBIT * 1.32, 0.006, 6, 200),
    new THREE.MeshBasicMaterial({ color: MINT, transparent: true, opacity: 0.1 }),
  );
  orbit.add(outer);
  system.add(orbit);

  // The tiles.
  const body = new THREE.ExtrudeGeometry(roundedRect(TILE, TILE, 0.3), {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.03,
    bevelSegments: 3,
    curveSegments: 16,
  });
  body.computeBoundingBox();
  body.translate(0, 0, -body.boundingBox.max.z);
  const face = faceGeometry(TILE, TILE, 0.3);
  const loader = new THREE.TextureLoader();
  let loaded = 0;

  const tiles = links.map((link, i) => {
    const color = new THREE.Color(link.dataset.color);
    const texture = loader.load(link.dataset.tile, () => {
      loaded += 1;
      if (loaded === links.length) {
        art.classList.add('is-3d');
        clock.start();
        still ? frame() : render();
      }
    });
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const tile = new THREE.Group();
    const front = new THREE.Mesh(face, new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
    front.position.z = 0.003;
    front.userData.index = i;
    tile.add(
      new THREE.Mesh(
        body,
        new THREE.MeshStandardMaterial({ color: color.clone().multiplyScalar(0.25), metalness: 0.5, roughness: 0.35 }),
      ),
    );
    tile.add(front);
    const light = glow(dot, color, 2.1, 0.24);
    light.position.z = -0.3;
    tile.add(light);
    system.add(tile);
    return {
      tile,
      front,
      light,
      link,
      angle: (i / links.length) * Math.PI * 2 + 0.5,
      focus: 0,
      delay: 0.35 + i * 0.14,
    };
  });

  // Dust in the studio's colours, drifting round the whole scene.
  const COUNT = 260;
  const dust = new Float32Array(COUNT * 3);
  const tint = new Float32Array(COUNT * 3);
  const palette = [VIOLET, MINT, ...links.map((l) => new THREE.Color(l.dataset.color).getHex())].map(
    (c) => new THREE.Color(c),
  );
  for (let i = 0; i < COUNT; i++) {
    const r = 2 + Math.random() * 5;
    const a = Math.random() * Math.PI * 2;
    dust[i * 3] = Math.cos(a) * r;
    dust[i * 3 + 1] = (Math.random() - 0.5) * 6;
    dust[i * 3 + 2] = Math.sin(a) * r - 1.5;
    const c = palette[i % palette.length];
    tint.set([c.r, c.g, c.b], i * 3);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3));
  dustGeo.setAttribute('color', new THREE.BufferAttribute(tint, 3));
  const points = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      map: dot,
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(points);

  // Size: keep the whole orbit in view whatever the box's shape.
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fitW = 7.8;
    const fitH = 6.0;
    camera.position.z = Math.max(fitH / 2 / half, fitW / 2 / (half * camera.aspect));
    camera.updateProjectionMatrix();
    render();
  }

  // Pointer: the whole scene leans toward it, and a tile under it is found.
  const target = { x: 0, y: 0 };
  const now = { x: 0, y: 0 };
  let pointerSeen = false;
  const ndc = new THREE.Vector2(2, 2);
  const ray = new THREE.Raycaster();
  let hovered = -1;

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

  function pick(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(tiles.map((t) => t.front), false)[0];
    return hit ? hit.object.userData.index : -1;
  }

  function setHovered(index, e) {
    hovered = index;
    canvas.style.cursor = index >= 0 ? 'pointer' : '';
    if (index < 0) {
      label.classList.remove('on');
      return;
    }
    const r = art.getBoundingClientRect();
    label.textContent = tiles[index].link.dataset.name;
    label.style.left = `${e.clientX - r.left}px`;
    label.style.top = `${e.clientY - r.top}px`;
    label.classList.add('on');
  }

  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    setHovered(pick(e), e);
    if (still) frame();
  });
  canvas.addEventListener('pointerleave', () => {
    setHovered(-1);
    if (still) frame();
  });
  // A click, or a tap that did not turn into a scroll, opens the app's page.
  let down = null;
  canvas.addEventListener('pointerdown', (e) => {
    down = { x: e.clientX, y: e.clientY };
  });
  canvas.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) return;
    down = null;
    const index = pick(e);
    if (index >= 0) location.href = tiles[index].link.href;
  });

  let lastT = 0;
  let visible = true;
  let running = false;
  let spin = 0;

  function frame() {
    const t = clock.getElapsedTime();
    const dt = Math.min(t - lastT, 0.05);
    lastT = t;
    const intro = still ? 1 : easeOutCubic(t / 1.4);

    if (!pointerSeen && !still) {
      target.x = Math.sin(t * 0.4) * 0.2;
      target.y = Math.sin(t * 0.3) * 0.1;
    }
    now.x += (target.x - now.x) * 0.06;
    now.y += (target.y - now.y) * 0.06;

    const rect = art.getBoundingClientRect();
    const scrolled = Math.min(Math.max(-rect.top / rect.height, 0), 1);

    system.rotation.y = now.x * 0.5;
    system.rotation.x = now.y * 0.3 + scrolled * 0.45;
    system.position.y = scrolled * 0.6;

    // The aura breathes; its shell turns.
    const breath = still ? 1 : 1 + Math.sin(t * 1.3) * 0.06;
    aura.scale.setScalar(Math.max(still ? 1 : easeOutBack(t / 1.2), 0.0001) * breath);
    shell.rotation.y = still ? 0.4 : t * 0.15;
    shell.rotation.x = still ? 0.2 : t * 0.07;
    halos[0].material.opacity = halos[0].userData.base * (still ? 1 : 0.85 + Math.sin(t * 1.3) * 0.15);

    // The orbit slows almost to a stop while a tile is pointed at.
    if (!still) spin += dt * (hovered >= 0 ? 0.03 : 0.16);

    // The tiles' places are worked out through the orbit's tilt, so the
    // turns set above have to be in the matrices first.
    system.updateMatrixWorld(true);
    const world = new THREE.Vector3();
    tiles.forEach((entry, i) => {
      const grow = still ? 1 : easeOutBack((t - entry.delay) / 0.9);
      const reach = ORBIT * (1 + (still ? 0 : 1 - easeOutCubic((t - entry.delay) / 1.2)) * 0.9);
      const a = entry.angle + spin;
      world.set(Math.cos(a) * reach, Math.sin(a) * reach, 0);
      orbit.localToWorld(world);
      system.worldToLocal(world);
      entry.tile.position.copy(world);
      entry.tile.position.y += still ? 0 : Math.sin(t * 1.1 + i) * 0.06;

      entry.focus += ((hovered === i ? 1 : 0) - entry.focus) * 0.12;
      entry.tile.scale.setScalar(Math.max(grow, 0.0001) * (1 + entry.focus * 0.22));
      entry.light.material.opacity = entry.light.userData.base * (1 + entry.focus * 1.4);

      // Face the camera, with a little sway of its own.
      entry.tile.lookAt(camera.position);
      entry.tile.rotateZ((still ? 0 : Math.sin(t * 0.8 + i * 1.7) * 0.08) * (1 - entry.focus));
    });

    if (!still) {
      points.rotation.y += dt * 0.025;
      points.rotation.x = now.y * 0.1;
    }
    points.material.opacity = 0.75 * intro;

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
  aura.scale.setScalar(0.0001);
  tiles.forEach((entry) => entry.tile.scale.setScalar(0.0001));
  play();
}
