import EventEmitter from 'eventemitter3';
import Loader from './loader';

export default class LoaderManager extends EventEmitter {
  id: string = '';
  loaders: Array<Loader> = [];
  loaded: number = 0;
  progress: number = 0;
  total: number = 0;

  constructor(id: string) {
    super();
    this.id = id;
  }

  onProgress = () => {
    this.loaded++;
    this.progress = this.loaded / this.total;
    this.emit('progress', this.progress);
  };

  add(loader: Loader) {
    this.loaders.push(loader);
    this.total = this.loaders.length;
    loader.once('loaded', this.onProgress);
  }

  reset() {
    this.loaded = 0;
    this.progress = 0;
    this.loaders = [];
  }
}
