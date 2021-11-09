import {
  AmbientLight,
  AxesHelper,
  Clock,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three';

export default function webglScene() {
  const root = document.getElementById('root');
  const renderer = new WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
    stencil: false
  });

  let aspect = 1;
  if (root instanceof HTMLElement) {
    aspect = root.offsetWidth / root.offsetHeight;
  }

  const scene = new Scene();
  const clock = new Clock(true);

  const camera = new PerspectiveCamera(65, aspect);
  camera.position.set(10, 6, 10);
  camera.lookAt(new Vector3());

  if (root == null) return { scene, camera, renderer, root, clock };

  scene.add(new GridHelper(), new AxesHelper());

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(root.offsetWidth, root.offsetHeight);

  const ambient = new AmbientLight();
  const directional = new DirectionalLight();
  directional.position.set(1, 1, 1);
  scene.add(ambient, directional);

  function resize() {
    if (root instanceof HTMLElement) {
      camera.aspect = root.offsetWidth / root.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(root.offsetWidth, root.offsetHeight);
    }
  }
  resize();

  window.addEventListener('resize', resize);

  return { scene, camera, renderer, root, clock };
}
