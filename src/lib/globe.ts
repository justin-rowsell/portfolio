import createGlobe, { type COBEOptions } from 'cobe';

// Cartographic, on-brand palette (see tailwind.config.cjs): a warm topographic
// landmass with bright survey-marker beacons and a soft red atmospheric rim.
const BASE_COLOR: COBEOptions['baseColor'] = [0.78, 0.4, 0.28]; // warm terracotta landmass dots
const MARKER_COLOR: COBEOptions['markerColor'] = [1, 0.95, 0.88]; // bright warm-white beacons
const GLOW_COLOR: COBEOptions['glowColor'] = [0.86, 0.2, 0.16]; // ember-red atmospheric rim

const BASE_THETA = 0.3;

// Places Justin has lived & worked — surfaced as a legend beside the globe.
export interface Place {
  label: string;
  coords: string;
  location: [number, number];
}

export const PLACES: Place[] = [
  { label: 'Colorado', coords: '39.7°N 105.0°W', location: [39.7, -105.0] },
  { label: 'Bogotá', coords: '4.7°N 74.1°W', location: [4.71, -74.07] },
  { label: 'Seoul', coords: '37.6°N 127.0°E', location: [37.57, 126.98] }
];

const MARKERS: COBEOptions['markers'] = PLACES.map((p) => ({
  location: p.location,
  size: 0.06
}));

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
