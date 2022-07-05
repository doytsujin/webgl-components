import EventEmitter from 'eventemitter3';
import Asset, { AssetType } from './asset';
import Loader from './loader';
import { ImageLoaderWorker } from './image-loader';

const defaultSettings = {
  id: 'default',
  parallelLoads: 10
};

export type LoaderSettings = {
  id: string;
  parallelLoads: number;
};

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
  settings: LoaderSettings = defaultSettings;
  loaderClasses = {
    [AssetType.Image]: ImageLoaderWorker
  };
  loaders: Array<Loader> = [];
  queue: number = 0;
  loaded: number = 0;
  total: number = 0;
  current: number = 0;

  constructor(settings: LoaderSettings = defaultSettings) {
    super();
    this.settings = Object.assign(this.settings, settings);
  }

  registerLoaders(loaders: LoaderClasses) {
    this.loaderClasses = Object.assign(this.loaderClasses, loaders);
  }

  /**
   * Load an array of assets
   *
   * @param {Asset[]} manifest
   * @memberof ParallelLoader
   */
  load = (manifest: Asset[]) => {
    this.loaders = [];
    manifest.forEach((asset) => {
      if (asset.args === undefined) asset.args = {};
      if (this.loaderClasses[asset.type as string] !== undefined) {
        const loader = new this.loaderClasses[asset.type as string](asset);
        this.loaders.push(loader);
      }
    });

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

  loadNextInQueue = () => {
    if (this.queue < this.total) {
      if (this.current < this.settings.parallelLoads) {
        const loader = this.loaders[this.queue];
        this.queue += 1;
        this.current += 1;
        loader.once('loaded', this.onLoaded);
        loader.once('error', this.onError);
        loader.load();
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
    this.emit('progress', this.loaded / this.total);
    if (this.loaded === this.total) {
      const assets: Array<Asset> = [];
      this.loaders.forEach((loader: Loader) => {
        assets.push(loader.asset);
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
