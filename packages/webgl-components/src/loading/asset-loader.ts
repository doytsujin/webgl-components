import Loader from './loader';
import JsonLoader from './json-loader';
import ThreeTextureLoader from './three-texture-loader';
import ThreeFBXLoader from './three-fbx-loader';
import ThreeGLTFLoader from './three-gltf-loader';
import ThreeRgbeTexureLoader from './three-rgbe-texture-loader';
import Asset, { AssetType } from './asset';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import ParallelLoader, { LoaderSettings } from './parallel-loader';
import AssetLoaderWorker from './asset-loader.worker';

export default class AssetLoader extends ParallelLoader {
  dracoLoader?: DRACOLoader;
  assetLoaderWorker!: AssetLoaderWorker;

  constructor(settings: LoaderSettings) {
    super(settings);
    if (this.webWorkersSupported()) {
      this.assetLoaderWorker = new AssetLoaderWorker();
    }
    this.loaderClasses = Object.assign(this.loaderClasses, {
      [AssetType.Json]: JsonLoader,
      [AssetType.Texture]: ThreeTextureLoader,
      [AssetType.FBX]: ThreeFBXLoader,
      [AssetType.GLTF]: ThreeGLTFLoader,
      [AssetType.RgbeTexture]: ThreeRgbeTexureLoader
    });
  }

  setDracoLoader(dracoLoader: DRACOLoader) {
    this.dracoLoader = dracoLoader;
  }

  load = (manifest: Asset[]) => {
    this.loaders = [];

    manifest.forEach((asset) => {
      if (asset.args === undefined) asset.args = {};
      if (this.loaderClasses[asset.type as string] !== undefined) {
        const loader = new this.loaderClasses[asset.type as string](asset);
        this.loaders.push(loader);
      } else {
        console.log(`No loader found for media type: ${asset.type} `);
      }
    });

    this.loaded = 0;
    this.queue = 0;
    this.current = 0;
    this.total = this.loaders.length;

    if (this.total === 0) {
      this.emit('loaded', manifest);
    } else {
      this.loadNextInQueue();
    }
  };

  nextInQueue(loader: Loader) {
    if (loader instanceof ThreeGLTFLoader && this.dracoLoader) {
      loader.setDracoLoader(this.dracoLoader);
    }
  }
}
