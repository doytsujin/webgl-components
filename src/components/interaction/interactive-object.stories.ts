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
  MeshLambertMaterial
} from 'three';
import { setRendererSize, resizeWithConstraint } from '../rendering/resize';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import InteractiveObject from './interactive-object';
import webglScene from '../../stories/webgl-scene';

import TouchControls from './touch-controls';

export default { title: 'Interaction' };

export const interactiveObjects = () => {
  const { scene, camera, renderer, root } = webglScene();

  const mesh = new Mesh(
    new SphereBufferGeometry(2, 32, 32),
    new MeshLambertMaterial({ color: 0xffffff, wireframe: true })
  );
  const interactiveObject = new InteractiveObject(mesh, camera, renderer.domElement, {
    touchStart: true,
    touchMove: true,
    touchEnd: true,
    mouseMove: false
  });
  interactiveObject.bindEvents(true);
  scene.add(mesh);

  function onStart() {
    mesh.material.color.setHex(0x00ffff);
  }
  function onHover(over: boolean) {
    mesh.material.color.setHex(over ? 0xff0000 : 0xffffff);
  }
  function onEnd() {
    mesh.material.color.setHex(0xffffff);
  }

  interactiveObject.on('start', onStart);
  interactiveObject.on('hover', onHover);
  interactiveObject.on('end', onEnd);

  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }
  update();

  return renderer.domElement;
};
