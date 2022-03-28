import { Texture, EquirectangularReflectionMapping } from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import Loader from './loader';
/**
 * Threejs texture loader
 *
 * @export
 * @class ThreeTextureLoader
 * @extends {Loader}
 */
export default class ThreeEnvironmentMapLoader extends Loader {
    load = () => {
        const loader = new RGBELoader();
        const onLoaded = (texture: Texture) => {
            texture.mapping = EquirectangularReflectionMapping;
            this.asset.data = texture;
            this.emit('loaded', this.asset);
        };

        const onProgress = () => { };

        const onError = () => {
            this.emit('error', `Failed to load ${this.asset.src}`);
        };

        loader.load(this.asset.src, onLoaded, onProgress, onError);
    };
}
