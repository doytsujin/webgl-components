import Loader, { LoadingEnvironment } from './loader';

/**
 * Image Loader
 *
 * @export
 * @class ImageLoader
 * @extends {Loader}
 */
export default class ImageLoader extends Loader {
  load = (preferWebWorker: boolean, environment: LoadingEnvironment) => {
    const onError = (error: string | Event) => {
      this.emit('error', error, `Failed to load ${this.asset.src}`);
    };

    if (environment === LoadingEnvironment.Worker && preferWebWorker) {
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
                onError(`Image type not supported: ${type}`);
              }
            })
            .catch(onError);
        })
        .catch(onError);
    } else {
      const image = new Image();

      image.onload = () => {
        this.asset.data = image;
        this.emit('loaded', this.asset);
      };
      image.onerror = onError;
      image.src = this.asset.src;
    }
  };
}
