import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  IcosahedronGeometry,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
  WireframeGeometry
} from 'three';

const RADIUS = 1.6;
const BRAND_RED = 0xdc0000;
const GLOW_RED = 0xff3b30;
const FLASH = new Color(0xff5a32); // travelling pulse colour
const BG = new Color(0xf6efe4); // page background (arcs fade toward this)
const ARC_POINTS = 90;
const TRAIL = 0.16; // length of the flash as a fraction of the arc

interface Place {
  lat: number;
  lng: number;
}

const PLACES: Place[] = [
  { lat: 39.7, lng: -105.0 }, // Colorado
  { lat: 14.5, lng: -90.73 }, // Guatemala
  { lat: 4.71, lng: -74.07 }, // Bogotá
  { lat: 37.57, lng: 126.98 } // Seoul
];

// A loop of routes the flashes travel along
const ARCS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0]
];

interface Arc {
  line: Line;
  head: Mesh;
  positions: Float32Array;
  colors: Float32Array;
  phase: number;
  speed: number;
}

function latLngToVec3(lat: number, lng: number, radius: number): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export class Globe {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private root: Group;
  private spin: Group;
  private markers: Mesh[] = [];
  private arcs: Arc[] = [];
  private el: HTMLCanvasElement;

  private pointer = { x: 0, y: 0 };
  private targetTilt = { x: 0, y: 0 };

  private introStart = 0;
  private introDuration = 1700;
  private started = false;
  private raf = 0;
  private disposed = false;

  private onResize = () => this.resize();
  private onPointer = (e: PointerEvent) => {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  constructor(el: HTMLCanvasElement) {
    this.el = el;
    this.scene = new Scene();

    this.camera = new PerspectiveCamera(42, this.aspect(), 0.1, 100);
    this.camera.position.set(0, 0.4, 5.2);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new WebGLRenderer({ canvas: el, antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.resize();

    this.scene.add(new AmbientLight(0xfff3e0, 0.45));
    const key = new DirectionalLight(0xffe8c4, 1.1);
    key.position.set(4, 5, 3);
    this.scene.add(key);
    const rim = new PointLight(0xff7b54, 0.8, 30);
    rim.position.set(-5, -2, -4);
    this.scene.add(rim);

    this.root = new Group();
    this.spin = new Group();
    this.root.add(this.spin);
    this.scene.add(this.root);
    this.root.scale.setScalar(0.001);

    this.buildPlanet();
    this.buildGraticule();
    this.buildMarkers();
    this.buildArcs();

    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onPointer);
    this.tick();
  }

  private aspect(): number {
    const w = this.el.clientWidth || window.innerWidth;
    const h = this.el.clientHeight || window.innerHeight;
    return w / h;
  }

  private buildPlanet() {
    const geo = new IcosahedronGeometry(RADIUS, 6);
    const mat = new MeshStandardMaterial({
      color: new Color(0xd9bf95),
      roughness: 0.9,
      metalness: 0.0,
      flatShading: true
    });
    this.spin.add(new Mesh(geo, mat));

    const haloGeo = new SphereGeometry(RADIUS * 1.12, 48, 48);
    const haloMat = new MeshStandardMaterial({
      color: new Color(0xffb199),
      transparent: true,
      opacity: 0.06,
      roughness: 1,
      metalness: 0
    });
    this.spin.add(new Mesh(haloGeo, haloMat));
  }

  private buildGraticule() {
    const sphere = new SphereGeometry(RADIUS * 1.004, 24, 16);
    const wire = new WireframeGeometry(sphere);
    const mat = new LineBasicMaterial({
      color: new Color(0xbfa57e),
      transparent: true,
      opacity: 0.26
    });
    this.spin.add(new LineSegments(wire, mat));
  }

  private buildMarkers() {
    PLACES.forEach((p) => {
      const pos = latLngToVec3(p.lat, p.lng, RADIUS * 1.015);
      const mat = new MeshStandardMaterial({
        color: new Color(BRAND_RED),
        emissive: new Color(GLOW_RED),
        emissiveIntensity: 1.4,
        roughness: 0.35
      });
      const m = new Mesh(new SphereGeometry(0.06, 16, 16), mat);
      m.position.copy(pos);
      m.scale.setScalar(0);
      this.spin.add(m);
      this.markers.push(m);

      const ring = new Mesh(
        new SphereGeometry(0.11, 16, 16),
        new MeshStandardMaterial({
          color: new Color(GLOW_RED),
          emissive: new Color(GLOW_RED),
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0.18
        })
      );
      ring.position.copy(pos);
      m.userData.ring = ring;
      this.spin.add(ring);
    });
  }

  private buildArcs() {
    ARCS.forEach(([a, b], idx) => {
      const start = latLngToVec3(PLACES[a].lat, PLACES[a].lng, RADIUS).normalize();
      const end = latLngToVec3(PLACES[b].lat, PLACES[b].lng, RADIUS).normalize();
      const lift = start.distanceTo(end) * 0.45;

      const positions = new Float32Array(ARC_POINTS * 3);
      const colors = new Float32Array(ARC_POINTS * 3);
      for (let i = 0; i < ARC_POINTS; i++) {
        const t = i / (ARC_POINTS - 1);
        const v = start.clone().lerp(end, t).normalize();
        const h = RADIUS + Math.sin(Math.PI * t) * lift;
        v.multiplyScalar(h);
        positions[i * 3] = v.x;
        positions[i * 3 + 1] = v.y;
        positions[i * 3 + 2] = v.z;
      }
      const geo = new BufferGeometry();
      geo.setAttribute('position', new BufferAttribute(positions, 3));
      geo.setAttribute('color', new BufferAttribute(colors, 3));
      const line = new Line(geo, new LineBasicMaterial({ vertexColors: true, transparent: true }));
      this.spin.add(line);

      // Bright travelling "flash" that runs along the route
      const head = new Mesh(
        new SphereGeometry(0.07, 16, 16),
        new MeshStandardMaterial({
          color: new Color(0xfff0dc),
          emissive: new Color(FLASH.getHex()),
          emissiveIntensity: 2.6,
          transparent: true,
          opacity: 1
        })
      );
      head.visible = false;
      this.spin.add(head);

      this.arcs.push({
        line,
        head,
        positions,
        colors,
        phase: idx / ARCS.length,
        speed: 0.16 + idx * 0.015
      });
    });
  }

  start() {
    if (this.started) return;
    this.started = true;
    this.introStart = performance.now();
  }

  resize() {
    const w = this.el.clientWidth || window.innerWidth;
    const h = this.el.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private tick = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.tick);
    const now = performance.now();
    const t = now * 0.001;

    const intro = !this.started ? 0 : Math.min((now - this.introStart) / this.introDuration, 1);
    const eased = easeOutCubic(intro);
    const pop = eased + Math.sin(eased * Math.PI) * 0.06;
    this.root.scale.setScalar(Math.max(pop, 0.001));

    this.spin.rotation.y += 0.0016 * intro;

    // Markers: staggered pop-in + gentle pulse
    this.markers.forEach((m, i) => {
      const appearAt = 0.45 + i * 0.09;
      const local = Math.min(Math.max((intro - appearAt) / 0.3, 0), 1);
      const e = easeOutCubic(local);
      const pulse = 1 + Math.sin(t * 2 + i) * 0.12 * e;
      m.scale.setScalar(e * pulse);
      const ring = m.userData.ring as Mesh | undefined;
      if (ring) {
        const rp = 1 + (Math.sin(t * 2 + i) * 0.5 + 0.5) * 0.6;
        ring.scale.setScalar(e * rp);
        (ring.material as MeshStandardMaterial).opacity = 0.18 * e * (1 - (rp - 1));
      }
    });

    // Arcs: a bright flash travels along each route, looping
    const arcFade = easeOutCubic(Math.max((intro - 0.5) / 0.5, 0));
    for (const arc of this.arcs) {
      const head = (t * arc.speed + arc.phase) % 1;
      for (let i = 0; i < ARC_POINTS; i++) {
        const p = i / (ARC_POINTS - 1);
        let dd = head - p; // distance behind the head along the path
        if (dd < 0) dd += 1;
        const intensity = dd < TRAIL ? Math.pow(1 - dd / TRAIL, 1.4) : 0;
        const base = 0.1; // faint persistent guide line
        const k = Math.min(base + intensity, 1) * arcFade;
        const c = i * 3;
        arc.colors[c] = BG.r + (FLASH.r - BG.r) * k;
        arc.colors[c + 1] = BG.g + (FLASH.g - BG.g) * k;
        arc.colors[c + 2] = BG.b + (FLASH.b - BG.b) * k;
      }
      (arc.line.geometry.getAttribute('color') as BufferAttribute).needsUpdate = true;

      // Move the glowing flash to the head of the trail
      const f = head * (ARC_POINTS - 1);
      const i0 = Math.floor(f);
      const i1 = Math.min(i0 + 1, ARC_POINTS - 1);
      const frac = f - i0;
      const p = arc.positions;
      arc.head.position.set(
        p[i0 * 3] + (p[i1 * 3] - p[i0 * 3]) * frac,
        p[i0 * 3 + 1] + (p[i1 * 3 + 1] - p[i0 * 3 + 1]) * frac,
        p[i0 * 3 + 2] + (p[i1 * 3 + 2] - p[i0 * 3 + 2]) * frac
      );
      arc.head.visible = arcFade > 0.05;
      const flashPulse = 0.85 + Math.sin(t * 6 + arc.phase * 6) * 0.15;
      arc.head.scale.setScalar(arcFade * flashPulse);
    }

    // Mouse parallax tilt
    this.targetTilt.y = this.pointer.x * 0.35;
    this.targetTilt.x = this.pointer.y * 0.22;
    this.root.rotation.y += (this.targetTilt.y - this.root.rotation.y) * 0.05;
    this.root.rotation.x += (this.targetTilt.x - this.root.rotation.x) * 0.05;

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointer);
    this.renderer.dispose();
  }
}
