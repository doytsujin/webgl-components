import '../style.css';

import { Mesh, SphereBufferGeometry, MeshNormalMaterial } from 'three';
import webglScene from '../webgl-scene';

import { createGUI } from '../utils/gui';
import PostProcessing from '.';
import graphicsProfiler from '../graphics/graphics-profiler';
import { getRenderBufferSize } from '../rendering';

export default { title: 'Rendering' };
export const postProcessing = () => {
  const gui = createGUI(true);

  const { scene, renderer } = webglScene();

  const postProcessing = new PostProcessing(renderer, graphicsProfiler.getQualitySettings(), gui);

  scene.add(new Mesh(new SphereBufferGeometry(2, 64, 64), new MeshNormalMaterial({})));

  function update() {
    requestAnimationFrame(update);
    postProcessing.render(0);
  }

  function resize() {
    const { width, height } = getRenderBufferSize(renderer);
    postProcessing.resize(width, height);
  }

  window.addEventListener('resize', resize);

  resize();
  update();
  return renderer.domElement;
};
