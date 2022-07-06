import { LoadingStatus } from './asset';
import Loader, { LoaderSettings } from './loader';

/**
 * Json loader
 *
 * @export
 * @class JsonLoader
 * @extends {Loader}
 */
export default class JsonLoader extends Loader {
  load = (settings?: LoaderSettings) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    const req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState !== 4) return;
      if (req.readyState === 4 && req.status === 200) {
        this.asset.status = LoadingStatus.Loaded;
        this.asset.data = JSON.parse(req.responseText);
        this.emit('loaded', this.asset);
      } else {
        this.asset.status = LoadingStatus.Error;
        this.emit('error', req.status, `Failed to load ${this.asset.src}`);
      }
    };

    req.open('GET', this.asset.src, true);
    req.send();
  };
}
