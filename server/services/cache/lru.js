const LRU = require("lru-cache");

const lru = new LRU({ max: 500 });

// It returns  Promise<T>
const lruCache = (p, { key, ttl }, force = false) => {
  const cache = lru.get(key);
  if (cache && !force) return Promise.resolve(cache);
  return p.then((res) => {
    lru.set(key, res, { ttl });
    return res;
  });
};

module.exports = {
  lruCache,
};
