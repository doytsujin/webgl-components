import { AssetType } from './asset';
import ParallelLoader from './parallel-loader';
// import JsonLoader from './json-loader';

const loader = new ParallelLoader();

// loader.registerLoaders({
//   [AssetType.Json]: JsonLoader
// });

function onMessage(event) {
  const onError = (response) => {
    loader.removeAllListeners();
    self.postMessage({ status: 'error', response });
  };
  const onProgress = (response) => {
    self.postMessage({ status: 'progress', response });
  };
  const onLoaded = (response) => {
    loader.removeAllListeners();
    self.postMessage({ status: 'loaded', response });
  };
  loader.once('error', onError);
  loader.on('progress', onProgress);
  loader.once('loaded', onLoaded);

  loader.settings.id = event.data.settings.id;
  loader.settings.parallelLoads = event.data.settings.parallelLoads;
  loader.load(event.data.assets);
}

self.addEventListener('message', onMessage);
