const { lruCache } = require("../../../services/cache/lru");
const { getTrendingData } = require("./utils");

const times = [60000, 120000, 300000, 600000, 1800000, 3600000, 14400000, 43200000, 86400000, 604800000];

async function refreshTrending() {
  let promises = [];
  for (let i = 0; i < times.length; i++) {
    const time = times[i];

    promises.push(
      lruCache(
        getTrendingData(time),
        {
          key: `trendingCollections:${time}`,
          ttl: 20000,
        },
        true
      )
    );
  }
  await Promise.all(promises);
  refreshTrending();
}

module.exports = { refreshTrending };
