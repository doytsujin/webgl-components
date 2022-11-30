import { VideoTexture } from 'three';
import Loader, { LoaderSettings } from './loader';
import LoaderManager from './loader-manager';

/**
 * Threejs Video Loader
 *
 * @export
 * @class ThreeVideoLoader
 * @extends {Loader}
 */
export default class ThreeVideoLoader extends Loader {
  load = (settings?: LoaderSettings, manager: LoaderManager = new LoaderManager('three-video-loader')) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    manager.add(this);

    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.src = this.asset.src;

    const onLoaded = () => {
      video.removeEventListener('canplaythrough', onLoaded);
      this.asset.data = new VideoTexture(video);
      this.emit('loaded', this.asset);
    };

    video.onerror = () => {
      this.onError(`code: ${video.error?.code} message: ${video.error?.message}`);
    };

    video.addEventListener('canplaythrough', onLoaded);
    video.play();
  };
}
