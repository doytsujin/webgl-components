import Asset from './asset';

export type Assets = {
  [propName: string]: Array<Asset>;
};

/**
 * Asset manager's purpose is to store loaded assets by the AssetLoader
 * Assets can be retrived by using the get() function
 *
 * @class AssetManager
 */
class AssetManager {
  assets: Assets = {};

  /**
   * Add an asset group
   *
   * @param {String} group
   * @param {Asset[]} assets
   * @memberof AssetManager
   */
  add(group: string, assets: Asset[]) {
    this.assets[group] = this.assets[group] || [];
    const tmp = [];
    // Ensure assets we add are Asset types,
    // otherwise 'get' won't return any assets we search for
    for (let i = 0; i < assets.length; i++) {
      if (!(assets[i] instanceof Asset)) {
        tmp.push(new Asset().fromObject(assets[i]));
      } else {
        tmp.push(assets[i]);
      }
    }
    this.assets[group].push(...tmp);
  }

  /**
   * Retrieve an asset by id
   *
   * @param {String} groupId
   * @param {String} id
   * @param {Boolean} [all=false]
   * @returns
   * @memberof AssetManager
   */
  get(groupId: string, id: string): boolean | Asset {
    const asset = this.find(this.assets[groupId], id);
    if (asset && asset instanceof Asset) {
      return asset;
    }
    return false;
  }

  /**
   * Find an asset by id
   *
   * @param {Asset[]} assets
   * @param {String} id
   * @returns
   * @memberof AssetManager
   */
  find(assets: Asset[], id: string): boolean | Asset {
    return assets.find((asset) => asset.id === id) || false;
  }

  /**
   * Clear assets
   *
   * @memberof AssetManager
   */
  dispose() {
    this.assets = {};
  }
}

export default AssetManager;
