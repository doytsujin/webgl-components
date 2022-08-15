import '../style.css';

import webglScene from '../webgl-scene';
import Asset, { AssetType } from './asset';
import AssetManager from './asset-manager';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import {
  Color,
  DoubleSide,
  EquirectangularReflectionMapping,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneBufferGeometry,
  Scene,
  Texture
} from 'three';
import RenderStats, { RenderStatsPosition } from '../utils/stats';
import AssetLoader from './asset-loader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';

export default { title: 'Loader' };

export const allAssetTypes = () => {
  const { scene, camera, renderer } = webglScene();

  const assets = [
    new Asset({
      id: 'cube',
      src: '/assets/cube.glb',
      type: AssetType.GLTF
    }),
    new Asset({
      id: 'scene',
      src: '/assets/scene.fbx',
      type: AssetType.FBX
    }),
    new Asset({
      id: 'texture',
      src: '/assets/texture-128.jpg',
      type: AssetType.Texture
    }),
    new Asset({
      id: 'data',
      src: '/assets/data.json',
      type: AssetType.Json
    }),
    new Asset({
      id: 'jam3-logo',
      src: '/assets/jam3-high.glb',
      type: AssetType.GLTF
    }),
    new Asset({
      id: 'enviroment-map',
      src: '/assets/env-map.hdr',
      type: AssetType.RgbeTexture
    }),
    new Asset({
      id: 'sample-uastc',
      src: '/assets/sample-uastc.ktx2',
      type: AssetType.Ktx2Texture
    }),
    new Asset({
      id: 'fire-uastc',
      src: '/assets/fire-1024.ktx2',
      type: AssetType.Ktx2Texture
    })
  ];

  const assetManager = new AssetManager();

  // Use the draco loader for gltf if the glb file is compressed with draco
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/lib/draco/gltf/');
  dracoLoader.preload();

  const ktxLoader = new KTX2Loader();
  ktxLoader.setTranscoderPath('/lib/basis/').detectSupport(renderer);

  const loader = new AssetLoader({ id: 'example', parallelLoads: 5, preferWebWorker: true });
  loader.setDracoLoader(dracoLoader);
  loader.setKtx2Loader(ktxLoader);

  loader.manager.on('progress', (progress: number) => {
    console.log('progress', progress);
  });

  loader.once('loaded', (response: Asset[]) => {
    assetManager.add('example', response);

    console.log(response);

    const asset = assetManager.get('example', 'jam3-logo');
    const enviromentMap = (assetManager.get('example', 'enviroment-map') as Asset).data as Texture;

    if (asset instanceof Asset) {
      if (asset.data) {
        enviromentMap.mapping = EquirectangularReflectionMapping;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modelScene: Scene = (asset.data as any).scene;
        const group = modelScene.children[0].clone();
        group.scale.set(100, 100, 100);
        scene.add(group);

        const material = new MeshStandardMaterial({
          color: 0x000000,
          envMap: enviromentMap,
          roughness: 0.1,
          metalness: 0.8
        });

        group.children[0].children.forEach((child: Object3D) => {
          if (child instanceof Mesh) {
            child.material = material;
          }
        });
      }
    }
  });

  loader.once('error', (error: string) => {
    console.log('error', error);
  });

  loader.load(assets);

  renderer.setClearColor(new Color(0x222222));
  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }
  update();

  return renderer.domElement;
};

export const withWorker = () => {
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

      const total = response.length;
      const totalInstances = total;
      const grid = Math.round(Math.sqrt(total));
      const size = 10 * (grid / totalInstances);
      const offset = -(grid * size) * 0.5 + size / 2;
      // Add images to the scene
      const geometry = new PlaneBufferGeometry(1, 1);
      for (let i = 0; i < totalInstances; i++) {
        const params = { side: DoubleSide, wireframe: false, map: new Texture() };
        const data = (assetManager.get('images', `image-${i}`) as Asset).data as typeof HTMLImageElement;
        // if (data != null && typeof data === 'string') {
        if (data != null && data instanceof HTMLImageElement) {
          params.map.image = data;
          params.map.needsUpdate = true;
          // params.map.image = new Image();
          // params.map.image.src = data;
          // params.map.image.onload = () => {
          //   params.map.needsUpdate = true;
          // };
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
