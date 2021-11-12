import { configure, addDecorator } from '@storybook/html';

import webglScene from '../../stories/webgl-scene';
import '../../style.css';
import createCanvas from './canvas';
import GUI from './gui';
import RenderStats, { RenderStatsPosition } from './stats';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  CanvasTexture,
  IcosahedronBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  SphereGeometry
} from 'three';
import disposeObjects from './dispose-objects';
import { getQueryFromParams, setQuery } from './query-params';

export default { title: 'Utils' };

export const renderStats = () => {
  const { scene, camera, renderer, root } = webglScene();
  const controls = new OrbitControls(camera, renderer.domElement);

  const mesh = new Mesh(new IcosahedronBufferGeometry(2, 3), new MeshNormalMaterial());
  scene.add(mesh);

  const stats = new RenderStats({
    debug: true,
    parent: document.body,
    position: {
      alignment: RenderStatsPosition.TopLeft,
      x: 1,
      y: 1,
      unit: 'rem'
    }
  });

  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
    stats.update(renderer);
  }
  update();

  return renderer.domElement;
};
