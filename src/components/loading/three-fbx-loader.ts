import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Loader from './loader';

/**
 * Threejs FBX Loader
 *
 * @export
 * @class ThreeFBXLoader
 * @extends {Loader}
 */
export default class ThreeFBXLoader extends Loader {
  load = () => {
    const loader = new FBXLoader();

    const onLoaded = (data: Object) => {
      this.asset.data = data;
      this.emit('loaded', this.asset);
    };

    const onProgress = () => {};

    const onError = () => {
      this.emit('error', `Failed to load ${this.asset.src}`);
    };

    loader.load(this.asset.src, onLoaded, onProgress, onError);
  };
}
