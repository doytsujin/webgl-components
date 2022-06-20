export class AssetType {
  static Json: string = 'Json';
  static Image: string = 'Image';
  static FBX: string = 'FBX';
  static GLTF: string = 'GLTF';
  static Texture: string = 'Texture';
  static RgbeTexture: string = 'RgbeTexture';
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
