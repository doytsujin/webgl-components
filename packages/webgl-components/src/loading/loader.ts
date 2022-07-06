import EventEmitter from 'eventemitter3';
import Asset from './asset';

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
  type: string = '';
  settings: LoaderSettings = defaultLoaderSettings;

  constructor(asset: Asset) {
    super();
    this.asset = asset;
  }

  load = (settings?: LoaderSettings) => {};
}

export default Loader;
