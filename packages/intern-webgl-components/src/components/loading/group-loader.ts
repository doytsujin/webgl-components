import EventEmitter from 'eventemitter3';
import detect from '@jam3/detect';
import Loader from './loader';
import ImageLoader from './image-loader';
import JsonLoader from './json-loader';
import ThreeTextureLoader from './three-texture-loader';
import ThreeFBXLoader from './three-fbx-loader';
import ThreeGLTFLoader from './three-gltf-loader';
import Asset, { AssetType } from './asset';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const LOADERS = {
  [AssetType.Image]: ImageLoader,
  [AssetType.Json]: JsonLoader,
  [AssetType.Texture]: ThreeTextureLoader,
  [AssetType.FBX]: ThreeFBXLoader,
  [AssetType.GLTF]: ThreeGLTFLoader
};

export type LoaderSettings = {
  id: string;
  minParallel: number;
  maxParallel: number;
};

const defaultSettings = {
  id: 'default',
  minParallel: 5,
  maxParallel: 10
};

/**
 * Group loader loads an array of assets based on their asset types
 *
 * @export
 * @class GroupLoader
 * @extends {EventEmitter}
 */
export default class GroupLoader extends EventEmitter {
  id: string = '';
  parallelLoads: number;
  settings: LoaderSettings = defaultSettings;
  loaders: Array<Loader> = [];
  queue: number = 0;
  loaded: number = 0;
  currentParallel: number = 0;
  total: number = 0;
  dracoLoader?: DRACOLoader;

  constructor(settings: LoaderSettings = defaultSettings) {
    super();
    this.settings = Object.assign(this.settings, settings);
    this.parallelLoads = detect.device.desktop ? this.settings.maxParallel : this.settings.minParallel;
  }

  setDracoLoader(dracoLoader: DRACOLoader) {
    this.dracoLoader = dracoLoader;
  }

  /**
   * Load an array of assets
   *
   * @param {Asset[]} manifest
   * @memberof GroupLoader
   */
  load = (manifest: Asset[]) => {
    this.loaders = [];
    manifest.forEach((asset, i) => {
      if (asset.args === undefined) asset.args = {};
      if (LOADERS[asset.type] !== undefined) {
        const loader = new LOADERS[asset.type](asset);
        this.loaders.push(loader);
        if (loader instanceof ThreeGLTFLoader && this.dracoLoader) {
          loader.setDracoLoader(this.dracoLoader);
        }
      }
    });

    this.loaded = 0;
    this.queue = 0;
    this.currentParallel = 0;
    this.total = this.loaders.length;

    if (this.total === 0) {
      this.emit('loaded', manifest);
    } else {
      this.loadNextInQueue();
    }
  };

  /**
   * Load the next in queue
   *
   * @memberof GroupLoader
   */
  loadNextInQueue = () => {
    if (this.queue < this.total) {
      if (this.currentParallel < this.parallelLoads) {
        const loader = this.loaders[this.queue];
        this.queue += 1;
        this.currentParallel += 1;
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
   * @memberof GroupLoader
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
      this.currentParallel -= 1;
      this.loadNextInQueue();
    }
  };

  /**
   * Error handler
   *
   * @param {string} error
   * @memberof GroupLoader
   */
  onError = (error: string) => {
    this.emit('error', error);
  };
}
