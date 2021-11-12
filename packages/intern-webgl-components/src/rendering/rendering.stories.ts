import '../style.css';

import { Vector2 } from 'three';
import { setRendererSize, resizeWithConstraint } from './resize';
import webglScene from '../webgl-scene';

export default { title: 'Rendering' };

export const resizeElements = () => {
  const maxResolution = new Vector2(1280, 720);
  const root = document.getElementById('root');
  const container = document.createElement('container');
  const baseElement = document.createElement('div');
  const resizedElement = document.createElement('div');
  Object.assign(baseElement.style, {
    backgroundColor: 'rgba(255, 0, 0, 0.25)',
    position: 'absolute',
    top: '0',
    left: '0'
  });
  Object.assign(resizedElement.style, {
    backgroundColor: 'rgba(0, 0, 255, 0.25)',
    position: 'absolute',
    top: '0',
    left: '0'
  });

  function resize() {
    if (root instanceof HTMLElement) {
      baseElement.style.width = `${maxResolution.x}px`;
      baseElement.style.height = `${maxResolution.y}px`;
      const { width, height } = resizeWithConstraint(
        root.offsetWidth,
        root.offsetHeight,
        maxResolution.x,
        maxResolution.y
      );
      resizedElement.style.width = `${width}px`;
      resizedElement.style.height = `${height}px`;
    }
  }
  resize();

  window.addEventListener('resize', resize);

  container.appendChild(baseElement);
  container.appendChild(resizedElement);

  return container;
};

export const resizeWebGL = () => {
  const { renderer, camera, scene, root } = webglScene();
  const maxResolution = new Vector2(1280, 720);

  function resize() {
    if (root instanceof HTMLElement) {
      setRendererSize(renderer, root.offsetWidth, root.offsetHeight, maxResolution.x, maxResolution.y);
    }
  }
  resize();

  window.addEventListener('resize', resize);

  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }
  update();

  return renderer.domElement;
};
