import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { LoadingStatus } from './asset';
import Loader, { LoaderSettings } from './loader';
import LoaderManager from './loader-manager';

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

    const loader = new FBXLoader();

    const onLoaded = (data: Object) => {
      this.asset.status = LoadingStatus.Loaded;
      this.asset.data = data;
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
