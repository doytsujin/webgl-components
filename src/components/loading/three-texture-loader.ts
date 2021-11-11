import { TextureLoader, Texture } from 'three';
import Loader from './loader';

/**
 * Threejs texture loader
 *
 * @export
 * @class ThreeTextureLoader
 * @extends {Loader}
 */
export default class ThreeTextureLoader extends Loader {
  load = () => {
    const loader = new TextureLoader();

    const onLoaded = (texture: Texture) => {
      this.asset.data = texture;
      this.emit('loaded', this.asset);
    };

    const onProgress = () => {};

    const onError = () => {
      this.emit('error', `Failed to load ${this.asset.src}`);
    };

    loader.load(this.asset.src, onLoaded, onProgress, onError);
  };
}
