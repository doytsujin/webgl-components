import Asset, { AssetType } from './asset';
import AssetLoader from './asset-loader.worker';
import Loader, { LoaderSettings } from './loader';
import LoaderManager from './loader-manager';

const loader = new AssetLoader();

const compatibleLoaders = [AssetType.Image, AssetType.Json];

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

  load = (settings?: LoaderSettings, manager: LoaderManager = new LoaderManager('worker-loader')) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    // Work around
    const loaders: Array<Loader> = [];
    for (let i = 0; i < this.assets.length; i++) {
      const loader = new Loader(new Asset());
      manager.add(loader);
      loaders.push(loader);
    }

    const onProgress = (loaded: number) => {
      loaders[loaded - 1].emit('loaded');
    };

    const onError = (error: ErrorEvent) => {
      loader.removeEventListener('message', onMessage);
      this.onError(error);
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
          onProgress(event.data.loaded);
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
