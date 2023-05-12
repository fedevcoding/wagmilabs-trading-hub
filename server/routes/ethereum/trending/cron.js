const { lruCache } = require("../../../services/cache/lru");
const { getTrendingData } = require("./utils");

async function refreshTrending() {
  const trendingData = await getTrendingData();

  const promises = trendingData.map(data =>
    lruCache(
      data,
      {
        key: `trendingCollections:${data.timeInterval}`,
        ttl: 20000,
      },
      true
    )
  );

  await Promise.all(promises);
  refreshTrending();
}

module.exports = { refreshTrending };
