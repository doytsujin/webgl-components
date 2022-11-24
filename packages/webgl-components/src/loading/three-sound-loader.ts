import { Audio, AudioLoader, AudioListener } from 'three';
import Loader, { LoaderSettings } from './loader';
import LoaderManager from './loader-manager';

/**
 * Threejs Sound Loader
 *
 * @export
 * @class ThreeSoundLoader
 * @extends {Loader}
 */
export default class ThreeSoundLoader extends Loader {
  audioListener!: AudioListener;

  setAudioListener(audioListener: AudioListener) {
    this.audioListener = audioListener;
  }

  load = (settings?: LoaderSettings, manager: LoaderManager = new LoaderManager('three-sound-loader')) => {
    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    manager.add(this);

    if (!this.audioListener) {
      this.onError("audioListener hasn't been set");
      return;
    }

    const loader = new AudioLoader();
    const sound = new Audio(this.audioListener);

    const onLoaded = (buffer: AudioBuffer) => {
      sound.setBuffer(buffer);
      sound.setVolume(1);
      this.asset.data = sound;
      this.emit('loaded', this.asset);
    };

    loader.load(this.asset.src, onLoaded, this.onProgress, this.onError);
  };
}
