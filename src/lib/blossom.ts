import {
  AmbientLight,
  AnimationMixer,
  Box3,
  Clock,
  Color,
  DirectionalLight,
  Group,
  LoopOnce,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
  type AnimationAction
} from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MODEL_PATH = '/3d/scene.gltf';
const TARGET_SIZE = 6.0; // fit the branch to roughly this world size

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export class Blossom {
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private root: Group; // intro scale + parallax
  private clock: Clock;
  private mixer?: AnimationMixer;
  private bloom?: AnimationAction;
  private el: HTMLCanvasElement;

  private introStart = 0;
  private introDuration = 1700;
  private started = false;
  private loaded = false;
  private raf = 0;
  private disposed = false;

  private onResize = () => this.resize();

  constructor(el: HTMLCanvasElement) {
    this.el = el;
    this.scene = new Scene();
    this.clock = new Clock();

    this.camera = new PerspectiveCamera(42, this.aspect(), 0.1, 100);
    this.camera.position.set(0, 0.3, 6.5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new WebGLRenderer({ canvas: el, antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.resize();

    this.scene.add(new AmbientLight(0xfff3e8, 0.85));
    const key = new DirectionalLight(0xfff0d8, 1.3);
    key.position.set(3, 5, 4);
    this.scene.add(key);
    const rim = new PointLight(0xffd9c0, 0.6, 30);
    rim.position.set(-4, -1, -3);
    this.scene.add(rim);

    this.root = new Group();
    this.root.scale.setScalar(0.001);
    this.scene.add(this.root);

    new GLTFLoader().load(MODEL_PATH, (gltf) => this.onLoad(gltf), undefined, (e) =>
      console.error('Blossom load failed', e)
    );

    window.addEventListener('resize', this.onResize);
    this.tick();
  }

  private aspect(): number {
    const w = this.el.clientWidth || window.innerWidth;
    const h = this.el.clientHeight || window.innerHeight;
    return w / h;
  }

  private onLoad(gltf: GLTF) {
    const obj = gltf.scene;

    // Centre + fit the model regardless of its native scale
    const box = new Box3().setFromObject(obj);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    obj.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    const holder = new Group();
    holder.add(obj);
    holder.scale.setScalar(TARGET_SIZE / maxDim);
    this.root.add(holder);

    if (gltf.animations.length) {
      this.mixer = new AnimationMixer(obj);
      this.bloom = this.mixer.clipAction(gltf.animations[0]);
      this.bloom.setLoop(LoopOnce, 1);
      this.bloom.clampWhenFinished = true;
      if (this.started) this.playBloom();
    }
    this.loaded = true;
  }

  private playBloom() {
    if (!this.bloom) return;
    this.bloom.reset();
    this.bloom.play().warp(1, 0, 4.5);
  }

  start() {
    if (this.started) return;
    this.started = true;
    this.introStart = performance.now();
    if (this.loaded) this.playBloom();
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

    if (this.mixer) this.mixer.update(this.clock.getDelta());

    const intro = !this.started ? 0 : Math.min((now - this.introStart) / this.introDuration, 1);
    const eased = easeOutCubic(intro);
    const pop = eased + Math.sin(eased * Math.PI) * 0.05;
    this.root.scale.setScalar(Math.max(pop, 0.001));

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
