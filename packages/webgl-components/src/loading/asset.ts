export class AssetType {
  static Json: string = 'Json';
  static Image: string = 'Image';
  static FBX: string = 'FBX';
  static GLTF: string = 'GLTF';
  static Texture: string = 'Texture';
  static RgbeTexture: string = 'RgbeTexture';
}

export class LoadingStatus {
  static NotLoaded = 'NotLoaded';
  static Error = 'Error';
  static Loaded = 'Loaded';
}

export interface AssetConfig {
  id: string;
  src: string;
  type: AssetType;
  args?: Object;
  data?: Object;
  status?: LoadingStatus;
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
  status: LoadingStatus = LoadingStatus.NotLoaded;
  constructor(config: AssetConfig = { id: '', type: AssetType.Image, src: '', status: LoadingStatus.NotLoaded }) {
    Object.assign(this, config);
  }

  fromObject(obj: AssetConfig) {
    this.id = obj.id;
    this.src = obj.src;
    this.type = obj.type;
    if (obj.status) this.status = obj.status;
    if (obj.args) this.args = obj.args;
    if (obj.data) this.data = obj.data;
    return this;
  }
}

export default Asset;
