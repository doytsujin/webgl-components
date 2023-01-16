import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Loader, { LoaderSettings } from './loader';
import LoaderManager from './loader-manager';

const loader = new FBXLoader();

/**
 * Threejs FBX Loader
 *
 * @export
 * @class ThreeFBXLoader
 * @extends {Loader}
 */
export default class ThreeFBXLoader extends Loader {
  load = (settings?: LoaderSettings, manager: LoaderManager = new LoaderManager('three-fbx-loader')) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    manager.add(this);

    const onLoaded = (data: unknown) => {
      this.asset.data = data;
      this.emit('loaded', this.asset);
    };

    loader.load(this.asset.src, onLoaded, this.onProgress, this.onError);
  };
}
