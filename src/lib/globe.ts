import createGlobe, { type COBEOptions, type Marker } from 'cobe';

// Cartographic, on-brand palette (see tailwind.config.cjs): a warm topographic
// landmass with bright survey-marker beacons and a soft red atmospheric rim.
const BASE_COLOR: COBEOptions['baseColor'] = [0.78, 0.4, 0.28]; // warm terracotta landmass dots
const MARKER_COLOR: COBEOptions['markerColor'] = [1, 0.95, 0.88]; // bright warm-white beacons
const GLOW_COLOR: COBEOptions['glowColor'] = [0.86, 0.2, 0.16]; // ember-red atmospheric rim

// Secondary marker tint for places that were visited rather than lived in —
// smaller ember-red pins that read as a layer beneath the main beacons.
const VISITED_COLOR: [number, number, number] = [1, 0.35, 0.26];

const BASE_THETA = 0.3;

// Places Justin has lived & worked — surfaced as a legend beside the globe.
export interface Place {
  label: string;
  coords: string;
  location: [number, number];
}

// Renders [lat, lon] the way a map margin would: '39.7°N 105.0°W'.
function formatCoords([lat, lon]: [number, number]): string {
  const ns = `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'}`;
  const ew = `${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}`;
  return `${ns} ${ew}`;
}

function place(label: string, location: [number, number]): Place {
  return { label, location, coords: formatCoords(location) };
}

// Lived & worked — a year or more on the ground.
export const PLACES: Place[] = [
  place('Colorado', [39.7, -105.0]),
  place('Bogotá', [4.71, -74.07]),
  place('Seoul', [37.57, 126.98])
];

// Everywhere else — countries visited, plotted at a representative point.
export const VISITED: Place[] = [
  place('Taiwan', [25.03, 121.57]),
  place('Hong Kong', [22.32, 114.17]),
  place('Malaysia', [3.14, 101.69]),
  place('Singapore', [1.35, 103.82]),
  place('Japan', [35.68, 139.69]),
  place('Turkey', [41.01, 28.98]),
  place('Greece', [37.98, 23.73]),
  place('Croatia', [45.81, 15.98]),
  place('Italy', [41.9, 12.5]),
  place('Germany', [52.52, 13.4]),
  place('France', [48.86, 2.35]),
  place('Spain', [40.42, -3.7]),
  place('Ireland', [53.35, -6.26]),
  place('UK', [51.51, -0.13]),
  place('Mexico', [19.43, -99.13]),
  place('Belize', [17.5, -88.2]),
  place('Guatemala', [14.63, -90.51]),
  place('Panama', [8.98, -79.52]),
  place('Bahamas', [25.06, -77.34]),
  place('Dominican Republic', [18.49, -69.93]),
  place('Aruba', [12.52, -70.03]),
  place('Ecuador', [-0.18, -78.47]),
  place('Peru', [-12.05, -77.04]),
  place('Argentina', [-34.6, -58.38]),
  place('Uruguay', [-34.9, -56.16])
];

const LIVED_MARKERS: Marker[] = PLACES.map((p) => ({
  location: p.location,
  size: 0.06
}));

const VISITED_MARKERS: Marker[] = VISITED.map((p) => ({
  location: p.location,
  size: 0.032,
  color: VISITED_COLOR
}));

const ALL_MARKERS: Marker[] = [...LIVED_MARKERS, ...VISITED_MARKERS];

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
  private showVisited = false;

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
      markers: LIVED_MARKERS
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

  // Layer the visited pins on top of the lived & worked beacons, or drop back
  // to just the beacons. Markers are re-uploaded only when the layer changes.
  setShowVisited(show: boolean) {
    if (this.disposed || show === this.showVisited) return;
    this.showVisited = show;
    this.globe.update({ markers: show ? ALL_MARKERS : LIVED_MARKERS });
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('pointermove', this.onPointer);
    this.globe.destroy();
  }
}
