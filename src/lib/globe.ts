import createGlobe, { type COBEOptions } from 'cobe';

// Futuristic, on-brand palette (see tailwind.config.cjs)
const BASE_COLOR: COBEOptions['baseColor'] = [0.95, 0.22, 0.17]; // glowing red landmass dots
const MARKER_COLOR: COBEOptions['markerColor'] = [1, 0.92, 0.85]; // bright warm-white beacons
const GLOW_COLOR: COBEOptions['glowColor'] = [1, 0.231, 0.188]; // red atmospheric rim

const BASE_THETA = 0.3;

const MARKERS: COBEOptions['markers'] = [
  { location: [39.7, -105.0], size: 0.06 }, // Colorado
  { location: [14.5, -90.73], size: 0.06 }, // Guatemala
  { location: [4.71, -74.07], size: 0.06 }, // Bogotá
  { location: [37.57, 126.98], size: 0.06 } // Seoul
];

export class Globe {
  private globe: ReturnType<typeof createGlobe>;
  private el: HTMLCanvasElement;

  private autoPhi = 0;
  private dragPhi = 0;
  private theta = BASE_THETA;
  private targetPhiOffset = 0;
  private targetTheta = BASE_THETA;
  private speed = 0;
  private started = false;
  private raf = 0;
  private disposed = false;

  private onPointer = (e: PointerEvent) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    this.targetPhiOffset = nx * 0.4;
    this.targetTheta = BASE_THETA + ny * 0.15;
  };

  constructor(el: HTMLCanvasElement) {
    this.el = el;
    const { w, h } = this.displaySize();

    this.globe = createGlobe(el, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: w,
      height: h,
      phi: 0,
      theta: this.theta,
      dark: 1.1,
      diffuse: 1.6,
      mapSamples: 22000,
      mapBrightness: 9,
      mapBaseBrightness: 0.06,
      baseColor: BASE_COLOR,
      markerColor: MARKER_COLOR,
      glowColor: GLOW_COLOR,
      markers: MARKERS
    });

    window.addEventListener('pointermove', this.onPointer);
    this.tick();
  }

  // Match the drawing buffer to the canvas's actual displayed rectangle so the
  // globe stays perfectly round instead of stretching to fill the element.
  // cobe's shader corrects for the width/height ratio internally.
  private displaySize(): { w: number; h: number } {
    return {
      w: this.el.offsetWidth || 600,
      h: this.el.offsetHeight || 600
    };
  }

  private tick = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.tick);

    this.autoPhi += this.speed;
    this.dragPhi += (this.targetPhiOffset - this.dragPhi) * 0.05;
    this.theta += (this.targetTheta - this.theta) * 0.05;

    const { w, h } = this.displaySize();
    this.globe.update({
      phi: this.autoPhi + this.dragPhi,
      theta: this.theta,
      width: w,
      height: h
    });
  };

  start() {
    if (this.started) return;
    this.started = true;
    this.speed = 0.0035;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('pointermove', this.onPointer);
    this.globe.destroy();
  }
}
