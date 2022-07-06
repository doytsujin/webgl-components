import EventEmitter from 'eventemitter3';
import Asset from './asset';

export class LoadingEnvironment {
  static Worker = 'Worker';
  static Main = 'Main';
}

/**
 * Loader base class
 *
 * @export
 * @class Loader
 */
class Loader extends EventEmitter {
  asset: Asset;
  assets: Array<Asset> = [];

  constructor(asset: Asset) {
    super();
    this.asset = asset;
  }

  load = (preferWebWorker: boolean, environment: LoadingEnvironment) => {};
}

export default Loader;
