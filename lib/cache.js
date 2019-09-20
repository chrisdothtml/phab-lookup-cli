const fs = require('fs')
const path = require('path')
const os = require('os')

const CACHE_PATH = path.join(os.homedir(), '.phabcache')

class Cache {
  readCache() {
    return pathExists(CACHE_PATH)
      ? new Map(JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8')))
      : new Map()
  }

  writeCache(cache) {
    fs.writeFileSync(CACHE_PATH, JSON.stringify([...cache.entries()]))
  }

  get(key) {
    return this.readCache().get(key)
  }

  set(key, value) {
    const cache = this.readCache()

    cache.set(key, value)
    this.writeCache(cache)
  }
}

function pathExists(input) {
  try {
    fs.accessSync(input)
    return true
  } catch (e) {
    return false
  }
}

function cacheFn(fn) {
  return async (...args) => {
    const key = `${fn.name}:${JSON.stringify(args)}`

    if (typeof cache.get(key) !== 'undefined') {
      return cache.get(key)
    } else {
      const result = await fn(...args)

      cache.set(key, result)
      return result
    }
  }
}

const cache = new Cache()
module.exports = {
  cache,
  cacheFn,
}
