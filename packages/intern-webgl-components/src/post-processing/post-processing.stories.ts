import '../style.css';

import {
  Mesh,
  MeshBasicMaterial,
  Scene,
  BoxBufferGeometry,
  SphereBufferGeometry,
  MeshNormalMaterial,
  Vector2
} from 'three';
import webglScene from '../webgl-scene';

import GUI from '../utils/gui';
import PostProcessing from '../post-processing';
import graphicsProfiler from '../graphics/graphics-profiler';
import { getRenderBufferSize } from '../rendering';
import { SceneInterface } from './passes/transition-pass';

export default { title: 'Rendering' };
export const postProcessing = () => {
  const gui = GUI(true);

  const { scene, camera, renderer } = webglScene();
  const renderSize = new Vector2();

  const sceneA: SceneInterface = {
    scene: scene,
    clearColor: 0x000000,
    cameras: {
      main: camera,
      debug: null
    },
    update: () => {}
  };
  const sceneB: SceneInterface = {
    scene: new Scene(),
    clearColor: 0x000000,
    cameras: {
      main: camera,
      debug: null
    },
    update: () => {}
  };

  const postProcessing = new PostProcessing(renderer, graphicsProfiler.getQualitySettings(), gui);
  postProcessing.setScenes(sceneA, sceneB);
  postProcessing.resize(renderSize.x, renderSize.y);

  // add the two different scenes in the transition post effect
  sceneA.scene.add(new Mesh(new SphereBufferGeometry(2, 64, 64), new MeshNormalMaterial({})));
  sceneB.scene.add(new Mesh(new BoxBufferGeometry(2, 2, 2), new MeshBasicMaterial({ wireframe: true })));

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
