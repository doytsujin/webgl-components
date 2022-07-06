import '../style.css';

import webglScene from '../webgl-scene';
// import detect from '@jam3/detect';
import Asset, { AssetType } from './asset';
import AssetManager from './asset-manager';
import { Color, DoubleSide, Mesh, MeshBasicMaterial, PlaneBufferGeometry, Texture } from 'three';
import JsonLoader from './json-loader';
import RenderStats, { RenderStatsPosition } from '../utils/stats';
import WorkerLoader from './worker-loader';

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
    const assets: Array<Asset> = [];
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

    function onProgress(progress: number) {
      console.log(progress);
    }

    function onError(error: string) {
      console.log('onError', error);
    }

    function onLoaded(response: Asset) {
      const assets = response.data as Asset[];
      assetManager.add('images', assets);

      const total = assets.length;
      const totalInstances = total;
      const grid = Math.round(Math.sqrt(total));
      const size = 10 * (grid / totalInstances);
      const offset = -(grid * size) * 0.5 + size / 2;
      // Add images to the scene
      const geometry = new PlaneBufferGeometry(1, 1);
      for (let i = 0; i < totalInstances; i++) {
        const params = { side: DoubleSide, wireframe: false, map: new Texture() };
        const data = (assetManager.get('images', `matcap-${i}`) as Asset).data as typeof String;
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

    const loader = new WorkerLoader(assets);

    loader.on('error', onError);
    loader.on('progress', onProgress);
    loader.once('loaded', onLoaded);

    // Wait for webgl to start and then load
    setTimeout(() => {
      loader.load(true);
    }, 1000);
  }

  loadData().then((response: Asset | void) => {
    if (response != null) loadImages(response);
  });

  renderer.setClearColor(new Color(0x222222));
  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
    stats.update(renderer);
  }
  update();

  return renderer.domElement;
};

// export const withWorkers = () => {
//   const { scene, camera, renderer } = webglScene();

//   const stats = new RenderStats({
//     debug: true,
//     parent: document.body,
//     position: {
//       alignment: RenderStatsPosition.TopLeft,
//       x: 1,
//       y: 1,
//       unit: 'rem'
//     }
//   });

//   const assetManager = new AssetManager();

//   function loadData(): Promise<Asset | void> {
//     return new Promise((resolve, reject) => {
//       const loader = new JsonLoader(
//         new Asset({
//           id: 'data',
//           src: '/assets/tmp/data.json',
//           type: AssetType.Json
//         })
//       );
//       loader.once('error', reject);
//       loader.once('loaded', resolve);
//       loader.load();
//     });
//   }

//   function loadImages(response: Asset) {
//     const assets: Array<Asset> = [];
//     if (Array.isArray(response.data)) {
//       for (let i = 0; i < response.data.length; i++) {
//         assets.push(
//           new Asset({
//             id: `matcap-${i}`,
//             src: `/assets/tmp/${response.data[i]}`,
//             type: AssetType.Image
//           })
//         );
//       }
//     }

//     const loader = new AssetLoader();

//     function onProgress(progress: number) {
//       console.log(progress);
//     }

//     function onError(error: string) {
//       console.log('onError', error);
//     }

//     function onLoaded(response: Asset[]) {
//       assetManager.add('images', response);

//       const total = response.length;
//       const totalInstances = total;
//       const grid = Math.round(Math.sqrt(total));
//       const size = 10 * (grid / totalInstances);
//       const offset = -(grid * size) * 0.5 + size / 2;
//       // Add images to the scene
//       const geometry = new PlaneBufferGeometry(1, 1);
//       for (let i = 0; i < totalInstances; i++) {
//         const params = { side: DoubleSide, wireframe: false, map: new Texture() };
//         const data = (assetManager.get('images', `matcap-${i}`) as Asset).data as typeof String;
//         if (data != null && typeof data === 'string') {
//           params.map.image = new Image();
//           params.map.image.src = data;
//           params.map.image.onload = () => {
//             params.map.needsUpdate = true;
//           };
//         }
//         const material = new MeshBasicMaterial(params);
//         const mesh = new Mesh(geometry, material);
//         const x = offset + (i % grid) * size;
//         const y = offset + Math.floor(i / grid) * size;
//         mesh.position.set(x, y, 0);
//         scene.add(mesh);
//       }
//     }

//     loader.addEventListener('message', (event: MessageEvent) => {
//       switch (event.data.status) {
//         case 'error':
//           onError(event.data.response);
//           break;
//         case 'progress':
//           onProgress(event.data.response);
//           break;
//         case 'loaded':
//           onLoaded(event.data.response);
//           break;
//         default:
//           break;
//       }
//     });

//     // Wait for webgl to start and then load
//     setTimeout(() => {
//       loader.postMessage({
//         settings: {
//           id: 'images',
//           parallelLoads: detect.device.desktop ? 20 : 10
//         },
//         assets
//       });
//     }, 1000);
//   }

//   loadData().then((response: Asset | void) => {
//     if (response != null) loadImages(response);
//   });

//   renderer.setClearColor(new Color(0x222222));
//   function update() {
//     requestAnimationFrame(update);
//     renderer.render(scene, camera);
//     stats.update(renderer);
//   }
//   update();

//   return renderer.domElement;
// };
