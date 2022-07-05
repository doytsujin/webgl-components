import Loader from './loader';
import ImageLoader from './image-loader';
import JsonLoader from './json-loader';
import ThreeTextureLoader from './three-texture-loader';
import ThreeFBXLoader from './three-fbx-loader';
import ThreeGLTFLoader from './three-gltf-loader';
import ThreeRgbeTexureLoader from './three-rgbe-texture-loader';
import { AssetType } from './asset';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import ParallelLoader from './parallel-loader';

export default class AssetLoader extends ParallelLoader {
  dracoLoader?: DRACOLoader;
  loaderClasses = {
    [AssetType.Image]: ImageLoader,
    [AssetType.Json]: JsonLoader,
    [AssetType.Texture]: ThreeTextureLoader,
    [AssetType.FBX]: ThreeFBXLoader,
    [AssetType.GLTF]: ThreeGLTFLoader,
    [AssetType.RgbeTexture]: ThreeRgbeTexureLoader
  };

  setDracoLoader(dracoLoader: DRACOLoader) {
    this.dracoLoader = dracoLoader;
  }

  nextInQueue(loader: Loader) {
    if (loader instanceof ThreeGLTFLoader && this.dracoLoader) {
      loader.setDracoLoader(this.dracoLoader);
    }
  }
}
