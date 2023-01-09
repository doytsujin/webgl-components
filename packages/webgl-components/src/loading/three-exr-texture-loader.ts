import { Texture } from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import Loader, { LoaderSettings } from './loader';
import LoaderManager from './loader-manager';

/**
 * Threejs exr texture loader
 *
 * @export
 * @class ThreeExrTextureLoader
 * @extends {Loader}
 */
export default class ThreeExrTextureLoader extends Loader {
  load = (settings?: LoaderSettings, manager: LoaderManager = new LoaderManager('three-exr-loader')) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    manager.add(this);

    const loader = new EXRLoader();
    const onLoaded = (texture: Texture) => {
      this.asset.data = texture;
      this.emit('loaded', this.asset);
    };

    loader.load(this.asset.src, onLoaded, this.onProgress, this.onError);
  };
}
