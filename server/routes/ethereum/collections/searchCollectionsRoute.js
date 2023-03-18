const express = require("express");
const { execReservoirApi } = require("../../../services/externalAPI/reservoirApi");

const searchCollectionsRoute = express();

searchCollectionsRoute.get("/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const { showAddresses } = req.query;

    if (!query) throw new Error("Missing query fields.");

    let type = "collection";
    if (query.startsWith("0x") && query.length === 42) {
      type = "address";
    } else if (query.endsWith(".eth")) {
      type = "ens";
    }

    let url;
    if (type === "collection") url = `https://api.reservoir.tools/search/collections/v1?name=${query}&limit=5`;
    else if (type === "address")
      url = `https://api.reservoir.tools/collections/v5?id=${query}&includeTopBid=false&includeAttributes=false&includeOwnerCount=false&normalizeRoyalties=false&useNonFlaggedFloorAsk=false&sortBy=allTimeVolume&limit=1`;

    const data = await execReservoirApi(url, true);
    const { collections } = data;

    let addresses = undefined;
    if (showAddresses === "true" && type === "address") {
      const apiData = await fetch(`https://api.opensea.io/api/v1/account/${query}`);
      const { data } = await apiData.json();
      console.log(data);
      const { profile_img_url, address } = data;
      addresses = [{ address, image: profile_img_url, isAddress: true, name: "Account" }];
    }

    if (addresses) collections.push(...addresses);

    res.status(200).json(collections);
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e, status: "error", ok: false });
  }
});

module.exports = searchCollectionsRoute;
