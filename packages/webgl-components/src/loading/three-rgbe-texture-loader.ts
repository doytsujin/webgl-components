import { Texture } from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import Loader, { LoaderSettings } from './loader';
import LoaderManager from './loader-manager';

/**
 * Threejs rgbe texture loader
 *
 * @export
 * @class ThreeRgbeTextureLoader
 * @extends {Loader}
 */
export default class ThreeRgbeTextureLoader extends Loader {
  load = (settings?: LoaderSettings, manager: LoaderManager = new LoaderManager('three-rgbe-loader')) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    manager.add(this);

    const loader = new RGBELoader();
    const onLoaded = (texture: Texture) => {
      this.asset.data = texture;
      this.emit('loaded', this.asset);
    };

    loader.load(this.asset.src, onLoaded, this.onProgress, this.onError);
  };
}
