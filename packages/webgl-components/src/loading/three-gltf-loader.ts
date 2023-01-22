import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Loader, { LoaderSettings } from './loader';
import LoaderManager from './loader-manager';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';

const loader = new GLTFLoader();

/**
 * Threejs GLTF Loader
 *
 * @export
 * @class ThreeGLTFLoader
 * @extends {Loader}
 */
export default class ThreeGLTFLoader extends Loader {
  setDracoLoader(dracoLoader: DRACOLoader) {
    loader.setDRACOLoader(dracoLoader);
  }

  setKtx2Loader(ktx2Loader: KTX2Loader) {
    loader.setKTX2Loader(ktx2Loader);
  }

  setMeshoptDecoder(decoder: unknown) {
    loader.setMeshoptDecoder(decoder);
  }

  load = (settings?: LoaderSettings, manager: LoaderManager = new LoaderManager('three-gltf-loader')) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    manager.add(this);

    const onLoaded = (gltf: unknown) => {
      this.asset.data = gltf;
      this.emit('loaded', this.asset);
    };

    loader.load(this.asset.src, onLoaded, this.onProgress, this.onError);
  };
}
