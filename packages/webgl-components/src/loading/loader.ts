import EventEmitter from 'eventemitter3';
import Asset from './asset';
import LoaderManager from './loader-manager';

export class LoadingEnvironment {
  static Worker = 'Worker';
  static Main = 'Main';
}

export type LoaderSettings = {
  id: string;
  preferWebWorker?: boolean;
  parallelLoads: number;
  environment?: LoadingEnvironment;
};

export const defaultLoaderSettings = {
  id: 'default',
  preferWebWorker: true,
  parallelLoads: 10,
  environment: LoadingEnvironment.Main
};

/**
 * Loader base class
 *
 * @export
 * @class Loader
 */
class Loader extends EventEmitter {
  asset!: Asset;
  assets: Array<Asset> = [];
  type = '';
  settings: LoaderSettings = defaultLoaderSettings;

  constructor(asset: Asset) {
    super();
    this.asset = asset;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  load = (_settings?: LoaderSettings, _manager?: LoaderManager) => {};
}

export default Loader;
