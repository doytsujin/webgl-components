import EventEmitter from 'eventemitter3';
import Asset, { AssetType } from './asset';
import Loader, { LoaderSettings, defaultLoaderSettings } from './loader';
import ImageLoader from './image-loader';
import LoaderManager from './loader-manager';

export type LoaderClasses = {
  [key: string]: Loader;
};

/**
 * Parallel Loader loads an array of assets based on their asset types
 *
 * @export
 * @class ParallelLoader
 * @extends {EventEmitter}
 */
export default class ParallelLoader extends EventEmitter {
  settings: LoaderSettings = defaultLoaderSettings;
  loaderClasses = {
    [AssetType.Image]: ImageLoader
  };
  loaders: Array<Loader> = [];
  queue: number = 0;
  loaded: number = 0;
  total: number = 0;
  current: number = 0;
  manager!: LoaderManager;

  constructor(
    settings: LoaderSettings = defaultLoaderSettings,
    manager: LoaderManager = new LoaderManager('parallel-loader')
  ) {
    super();
    this.settings = Object.assign(this.settings, settings);
    this.manager = manager;
  }

  webWorkersSupported() {
    return !!window.Worker;
  }

  registerLoaders(loaders: LoaderClasses) {
    this.loaderClasses = Object.assign(this.loaderClasses, loaders);
  }

  createLoaders(manifest: Asset[]) {
    manifest.forEach((asset: Asset) => {
      if (asset.args === undefined) asset.args = {};
      if (this.loaderClasses[asset.type as string] !== undefined) {
        const loader = new this.loaderClasses[asset.type as string](asset);
        this.loaders.push(loader);
      } else {
        console.log(`No loader found for media type: ${asset.type} `);
      }
    });
  }

  /**
   * Load an array of assets
   *
   * @param {Asset[]} manifest
   * @memberof ParallelLoader
   */
  load = (manifest: Asset[]) => {
    this.loaders = [];
    this.createLoaders(manifest);
    this.loaded = 0;
    this.queue = 0;
    this.current = 0;
    this.total = this.loaders.length;

    if (this.total === 0) {
      this.emit('loaded', manifest);
    } else {
      this.loadNextInQueue();
    }
  };

  // Hook to implement custom logic based on the loader type
  nextInQueue(loader: Loader) {}

  loadNextInQueue = () => {
    if (this.queue < this.total) {
      if (this.current < this.settings.parallelLoads) {
        const loader = this.loaders[this.queue];
        this.queue += 1;
        this.current += 1;
        this.nextInQueue(loader);
        loader.once('loaded', this.onLoaded);
        loader.once('error', this.onError);
        loader.load(this.settings, this.manager);
        this.loadNextInQueue();
      }
    }
  };

  /**
   * Loaded handler
   *
   * @memberof ParallelLoader
   */
  onLoaded = () => {
    this.loaded += 1;
    this.emit('progress', this.loaded / this.total, this.loaded, this.total);
    if (this.loaded === this.total) {
      const assets: Array<Asset> = [];
      this.loaders.forEach((loader: Loader) => {
        if (!(loader.asset instanceof Asset)) {
          loader.asset = new Asset().fromObject(loader.asset);
        }
        if (loader.type === 'WorkerLoader') {
          assets.push(...loader.assets);
        } else {
          assets.push(loader.asset);
        }
      });
      this.emit('loaded', assets);
    } else {
      this.current -= 1;
      this.loadNextInQueue();
    }
  };

  /**
   * Error handler
   *
   * @param {string} error
   * @memberof ParallelLoader
   */
  onError = (error: string) => {
    this.emit('error', error);
  };
}
