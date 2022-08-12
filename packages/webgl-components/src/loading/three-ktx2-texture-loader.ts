import { CompressedTexture } from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import Loader, { LoaderSettings } from './loader';
import LoaderManager from './loader-manager';

/**
 * Threejs Ktx2 Texture Loader
 *
 * @export
 * @class ThreeKtx2TextureLoader
 * @extends {Loader}
 */
export default class ThreeKtx2TextureLoader extends Loader {
  ktx2Loader!: KTX2Loader;

  setKtx2Loader(ktx2Loader: KTX2Loader) {
    this.ktx2Loader = ktx2Loader;
  }

  load = (settings?: LoaderSettings, manager: LoaderManager = new LoaderManager('three-ktx2-loader')) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    manager.add(this);

    const onLoaded = (data: CompressedTexture) => {
      this.asset.data = data;
      this.emit('loaded', this.asset);
    };

    this.ktx2Loader.load(this.asset.src, onLoaded, this.onProgress, this.onError);
  };
}
