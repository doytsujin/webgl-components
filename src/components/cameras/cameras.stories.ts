import '../../style.css';
import { Vector3, Scene, WebGLRenderer, GridHelper, AxesHelper, PerspectiveCamera } from 'three';

import { positionCamera } from './cameras';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import webglScene from '../../stories/webgl-scene';

export default { title: 'Cameras' };

export const cameraPosition = () => {
  const { camera, renderer, scene } = webglScene();
  positionCamera(camera, 10, new Vector3(0, 0.5, 1));
  new OrbitControls(camera, renderer.domElement);

  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }
  update();

  return renderer.domElement;
};
