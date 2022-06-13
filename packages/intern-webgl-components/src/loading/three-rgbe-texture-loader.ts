import { Texture } from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import Loader from './loader';

/**
 * Threejs rgbe texture loader
 *
 * @export
 * @class ThreeRgbeTextureLoader
 * @extends {Loader}
 */
export default class ThreeRgbeTextureLoader extends Loader {
  load = () => {
    const loader = new RGBELoader();
    const onLoaded = (texture: Texture) => {
      this.asset.data = texture;
      this.emit('loaded', this.asset);
    };

    const onProgress = () => {};

    const onError = (error: ErrorEvent) => {
      this.emit('error', `Failed to load ${this.asset.src}`, error);
    };

    loader.load(this.asset.src, onLoaded, onProgress, onError);
  };
}
