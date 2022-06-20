import { Scene, PerspectiveCamera, RGBAFormat, Object3D, WebGLRenderer } from 'three';
import { createRenderTarget } from './render-target';

const renderTarget = createRenderTarget(16, 16, {
  depthBuffer: false,
  format: RGBAFormat
});

type ObjectMap = {
  [prop: string]: {
    visible: boolean;
    culled: boolean;
  };
};

// https://medium.com/@hellomondaycom/how-we-built-the-google-cloud-infrastructure-webgl-experience-dec3ce7cd209
function setAllCulled(obj: Object3D, overrideCulled: boolean, map: ObjectMap) {
  if (overrideCulled === false) {
    map[obj.uuid] = {
      culled: obj.frustumCulled,
      visible: obj.visible
    };
    obj.visible = true;
    obj.frustumCulled = false;
  } else if (map[obj.uuid]) {
    obj.visible = map[obj.uuid].visible;
    obj.frustumCulled = map[obj.uuid].culled;
  }
  obj.children.forEach((child) => setAllCulled(child, overrideCulled, map));
}

/**
 * Render the scene contents to the gpu for caching buffers and textures
 *
 * @export
 * @param {Scene} scene
 * @param {PerspectiveCamera} camera
 */
export default function preloadGpu(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera) {
  const map: ObjectMap = {};
  const cameraAspect = camera.aspect;
  camera.aspect = 1;
  camera.updateProjectionMatrix();
  setAllCulled(scene, false, map);
  renderer.setRenderTarget(renderTarget);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);
  camera.aspect = cameraAspect;
  camera.updateProjectionMatrix();
  setAllCulled(scene, true, map);
}
