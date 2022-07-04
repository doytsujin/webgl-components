import '../style.css';

import webglScene from '../webgl-scene';
import GroupLoader from './group-loader';
import Asset, { AssetType } from './asset';
import AssetManager from './asset-manager';
import { Color, DoubleSide, Mesh, MeshBasicMaterial, PlaneBufferGeometry, Texture } from 'three';
import JsonLoader from './json-loader';

export default { title: 'Loader' };

export const loadAssetsWithWorkers = () => {
  const { scene, camera, renderer } = webglScene();

  const assetManager = new AssetManager();

  function loadData(): Promise<Asset | void> {
    return new Promise((resolve, reject) => {
      const loader = new JsonLoader(
        new Asset({
          id: 'data',
          src: '/assets/tmp/data.json',
          type: AssetType.Json
        })
      );
      loader.once('error', reject);
      loader.once('loaded', resolve);
      loader.load();
    });
  }

  function loadImages(response: Asset) {
    const assets = [];
    if (Array.isArray(response.data)) {
      for (let i = 0; i < response.data.length; i++) {
        assets.push(
          new Asset({
            id: `matcap-${i}`,
            src: `/assets/tmp/${response.data[i]}`,
            type: AssetType.Image
          })
        );
      }
    }

    const loader = new GroupLoader({ id: 'images', minParallel: 5, maxParallel: 10 });

    // loader.on('progress', (progress: number) => {
    //   console.log(progress);
    // });

    loader.once('loaded', (response: Asset[]) => {
      assetManager.add('images', response);

      const total = response.length;

      const totalInstances = total;
      const grid = Math.round(Math.sqrt(total));
      const size = 10 * (grid / totalInstances);

      const offset = -(grid * size) * 0.5 + size / 2;

      // Add images to the scene
      const geometry = new PlaneBufferGeometry(1, 1);
      for (let i = 0; i < totalInstances; i++) {
        const params = { side: DoubleSide, wireframe: false, map: new Texture() };
        const data = (assetManager.get('images', `matcap-${i}`) as Asset).data as typeof Image;
        if (data != null && data instanceof Image) {
          params.map.image = data;
          params.map.needsUpdate = true;
        }
        const material = new MeshBasicMaterial(params);
        const mesh = new Mesh(geometry, material);
        const x = offset + (i % grid) * size;
        const y = offset + Math.floor(i / grid) * size;
        mesh.position.set(x, y, 0);
        scene.add(mesh);
      }
    });

    loader.load(assets);
  }

  loadData().then((response: Asset | void) => {
    if (response != null) loadImages(response);
  });

  renderer.setClearColor(new Color(0x222222));
  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }
  update();

  return renderer.domElement;
};
