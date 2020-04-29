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
  MeshNormalMaterial
} from 'three';
import { createOrbitControls } from '../cameras/cameras';
import { setRendererSize } from './rendering';

export default { title: 'Rendering' };

function setup(shaderConfig, material) {
  const root = document.getElementById('root');
  const renderer = new WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
    stencil: false
  });

  if (root == null) return { renderer };
  const scene = new Scene();
  const camera = new PerspectiveCamera(65, 1, 0.1, 100);
  camera.position.set(0, 2, 7);
  camera.lookAt(new Vector3());

  createOrbitControls(camera, renderer);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(root.offsetWidth, root.offsetHeight);

  const ambient = new AmbientLight();
  const directional = new DirectionalLight();
  directional.position.set(1, 1, 1);
  scene.add(ambient, directional);

  const mesh = new Mesh(new SphereBufferGeometry(2, 64, 64), new MeshNormalMaterial());
  scene.add(mesh);

  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }

  update();

  return { renderer, camera, root };
}

export const resize = () => {
  const { renderer, camera, root } = setup();
  const maxResolution = new Vector2(1280, 720);

  function resize() {
    const width = root.offsetWidth;
    const height = root.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    setRendererSize(renderer, maxResolution, width, height);
  }
  resize();

  window.addEventListener('resize', resize);

  return renderer.domElement;
};
