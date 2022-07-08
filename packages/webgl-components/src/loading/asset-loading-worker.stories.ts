import '../style.css';

import webglScene from '../webgl-scene';
import Asset, { AssetType } from './asset';
import AssetManager from './asset-manager';
import { Color, DoubleSide, Mesh, MeshBasicMaterial, PlaneBufferGeometry, Texture } from 'three';
import RenderStats, { RenderStatsPosition } from '../utils/stats';
import AssetLoader from './asset-loader';

export default { title: 'Loader' };

export const withWorkers = () => {
  const { scene, camera, renderer } = webglScene();

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

  const assetManager = new AssetManager();

  function loadImages() {
    const assets: Array<Asset> = [];
    for (let i = 0; i < 100; i++) {
      assets.push(
        new Asset({
          id: `image-${i}`,
          src: `/assets/images/${i}.jpg`,
          type: AssetType.Image
        })
      );
    }

    function onProgress(progress: number) {
      console.log('progress', progress);
    }

    function onError(error: string) {
      console.log('onError', error);
    }

    function onLoaded(response: Asset[]) {
      assetManager.add('images', response);

      console.log(response);

      const total = response.length;
      const totalInstances = total;
      const grid = Math.round(Math.sqrt(total));
      const size = 10 * (grid / totalInstances);
      const offset = -(grid * size) * 0.5 + size / 2;
      // Add images to the scene
      const geometry = new PlaneBufferGeometry(1, 1);
      for (let i = 0; i < totalInstances; i++) {
        const params = { side: DoubleSide, wireframe: false, map: new Texture() };
        const data = (assetManager.get('images', `image-${i}`) as Asset).data as typeof String;
        if (data != null && typeof data === 'string') {
          params.map.image = new Image();
          params.map.image.src = data;
          params.map.image.onload = () => {
            params.map.needsUpdate = true;
          };
        }
        const material = new MeshBasicMaterial(params);
        const mesh = new Mesh(geometry, material);
        const x = offset + (i % grid) * size;
        const y = offset + Math.floor(i / grid) * size;
        mesh.position.set(x, y, 0);
        scene.add(mesh);
      }
    }

    const loader = new AssetLoader({ id: 'images', parallelLoads: 10, preferWebWorker: true });

    loader.on('error', onError);
    loader.manager.on('progress', onProgress);
    loader.once('loaded', onLoaded);

    // Wait for webgl to start and then load
    setTimeout(() => {
      loader.load(assets);
    }, 1000);
  }

  loadImages();

  renderer.setClearColor(new Color(0x222222));
  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
    stats.update(renderer);
  }
  update();

  return renderer.domElement;
};
