import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Loader, { LoaderSettings } from './loader';
import LoaderManager from './loader-manager';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
/**
 * Threejs GLTF Loader
 *
 * @export
 * @class ThreeGLTFLoader
 * @extends {Loader}
 */
export default class ThreeGLTFLoader extends Loader {
  dracoLoader?: DRACOLoader;
  ktx2Loader?: KTX2Loader;
  meshoptDecoder?: any;

  setDracoLoader(dracoLoader: DRACOLoader) {
    this.dracoLoader = dracoLoader;
  }

  setKtx2Loader(ktx2Loader: KTX2Loader) {
    this.ktx2Loader = ktx2Loader;
  }

  setMeshoptDecoder(decoder: any) {
    this.meshoptDecoder = decoder;
  }

  load = (settings?: LoaderSettings, manager: LoaderManager = new LoaderManager('three-gltf-loader')) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    manager.add(this);

    const loader = new GLTFLoader();

    if (this.dracoLoader != null) {
      loader.setDRACOLoader(this.dracoLoader);
    }

    if (this.ktx2Loader != null) {
      loader.setKTX2Loader(this.ktx2Loader);
    }

    if (this.meshoptDecoder != null) {
      console.log(this.meshoptDecoder);
      loader.setMeshoptDecoder(this.meshoptDecoder);
    }

    const onLoaded = (gltf: unknown) => {
      this.asset.data = gltf;
      this.emit('loaded', this.asset);
    };

    loader.load(this.asset.src, onLoaded, this.onProgress, this.onError);
  };
}
