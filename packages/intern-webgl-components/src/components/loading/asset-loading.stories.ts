import '../../style.css';

// import {
//   Scene,
//   WebGLRenderer,
//   PerspectiveCamera,
//   Mesh,
//   SphereBufferGeometry,
//   AmbientLight,
//   DirectionalLight,
//   Vector3,
//   Vector2,
//   MeshNormalMaterial,
//   MeshLambertMaterial
// } from 'three';
// import { setRendererSize, resizeWithConstraint } from '../rendering/resize';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import webglScene from '../../stories/webgl-scene';
import GroupLoader from './group-loader';
import Asset, { AssetType } from './asset';
import assetManager from './asset-manager';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Mesh, MeshNormalMaterial, Object3D, Scene } from 'three';

export default { title: 'Loader' };

export const loadAssets = () => {
  const { scene, camera, renderer, root } = webglScene();

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
      src: '/assets/jam3.glb',
      type: AssetType.GLTF
    })
  ];

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
    if (asset instanceof Asset) {
      if (asset.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modelScene: Scene = (asset.data as any).scene;
        const group = modelScene.children[0].clone();
        group.scale.set(100, 100, 100);
        scene.add(group);
        const material = new MeshNormalMaterial();
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

  function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }
  update();

  return renderer.domElement;
};
