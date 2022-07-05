import Loader from './loader';

/**
 * Image Loader
 *
 * @export
 * @class ImageLoader
 * @extends {Loader}
 */
export default class ImageLoader extends Loader {
  load = () => {
    const image = new Image();

    image.onload = () => {
      this.asset.data = image;
      this.emit('loaded', this.asset);
    };

    image.onerror = (error) => {
      this.emit('error', error, `Failed to load ${this.asset.src}`);
    };

    image.src = this.asset.src;
  };
}

/**
 * Image loader for web worker
 *
 * @export
 * @class ImageLoaderWorker
 * @extends {Loader}
 */
export class ImageLoaderWorker extends Loader {
  load = () => {
    const onError = (error: string) => {
      this.emit('error', error, `Failed to load ${this.asset.src}`);
    };
    fetch(this.asset.src)
      .then((response) => {
        response
          .blob()
          .then((blob) => {
            const type = blob.type.split('/')[1];
            if (/(gif|jpe?g|tiff?|png|webp)$/i.test(type)) {
              this.asset.data = URL.createObjectURL(blob);
              this.emit('loaded', this.asset);
            } else {
              onError(`Image type not supported: ${type}`);
            }
          })
          .catch(onError);
      })
      .catch(onError);
  };
}
