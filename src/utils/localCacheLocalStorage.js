/**
 * Store and retrieve data in a cache bin backed by localStorage.
 *
 * Use this instead of writing to localStorage directly in order to
 * make it easier to swap the storage system in the future if needed.
 *
 * This class provides a factory method for initializing new instances.
 *
 * @code
 * const cache = LocalCache.create('myCacheBin');
 * if (cache && cache.data === null) {
 *   // Get dyanmic data and populate cache.data.
 * }
 * return cache.data;
 * @endcode
 */
class LocalCache {
  /**
   * Initialize localStorage cache.
   *
   * @param {string} bin
   *   Name of the cache bin to use for data.
   */
  constructor(bin) {
    this.bin = `localCache_${bin}`;
    this.data =
      localStorage.getItem(this.bin) !== null
        ? JSON.parse(localStorage.getItem(this.bin))
        : null;
  }

  /**
   * Factory method to create a new LocalCache object.
   *
   * @param {string} bin
   *   The cache bin to use.
   * @return {boolean|LocalCache}
   *   False if we can't initialize the cache, otherwise a new LocalCache
   *   object.
   */
  // eslint-disable-next-line class-methods-use-this
  static create(bin) {
    // This isn't going to work at all if localStorage isn't defined.
    if (typeof localStorage === 'undefined') {
      return false;
    }

    return new LocalCache(bin);
  }

  /**
   * Get a specific item from the cache.
   * @param {string} itemId
   *   ID, or "key" of the value to return.
   *
   * @returns {*|null}
   */
  get(itemId) {
    return this.data[itemId] || null;
  }

  /**
   * Write a single key/value pair to the cache.
   *
   * @param {string} itemId
   *   Unique ID to use for the cached item.
   * @param {*} value
   *   Data to be cached. Must be compatible with JSON.stringify.
   */
  set(itemId, value) {
    this.data[itemId] = value;
    localStorage.setItem(this.bin, JSON.stringify(this.data));
  }

  /**
   * Bulk populate a cache bin.
   *
   * Useful for initializing a cache bin with a set of data retrieved
   * from the server.
   *
   * @param {array} data
   *   And array of key/value pairs to populate the cache bin with.
   */
  bulkAdd(data) {
    this.data = data;
    console.log('data ata data');
    localStorage.setItem(this.bin, JSON.stringify(this.data));
  }

  /**
   * Delete an item from the cache bin.
   *
   * @param {string} itemId
   *   ID of the item to delete.
   */
  delete(itemId) {
    const index = this.data.indexOf(itemId);
    if (index > -1) {
      this.data.splice(index, 1);
      localStorage.setItem(this.bin, JSON.stringify(this.data));
    }
  }

  /**
   * Destroy the cache bin.
   */
  destroy() {
    localStorage.removeItem(this.bin);
  }
}

export default LocalCache;
