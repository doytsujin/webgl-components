import '../../style.css';
import { Vector3, Scene, WebGLRenderer, GridHelper, AxesHelper, PerspectiveCamera } from 'three';

import {  positionCamera } from './cameras';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default { title: 'Cameras' };

function setup() {
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

  const camera = new PerspectiveCamera(65, aspect);
  camera.position.set(10, 6, 10);
  camera.lookAt(new Vector3());

  if (root == null) return { renderer, camera };
  const scene = new Scene();

  scene.add(new GridHelper(), new AxesHelper());

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(root.offsetWidth, root.offsetHeight);

  function resize() {
    if (root instanceof HTMLElement) {
      camera.aspect = root.offsetWidth / root.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(root.offsetWidth, root.offsetHeight);
    }
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


export const cameraPosition = () => {
  const { camera, renderer } = setup();
  positionCamera(camera, 10, new Vector3(0, 0.5, 1));
  new OrbitControls(camera, renderer.domElement);
  return renderer.domElement;
};
