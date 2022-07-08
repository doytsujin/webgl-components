import Loader, { LoaderSettings, LoadingEnvironment } from './loader';
import LoaderManager from './loader-manager';

/**
 * Image Loader
 *
 * @export
 * @class ImageLoader
 * @extends {Loader}
 */
export default class ImageLoader extends Loader {
  load = (settings?: LoaderSettings, manager: LoaderManager = new LoaderManager('image-loader')) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    manager.add(this);

    if (this.settings.environment === LoadingEnvironment.Worker && this.settings.preferWebWorker) {
      fetch(this.asset.src)
        .then((response) => {
          response
            .blob()
            .then((blob: Blob) => {
              const type = blob.type.split('/')[1];
              if (/(gif|jpe?g|tiff?|png|webp)$/i.test(type)) {
                this.asset.data = URL.createObjectURL(blob);
                this.emit('loaded', this.asset);
              } else {
                this.onError(`Image type not supported: ${type}`);
              }
            })
            .catch(this.onError);
        })
        .catch(this.onError);
    } else {
      const image = new Image();

      image.onload = () => {
        this.asset.data = image;
        this.emit('loaded', this.asset);
      };
      image.onerror = this.onError;
      image.src = this.asset.src;
    }
  };
}
