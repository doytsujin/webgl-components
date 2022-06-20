import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Loader from './loader';

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

  load = () => {
    const loader = new GLTFLoader();

    if (this.dracoLoader != null) {
      loader.setDRACOLoader(this.dracoLoader);
    }

    const onLoaded = (gltf: Object) => {
      this.asset.data = gltf;
      this.emit('loaded', this.asset);
    };

    const onProgress = () => {};

    const onError = (error: ErrorEvent) => {
      this.emit('error', error, `Failed to load ${this.asset.src}`);
    };

    loader.load(this.asset.src, onLoaded, onProgress, onError);
  };
}
