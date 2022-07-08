import Loader, { LoaderSettings } from './loader';
import LoaderManager from './loader-manager';

/**
 * Json loader
 *
 * @export
 * @class JsonLoader
 * @extends {Loader}
 */
export default class JsonLoader extends Loader {
  load = (settings?: LoaderSettings, manager: LoaderManager = new LoaderManager('json-loader')) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    manager.add(this);

    fetch(this.asset.src)
      .then((response) => response.json())
      .then((data: Record<string, unknown>) => {
        this.asset.data = data;
        this.emit('loaded', this.asset);
      })
      .catch(this.onError);
  };
}
