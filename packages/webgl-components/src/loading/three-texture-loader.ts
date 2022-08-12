import detect from '@jam3/detect';
import { TextureLoader, Texture, ImageBitmapLoader, CanvasTexture, MathUtils, LinearFilter } from 'three';
import Loader, { LoaderSettings } from './loader';
import LoaderManager from './loader-manager';

function validateTextureSize(width: number, height: number, texture: Texture) {
  if (!(MathUtils.isPowerOfTwo(width) && MathUtils.isPowerOfTwo(height))) {
    texture.generateMipmaps = false;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
  }
}

/**
 * Threejs texture loader
 *
 * @export
 * @class ThreeTextureLoader
 * @extends {Loader}
 */
export default class ThreeTextureLoader extends Loader {
  // Same detection as
  // https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/GLTFLoader.js#L2407
  bitmapSupported() {
    return !(
      typeof createImageBitmap === 'undefined' ||
      detect.browser.safari ||
      (detect.browser.firefox && detect.browser.majorVersion < 98)
    );
  }

  load = (settings?: LoaderSettings, manager: LoaderManager = new LoaderManager('three-texture-loader')) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    manager.add(this);

    // Threejs:
    // Use an ImageBitmapLoader if imageBitmaps are supported. Moves much of the
    // expensive work of uploading a texture to the GPU off the main thread.

    if (this.bitmapSupported()) {
      const loader = new ImageBitmapLoader();

      loader.setOptions({
        imageOrientation: 'flipY'
      });

      const onLoaded = (data: ImageBitmap) => {
        const texture = new CanvasTexture(data);
        validateTextureSize(texture.image.width, texture.image.height, texture);
        this.asset.data = texture;
        this.emit('loaded', this.asset);
      };

      loader.load(this.asset.src, onLoaded, this.onProgress, this.onError);
    } else {
      const loader = new TextureLoader();

      const onLoaded = (texture: Texture) => {
        this.asset.data = texture;
        this.emit('loaded', this.asset);
      };

      loader.load(this.asset.src, onLoaded, this.onProgress, this.onError);
    }
  };
}
