export enum AssetType {
  Json,
  Image,
  FBX,
  GLTF,
  Texture,
  EnvironmentMap,
}

export interface AssetConfig {
  id: string;
  src: string;
  type: AssetType;
  args?: Object;
  data?: Object;
}

/**
 * Asset base class
 *
 * @export
 * @class Asset
 */
class Asset implements AssetConfig {
  id: string = '';
  src: string = '';
  type: AssetType = AssetType.Image;
  args: Object = {};
  data: Object = {};
  constructor(config: AssetConfig = { id: '', type: AssetType.Image, src: '' }) {
    Object.assign(this, config);
  }
}

export default Asset;
