import {
  sRGBEncoding,
  PCFSoftShadowMap,
  CylinderGeometry,
  PlaneGeometry,
  Mesh,
  MeshStandardMaterial,
  SphereBufferGeometry
} from 'three';
import '../style.css';
import webglScene from '../webgl-scene';
import { createGUI } from '../utils/gui';
import AmbientLightController from './ambient-light-controller';
import DirectionalLightController from './directional-light-controller';
import SpotLightController from './spot-light-controller';

export default { title: 'Lights' };

export const LightController = () => {
  const gui = createGUI(true);
  const { renderer, camera, scene } = webglScene(false);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.outputEncoding = sRGBEncoding;

  const ambient = new AmbientLightController({ color: 0x6b6b9e, intensity: 0.1 });
  ambient.addGUI(gui);
  scene.add(ambient.light);

  const directional = new DirectionalLightController({ color: 0xffffc2, intensity: 0.3, helperSize: 1 });
  directional.addGUI(gui);

  directional.light.position.set(-15, 40, 35);
  directional.light.lookAt(0.0, 0.0, 0.0);
  directional.light.castShadow = true;
  directional.light.shadow.camera.near = 1;
  directional.light.shadow.camera.far = 100;
  directional.light.shadow.camera.right = 30;
  directional.light.shadow.camera.left = -30;
  directional.light.shadow.camera.top = 30;
  directional.light.shadow.camera.bottom = -30;
  directional.light.shadow.mapSize.width = 1024;
  directional.light.shadow.mapSize.height = 1024;
  scene.add(directional.light);

  const spotLight = new SpotLightController();
  spotLight.addGUI(gui);
  spotLight.light.intensity = 1.0;
  spotLight.light.position.set(15, 40, 35);
  spotLight.light.angle = 0.3;
  spotLight.light.penumbra = 0.07;
  spotLight.light.decay = 2;
  spotLight.light.distance = 200;

  spotLight.light.castShadow = true;
  spotLight.light.shadow.mapSize.width = 1024;
  spotLight.light.shadow.mapSize.height = 1024;
  spotLight.light.shadow.camera.near = 10;
  spotLight.light.shadow.camera.far = 200;
  spotLight.light.shadow.focus = 1;
  scene.add(spotLight.light);

  //Add the meshes to the scene
  const material = new MeshStandardMaterial({ color: 0x808080, dithering: true });
  const geometry = new PlaneGeometry(200, 200);

  const mesh = new Mesh(geometry, material);
  mesh.position.set(0, -1, 0);
  mesh.rotation.x = -Math.PI * 0.5;
  mesh.receiveShadow = true; //!IMPORTANT, We need to set this flag in order to the floor to receive the shadows from the other meshes
  scene.add(mesh);

  const circleGeometry = new CylinderGeometry(5, 5, 2, 32, 1, false);
  const cmesh = new Mesh(circleGeometry, material);
  cmesh.position.set(0, 5, 0);
  cmesh.castShadow = true; //!IMPORTANT, We need to set this flag in order for the object to 'emmit' a shadow
  scene.add(cmesh);

  const sphereMesh = new Mesh(new SphereBufferGeometry(5), material);
  sphereMesh.position.set(12, 3, 0);
  sphereMesh.castShadow = true; //!IMPORTANT, We need to set this flag in order for the object to 'emmit' a shadow
  scene.add(sphereMesh);

  function update() {
    requestAnimationFrame(update);
    cmesh.rotateX(0.01);
    spotLight.light.position.setX(Math.sin(cmesh.rotation.x) * 30);
    renderer.render(scene, camera);
  }
  update();

  return renderer.domElement;
};
