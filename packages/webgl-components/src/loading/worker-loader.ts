import Asset, { AssetType } from './asset';
import AssetLoader from './asset-loader.worker';
import Loader, { LoaderSettings } from './loader';

const loader = new AssetLoader();

const compatibleLoaders = [AssetType.Image];

/**
 * Worker loader
 *
 * @export
 * @class WorkerLoader
 * @extends {Loader}
 */
export default class WorkerLoader extends Loader {
  type = 'WorkerLoader';

  constructor(assets: Array<Asset> = []) {
    super(new Asset());
    this.assets = assets;
  }

  supports(type: AssetType) {
    return compatibleLoaders.includes(type as string);
  }

  addAsset(asset: Asset) {
    this.assets.push(asset);
  }

  load = (settings?: LoaderSettings) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    function onProgress(progress: number) {}

    const onError = (error: ErrorEvent) => {
      loader.removeEventListener('message', onMessage);
      this.emit('error', error, `Failed to load ${this.asset.src}`);
    };

    const onLoaded = (data: Asset[]) => {
      loader.removeEventListener('message', onMessage);
      this.assets = data;
      this.emit('loaded', this.assets);
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
      settings: this.settings,
      assets: this.assets
    });
  };
}
