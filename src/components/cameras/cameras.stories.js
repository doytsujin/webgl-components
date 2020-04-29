import '../../style.css';
import { Vector3, Scene, WebGLRenderer, GridHelper, AxesHelper } from 'three';

import { createOrbitControls, createPerspectiveCamera, positionCamera } from './cameras';

export default { title: 'Cameras' };

function setup() {
  const root = document.getElementById('root');
  const renderer = new WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
    stencil: false
  });

  if (root == null) return { renderer };
  const scene = new Scene();

  scene.add(new GridHelper(), new AxesHelper());

  const camera = createPerspectiveCamera(root.offsetWidth / root.offsetHeight);
  camera.position.set(10, 6, 10);
  camera.lookAt(new Vector3());

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(root.offsetWidth, root.offsetHeight);

  function resize() {
    camera.aspect = root.offsetWidth / root.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(root.offsetWidth, root.offsetHeight);
  }
  resize();

  window.addEventListener('resize', resize);

  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }

  update();

  return { renderer, camera };
}

export const orbitControls = () => {
  const { camera, renderer } = setup();
  createOrbitControls(camera, renderer);
  return renderer.domElement;
};

export const cameraPosition = () => {
  const { camera, renderer } = setup();
  positionCamera(camera, 10, new Vector3(0, 0.5, 1));
  createOrbitControls(camera, renderer);
  return renderer.domElement;
};
