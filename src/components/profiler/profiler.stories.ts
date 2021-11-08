import '../../style.css';

import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Mesh,
  SphereBufferGeometry,
  AmbientLight,
  DirectionalLight,
  Vector3,
  Vector2,
  MeshNormalMaterial,
  MathUtils
} from 'three';
import { setRendererSize, resizeWithConstraint } from '../rendering/resize';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import profiler, { GRAPHICS_HIGH, GRAPHICS_NORMAL } from './profiler';

export default { title: 'Profiler' };

function setup() {
  const root = document.getElementById('root');
  const renderer = new WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
    stencil: false
  });

  const camera = new PerspectiveCamera(65, 1, 0.1, 100);
  camera.position.set(0, 2, 7);
  camera.lookAt(new Vector3());

  const scene = new Scene();

  if (root == null) return { renderer, camera, scene };

  const controls = new OrbitControls(camera, renderer.domElement);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(root.offsetWidth, root.offsetHeight);

  const ambient = new AmbientLight();
  const directional = new DirectionalLight();
  directional.position.set(1, 1, 1);
  scene.add(ambient, directional);

  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }

  update();

  return { renderer, camera, root, scene };
}

export const profileGPU = () => {
  const { renderer, camera, root, scene } = setup();

  function config(mode: string) {
    switch (mode) {
      case GRAPHICS_HIGH:
        return {
          antialias: false,
          pixelRatio: MathUtils.clamp(window.devicePixelRatio, 1, 2),
          resolution: new Vector2(1920, 1080)
        };
      default:
        return { antialias: false, pixelRatio: 1, resolution: new Vector2(1280, 720) };
    }
  }

  function resize() {
    if (root instanceof HTMLElement) {
      const width = root.offsetWidth;
      const height = root.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const graphics = config(profiler.graphics);
      console.log(profiler.graphics);
      setRendererSize(renderer, width, height, graphics.resolution.x, graphics.resolution.y);
    }
  }

  profiler.run().then(() => {
    // Optimise geometry based on gpu performance
    const divisions = profiler.equals(GRAPHICS_HIGH) ? 64 : 32;
    const mesh = new Mesh(
      new SphereBufferGeometry(2, divisions, divisions),
      new MeshNormalMaterial({ wireframe: true })
    );
    scene.add(mesh);
    resize();
  });
  resize();

  window.addEventListener('resize', resize);

  return renderer.domElement;
};
