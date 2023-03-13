const express = require("express");

const listingChartRoute = express();

listingChartRoute.get("/listings", async (req, res) => {
  try {
    const { collectionAddress, window } = req.query;

    if (!collectionAddress) throw new Error("Collection address is required");

    const response = await fetch(
      "https://try.readme.io/https://api.nftbank.run/v1/collection/0x5b874b0396b080030bda2da2c83756d6300c8347/market-status/listing/history?networkId=ethereum&interval=daily&window=1d&limit=90",
      {
        headers: {
          accept: "application/json",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,it;q=0.7",
          "sec-ch-ua": '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "x-api-key": "test-api-key",
          "x-readme-api-explorer": "4.350.0",
        },
        referrer: "https://developer.nftbank.ai/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "omit",
      }
    );
    console.log(response);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = listingChartRoute;
