import Loader, { LoaderSettings } from './loader';
import ThreeTextureLoader from './three-texture-loader';
import ThreeFBXLoader from './three-fbx-loader';
import ThreeGLTFLoader from './three-gltf-loader';
import ThreeRgbeTexureLoader from './three-rgbe-texture-loader';
import ThreeKtx2TexureLoader from './three-ktx2-texture-loader';
import Asset, { AssetType } from './asset';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import ParallelLoader from './parallel-loader';
// import WorkerLoader from './worker-loader';
import LoaderManager from './loader-manager';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';

export default class AssetLoader extends ParallelLoader {
  dracoLoader?: DRACOLoader;
  ktx2Loader?: KTX2Loader;
  // workerLoader!: WorkerLoader;

  constructor(settings: LoaderSettings, manager: LoaderManager = new LoaderManager('asset-loader')) {
    super(settings, manager);
    // if (this.webWorkersSupported()) {
    //   this.workerLoader = new WorkerLoader();
    // }
    this.loaderClasses = Object.assign(this.loaderClasses, {
      [AssetType.Texture]: ThreeTextureLoader,
      [AssetType.FBX]: ThreeFBXLoader,
      [AssetType.GLTF]: ThreeGLTFLoader,
      [AssetType.RgbeTexture]: ThreeRgbeTexureLoader,
      [AssetType.Ktx2Texture]: ThreeKtx2TexureLoader
    });
  }

  setDracoLoader(dracoLoader: DRACOLoader) {
    this.dracoLoader = dracoLoader;
  }

  setKtx2Loader(ktx2Loader: KTX2Loader) {
    this.ktx2Loader = ktx2Loader;
  }

  createLoaders(manifest: Asset[]) {
    manifest.forEach((asset) => {
      if (asset.args === undefined) asset.args = {};
      if (this.loaderClasses[asset.type as string] !== undefined) {
        // Use worker loader for asset types it supports
        // if (this.workerLoader.supports(asset.type)) {
        //   this.workerLoader.addAsset(asset);
        // } else {
        const loader = new this.loaderClasses[asset.type as string](asset);
        this.loaders.push(loader);
        // }
      } else {
        console.log(`No loader found for media type: ${asset.type} `);
      }
    });
    // this.loaders.unshift(this.workerLoader);
  }

  nextInQueue(loader: Loader) {
    if (loader instanceof ThreeGLTFLoader && this.dracoLoader) {
      loader.setDracoLoader(this.dracoLoader);
    }
    if (loader instanceof ThreeKtx2TexureLoader && this.ktx2Loader) {
      loader.setKtx2Loader(this.ktx2Loader);
    }
  }
}
