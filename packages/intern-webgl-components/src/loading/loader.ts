import EventEmitter from 'eventemitter3';
import Asset from './asset';

/**
 * Loader base class
 *
 * @export
 * @class Loader
 */
class Loader extends EventEmitter {
  asset: Asset;
  constructor(asset: Asset) {
    super();
    this.asset = asset;
  }
  load = () => {};
}

export default Loader;
