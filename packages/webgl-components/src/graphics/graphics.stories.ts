import '../style.css';

import { Mesh, SphereBufferGeometry, MeshNormalMaterial } from 'three';
import { resizeWithConstraint } from '../rendering';
import graphicsProfiler from './graphics-profiler';
import { Quality } from './quality-settings';
import webglScene from '../webgl-scene';
import { getQueryFromParams } from '../utils/query-params';

export default { title: 'Graphics' };

export const profileGPU = () => {
  const { renderer, camera, root, scene } = webglScene();

  function resize() {
    if (root instanceof HTMLElement) {
      const screenWidth = root.offsetWidth;
      const screenHeight = root.offsetHeight;
      const qualitySettings = graphicsProfiler.getQualitySettings();

      const { width, height } = resizeWithConstraint(
        screenWidth,
        screenHeight,
        qualitySettings.resolution.x,
        qualitySettings.resolution.y
      );

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.domElement.style.width = `${screenWidth}px`;
      renderer.domElement.style.height = `${screenHeight}px`;
    }
  }

  // If the graphics query parameter is set, use it over the current gpu tier
  const qualityMode = getQueryFromParams('quality', window.parent);

  graphicsProfiler.run(qualityMode).then(() => {
    // Optimise geometry based on gpu performance
    const divisions = graphicsProfiler.equals(Quality.High) ? 64 : 32;
    const mesh = new Mesh(
      new SphereBufferGeometry(2, divisions, divisions),
      new MeshNormalMaterial({ wireframe: true })
    );
    scene.add(mesh);
    resize();
  });
  resize();

  window.addEventListener('resize', resize);

  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }
  update();

  return renderer.domElement;
};
