import { TextureLoader, Texture } from 'three';
import { LoadingStatus } from './asset';
import Loader, { LoaderSettings } from './loader';
import LoaderManager from './loader-manager';

/**
 * Threejs texture loader
 *
 * @export
 * @class ThreeTextureLoader
 * @extends {Loader}
 */
export default class ThreeTextureLoader extends Loader {
  load = (settings?: LoaderSettings, manager: LoaderManager = new LoaderManager('three-texture-loader')) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    manager.add(this);

    const loader = new TextureLoader();

    const onLoaded = (texture: Texture) => {
      this.asset.status = LoadingStatus.Loaded;
      this.asset.data = texture;
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
