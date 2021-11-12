import webglScene from '..//webgl-scene';
import '../style.css';
import createCanvas from './canvas';
import RenderStats, { RenderStatsPosition } from './stats';
import { CanvasTexture, Mesh, MeshBasicMaterial, SphereGeometry } from 'three';
import disposeObjects from './dispose-objects';

export default { title: 'Utils' };

export const dispose = () => {
  const { scene, camera, renderer } = webglScene();

  function createImage() {
    const { canvas, ctx } = createCanvas(256, 256);
    canvas.width = 256;
    canvas.height = 256;
    if (ctx instanceof CanvasRenderingContext2D) {
      ctx.fillStyle =
        'rgb(' +
        Math.floor(Math.random() * 256) +
        ',' +
        Math.floor(Math.random() * 256) +
        ',' +
        Math.floor(Math.random() * 256) +
        ')';
      ctx.fillRect(0, 0, 256, 256);
    }
    return canvas;
  }

  const renderStats = new RenderStats({
    debug: true,
    parent: document.body,
    position: {
      alignment: RenderStatsPosition.TopLeft,
      x: 1,
      y: 1,
      unit: 'rem'
    }
  });

  renderStats.stats.setMode(2);

  function update() {
    requestAnimationFrame(update);

    const geometry = new SphereGeometry(5, Math.random() * 64, Math.random() * 32);
    const texture = new CanvasTexture(createImage());
    const material = new MeshBasicMaterial({ map: texture, wireframe: true });
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    renderer.render(scene, camera);
    renderStats.update(renderer);

    disposeObjects(mesh, scene);

    // Textures need to be done manually for now
    texture.dispose();
  }
  update();

  return renderer.domElement;
};
