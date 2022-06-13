import '../style.css';

import webglScene from '..//webgl-scene';
import GroupLoader from './group-loader';
import Asset, { AssetType } from './asset';
import AssetManager from './asset-manager';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Color, EquirectangularReflectionMapping, Mesh, MeshStandardMaterial, Object3D, Scene, Texture } from 'three';

export default { title: 'Loader' };

export const loadAssets = () => {
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
    })
  ];

  const assetManager = new AssetManager();

  // Use the draco loader for gltf if the glb file is compressed with draco
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/lib/draco/gltf/');
  dracoLoader.preload();

  const loader = new GroupLoader({ id: 'example', minParallel: 5, maxParallel: 10 });
  loader.setDracoLoader(dracoLoader);

  loader.on('progress', (progress: number) => {
    console.log(progress);
  });

  loader.once('loaded', (response: Asset[]) => {
    assetManager.addAssets('example', response);
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
