import webglScene from '../webgl-scene';
import '../style.css';
import RenderStats, { RenderStatsPosition } from './stats';
import { IcosahedronBufferGeometry, Mesh, MeshNormalMaterial } from 'three';

export default { title: 'Utils' };

export const renderStats = () => {
  const { scene, camera, renderer } = webglScene();

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
