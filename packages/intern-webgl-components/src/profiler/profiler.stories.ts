import '../style.css';

import { Mesh, SphereBufferGeometry, Vector2, MeshNormalMaterial, MathUtils } from 'three';
import { setRendererSize } from '../rendering/resize';
import profiler, { GRAPHICS_HIGH } from '.';
import webglScene from '../webgl-scene';

export default { title: 'Profiler' };

export const profileGPU = () => {
  const { renderer, camera, root, scene } = webglScene();

  function config(mode: string) {
    switch (mode) {
      case GRAPHICS_HIGH:
        return {
          antialias: false,
          pixelRatio: MathUtils.clamp(window.devicePixelRatio, 1, 2),
          resolution: new Vector2(1920, 1080)
        };
      default:
        return { antialias: false, pixelRatio: 1, resolution: new Vector2(1280, 720) };
    }
  }

  function resize() {
    if (root instanceof HTMLElement) {
      const width = root.offsetWidth;
      const height = root.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const graphics = config(profiler.graphics);
      setRendererSize(renderer, width, height, graphics.resolution.x, graphics.resolution.y);
    }
  }

  profiler.run().then(() => {
    // Optimise geometry based on gpu performance
    const divisions = profiler.equals(GRAPHICS_HIGH) ? 64 : 32;
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
