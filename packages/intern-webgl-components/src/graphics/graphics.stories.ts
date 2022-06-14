import '../style.css';

import { Mesh, SphereBufferGeometry, MeshNormalMaterial } from 'three';
import { setRendererSize } from '../rendering/resize';
import graphics, { Quality } from '.';
import webglScene from '../webgl-scene';
import { getQueryFromParams } from '../utils/query-params';

export default { title: 'Graphics' };

export const profileGPU = () => {
  const { renderer, camera, root, scene } = webglScene();

  function resize() {
    if (root instanceof HTMLElement) {
      const width = root.offsetWidth;
      const height = root.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const settings = graphics.getQualitySettings();
      setRendererSize(renderer, width, height, settings.resolution.x, settings.resolution.y);
    }
  }

  // If the graphics query parameter is set, use it over the current gpu tier
  const qualityMode = getQueryFromParams('quality', window.parent);

  graphics.profile(qualityMode).then(() => {
    // Optimise geometry based on gpu performance
    const divisions = graphics.equals(Quality.High) ? 64 : 32;
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
