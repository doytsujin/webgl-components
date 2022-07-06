import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import Loader, { LoaderSettings } from './loader';
import { LoadingStatus } from './asset';

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
  load = (settings?: LoaderSettings) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    const loader = new GLTFLoader();

    if (this.dracoLoader != null) {
      loader.setDRACOLoader(this.dracoLoader);
    }

    const onLoaded = (gltf: Object) => {
      this.asset.status = LoadingStatus.Loaded;
      this.asset.data = gltf;
      this.emit('loaded', this.asset);
    };

    const onProgress = () => {};

    const onError = (error: ErrorEvent) => {
      this.asset.status = LoadingStatus.Error;
      this.emit('error', error, `Failed to load ${this.asset.src}`);
    };

    loader.load(this.asset.src, onLoaded, onProgress, onError);
  };
}
