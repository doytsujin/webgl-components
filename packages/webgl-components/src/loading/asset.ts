export class AssetType {
  static Json = 'Json';
  static Image = 'Image';
  static FBX = 'FBX';
  static GLTF = 'GLTF';
  static Texture = 'Texture';
  static RgbeTexture = 'RgbeTexture';
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
  args?: Record<string, unknown>;
  data?: unknown;
  status?: LoadingStatus;
}

/**
 * Asset base class
 *
 * @export
 * @class Asset
 */
class Asset implements AssetConfig {
  id = '';
  src = '';
  type: AssetType = AssetType.Image;
  args: Record<string, unknown> = {};
  data: unknown;
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
