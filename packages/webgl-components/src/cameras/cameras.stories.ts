import '../style.css';
import { Vector3 } from 'three';
import { resetCamera } from '.';
import webglScene from '../webgl-scene';

export default { title: 'Cameras' };

export const cameraPosition = () => {
  const { camera, renderer, scene } = webglScene();
  resetCamera(camera, 10, new Vector3(0, 0.5, 1));
  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }
  update();

  return renderer.domElement;
};
