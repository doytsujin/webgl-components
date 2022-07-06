import Asset from './asset';
import AssetLoader from './asset-loader.worker';
import Loader from './loader';

const loader = new AssetLoader();

/**
 * Worker loader
 *
 * @export
 * @class WorkerLoader
 * @extends {Loader}
 */
export default class WorkerLoader extends Loader {
  constructor(assets: Array<Asset>) {
    super(new Asset());
    this.assets = assets;
  }

  load = (preferWebWorker: boolean) => {
    function onProgress(progress: number) {}

    const onError = (error: ErrorEvent) => {
      loader.removeEventListener('message', onMessage);
      this.emit('error', error, `Failed to load ${this.asset.src}`);
    };

    const onLoaded = (data: Asset[]) => {
      loader.removeEventListener('message', onMessage);
      this.asset.data = data;
      this.emit('loaded', this.asset);
    };

    const onMessage = (event: MessageEvent) => {
      switch (event.data.status) {
        case 'error':
          onError(event.data.response);
          break;
        case 'progress':
          onProgress(event.data.response);
          break;
        case 'loaded':
          onLoaded(event.data.response);
          break;
        default:
          break;
      }
    };

    loader.addEventListener('message', onMessage);
    loader.postMessage({
      settings: {
        id: 'worker',
        parallelLoads: 10
      },
      assets: this.assets
    });
  };
}
