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
import ThreeSoundLoader from './three-sound-loader';
import { AudioListener } from 'three';
import ThreeVideoLoader from './three-video-loader';

export default class AssetLoader extends ParallelLoader {
  dracoLoader?: DRACOLoader;
  ktx2Loader?: KTX2Loader;
  meshoptDecoder?: unknown;
  audioListener?: AudioListener;
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
      [AssetType.Ktx2Texture]: ThreeKtx2TexureLoader,
      [AssetType.Sound]: ThreeSoundLoader,
      [AssetType.VideoTexture]: ThreeVideoLoader
    });
  }

  setDracoLoader(dracoLoader: DRACOLoader) {
    this.dracoLoader = dracoLoader;
  }

  setKtx2Loader(ktx2Loader: KTX2Loader) {
    this.ktx2Loader = ktx2Loader;
  }

  setMeshoptDecoder(decoder: unknown) {
    this.meshoptDecoder = decoder;
  }

  setAudioListener(audioListener: AudioListener) {
    this.audioListener = audioListener;
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
    function logMissingConfiguration(fn: string, fileType: string) {
      console.error(`${fn} needs to be called before loading an ${fileType} file`);
    }
    if (loader instanceof ThreeGLTFLoader) {
      if (this.dracoLoader) {
        loader.setDracoLoader(this.dracoLoader);
      } else {
        logMissingConfiguration('setDracoLoader', 'gltf');
      }
      if (this.ktx2Loader) {
        loader.setKtx2Loader(this.ktx2Loader);
      } else {
        logMissingConfiguration('setKtx2Loader', 'gltf');
      }
      if (this.meshoptDecoder) {
        loader.setMeshoptDecoder(this.meshoptDecoder);
      } else {
        logMissingConfiguration('setMeshoptDecoder', 'gltf');
      }
    }
    if (loader instanceof ThreeKtx2TexureLoader) {
      if (this.ktx2Loader) {
        loader.setKtx2Loader(this.ktx2Loader);
      } else {
        logMissingConfiguration('setKtx2Loader', 'ktx2');
      }
    }
    if (loader instanceof ThreeSoundLoader) {
      if (this.audioListener) {
        loader.setAudioListener(this.audioListener);
      } else {
        logMissingConfiguration('setAudioListener', 'audio');
      }
    }
  }
}
