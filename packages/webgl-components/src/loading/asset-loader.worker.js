import { LoadingEnvironment } from './loader';
import ParallelLoader from './parallel-loader';

const loader = new ParallelLoader();

function onMessage(event) {
  const onError = (response) => {
    loader.removeAllListeners();
    self.postMessage({ status: 'error', response });
  };
  const onProgress = (progress, loaded) => {
    self.postMessage({ status: 'progress', progress, loaded });
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
  loader.settings.environment = LoadingEnvironment.Worker;
  loader.load(event.data.assets);
}

self.addEventListener('message', onMessage);
