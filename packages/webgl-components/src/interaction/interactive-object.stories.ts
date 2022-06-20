import '../style.css';

import { Mesh, SphereBufferGeometry, MeshLambertMaterial } from 'three';
import InteractiveObject from './interactive-object';
import webglScene from '../webgl-scene';

export default { title: 'Interaction' };

export const interactiveObjects = () => {
  const { scene, camera, renderer } = webglScene();

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
