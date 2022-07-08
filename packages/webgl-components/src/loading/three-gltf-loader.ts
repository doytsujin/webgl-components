import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Loader, { LoaderSettings } from './loader';
import LoaderManager from './loader-manager';

/**
 * Threejs GLTF Loader
 *
 * @export
 * @class ThreeGLTFLoader
 * @extends {Loader}
 */
export default class ThreeGLTFLoader extends Loader {
  dracoLoader?: DRACOLoader;

  setDracoLoader(dracoLoader: DRACOLoader) {
    this.dracoLoader = dracoLoader;
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

    const onLoaded = (gltf: unknown) => {
      this.asset.data = gltf;
      this.emit('loaded', this.asset);
    };

    loader.load(this.asset.src, onLoaded, this.onProgress, this.onError);
  };
}
