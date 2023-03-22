const express = require("express");
const { parseEther } = require("../../../../client/wagmilabsTradingTool/src/utils/formats/formats");
const checkAuth = require("../../../middleware/checkAuth");
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose");
const MODULE_API_KEY = process.env.MODULE_API_KEY;

const profileActivityRoute = express();

function toBool(value) {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  } else {
    return false;
  }
}
const type1Query = (includeSale, includeBuy, userAddress) => {
  if (includeSale && includeBuy) {
    return `WHERE (buyer_address = '${userAddress}' OR seller_address = '${userAddress}')`;
  } else if (includeSale && !includeBuy) {
    return `WHERE (seller_address = '${userAddress}')`;
  } else if (!includeSale && includeBuy) {
    return `WHERE (buyer_address = '${userAddress}')`;
  } else {
    return `WHERE (buyer_address = '')`;
  }
};
const type2Query = (includeMint, includeBurn, includeSend, includeReceive, userAddress) => {
  if (includeMint && includeBurn && includeSend && includeReceive) {
    return `WHERE ((to_address = '${userAddress}' AND from_address IS NULL) OR (from_address = '${userAddress}' AND to_address IS NULL) OR (from_address = '${userAddress}' OR to_address = '${userAddress}'))`;
  } else if (includeMint && includeBurn && includeSend && !includeReceive) {
    return `WHERE ((to_address = '${userAddress}' AND from_address IS NULL) OR (from_address = '${userAddress}' AND to_address IS NULL) OR (from_address = '${userAddress}'))`;
  } else if (includeMint && includeBurn && !includeSend && includeReceive) {
    return `WHERE ((to_address = '${userAddress}' AND from_address IS NULL) OR (from_address = '${userAddress}' AND to_address IS NULL) OR (to_address = '${userAddress}'))`;
  } else if (includeMint && !includeBurn && includeSend && includeReceive) {
    return `WHERE ((to_address = '${userAddress}' AND from_address IS NULL) OR ((from_address = '${userAddress}' AND to_address IS NOT NULL) OR to_address = '${userAddress}'))`;
  } else if (!includeMint && includeBurn && includeSend && includeReceive) {
    return `WHERE ((from_address = '${userAddress}' AND to_address IS NULL) OR (from_address = '${userAddress}' OR (to_address = '${userAddress}' AND from_address IS NOT NULL)))`;
  } else if (includeMint && includeBurn && !includeSend && !includeReceive) {
    return `WHERE ((to_address = '${userAddress}' AND from_address IS NULL) OR (from_address = '${userAddress}' AND to_address IS NULL))`;
  } else if (includeMint && !includeBurn && includeSend && !includeReceive) {
    return `WHERE ((to_address = '${userAddress}' AND from_address IS NULL) OR (from_address = '${userAddress}' AND to_address IS NOT NULL))`;
  } else if (includeMint && !includeBurn && !includeSend && includeReceive) {
    return `WHERE ((to_address = '${userAddress}' AND from_address IS NULL) OR (to_address = '${userAddress}'))`;
  } else if (!includeMint && includeBurn && includeSend && !includeReceive) {
    return `WHERE ((from_address = '${userAddress}' AND to_address IS NULL) OR (from_address = '${userAddress}'))`;
  } else if (!includeMint && includeBurn && !includeSend && includeReceive) {
    return `WHERE ((from_address = '${userAddress}' AND to_address IS NULL) OR (to_address = '${userAddress}' AND from_address IS NOT NULL))`;
  } else if (!includeMint && !includeBurn && includeSend && includeReceive) {
    return `WHERE (from_address = '${userAddress}' OR to_address = '${userAddress}' AND from_address IS NOT NULL AND to_address IS NOT NULL)`;
  } else if (includeMint && !includeBurn && !includeSend && !includeReceive) {
    return `WHERE (to_address = '${userAddress}' AND from_address IS NULL)`;
  } else if (!includeMint && includeBurn && !includeSend && !includeReceive) {
    return `WHERE (from_address = '${userAddress}' AND to_address IS NULL)`;
  } else if (!includeMint && !includeBurn && includeSend && !includeReceive) {
    return `WHERE (from_address = '${userAddress}' AND to_address IS NOT NULL)`;
  } else if (!includeMint && !includeBurn && !includeSend && includeReceive) {
    return `WHERE (to_address = '${userAddress}' AND from_address IS NOT NULL)`;
  } else {
    return `WHERE to_address = ''`;
  }
};
const address1Query = (fromAddress, toAddress) => {
  if (fromAddress && toAddress) {
    return `AND (buyer_address = '${fromAddress}' OR seller_address = '${toAddress}')`;
  } else if (fromAddress && !toAddress) {
    return `AND buyer_address = '${fromAddress}'`;
  } else if (!fromAddress && toAddress) {
    return `AND seller_address = '${toAddress}'`;
  } else {
    return ``;
  }
};
const address2Query = (fromAddress, toAddress) => {
  if (fromAddress && toAddress) {
    return `AND (from_address = '${fromAddress}' OR to_address = '${toAddress}')`;
  } else if (fromAddress && !toAddress) {
    return `AND from_address = '${fromAddress}'`;
  } else if (!fromAddress && toAddress) {
    return `AND to_address = '${toAddress}'`;
  } else {
    return ``;
  }
};
const priceQuery = (minPrice, maxPrice) => {
  if (minPrice && maxPrice) {
    return `AND (eth_price >= '${minPrice}' AND eth_price <= '${maxPrice}')`;
  } else if (minPrice && !maxPrice) {
    return `AND (eth_price >= '${minPrice}')`;
  } else if (!minPrice && maxPrice) {
    return `AND (eth_price <= '${maxPrice}')`;
  } else {
    return ``;
  }
};
const marketplaceQuery = marketplace => {
  if (marketplace) {
    return `AND exchange_name = '${marketplace}'`;
  } else {
    return ``;
  }
};
const tokenIdQuery = tokenId => {
  if (tokenId) {
    return `AND token_id = '${tokenId}'`;
  } else {
    return ``;
  }
};
const contractQuery = contractAddress => {
  if (contractAddress) {
    return `AND contract_address = '${contractAddress}'`;
  } else {
    return ``;
  }
};

const dateQuery = (startDate, endDate) => {
  if (startDate) startDate = new Date(parseInt(startDate)).toISOString();
  if (endDate) endDate = new Date(parseInt(endDate)).toISOString();

  if (startDate && endDate) {
    return `AND (timestamp >= '${startDate}' AND timestamp <= '${endDate}')`;
  } else if (startDate && !endDate) {
    return `AND (timestamp >= '${startDate}')`;
  } else if (!startDate && endDate) {
    return `AND (timestamp <= '${endDate}')`;
  } else {
    return ``;
  }
};

profileActivityRoute.get("/", checkAuth, async (req, res) => {
  try {
    const userAddress = req.query?.address || req.userDetails?.address;

    let {
      includeMint,
      includeBurn,
      includeSend,
      includeReceive,
      includeBuy,
      includeSale,
      includeList,
      fromAddress: oldFrom,
      toAddress: oldTo,
      minPrice,
      maxPrice,
      marketplace,
      tokenId,
      contractAddress,
      startDate,
      endDate,
      offset1,
      offset2,
      offset3,
    } = req.query || {};

    includeMint = toBool(includeMint);
    includeBurn = toBool(includeBurn);
    includeSend = toBool(includeSend);
    includeReceive = toBool(includeReceive);
    includeBuy = toBool(includeBuy);
    includeSale = toBool(includeSale);
    includeList = toBool(includeList);

    const fromAddress = oldTo;
    const toAddress = oldFrom;

    const listingsLimit = 20;
    let onChainLimit = 25;

    if ((includeMint || includeBurn || includeSend || includeReceive) && (includeBuy || includeSale)) {
      onChainLimit = 20;
    }

    const SQL = `WITH sales AS (
            SELECT *
            FROM (
                SELECT 
                    CASE
                        WHEN buyer_address = '${userAddress}' THEN 'buy'
                        ELSE 'sale'
                    END AS type,
                token_id, contract_address, timestamp AS createdAt, buyer_address  AS from_address, seller_address AS to_address, transaction_hASh, quantity, exchange_name AS marketplace, eth_price AS price, payment_token_address AS payment_token
        
        
                FROM ethereum.nft_sales

                ${type1Query(includeSale, includeBuy, userAddress)}

                ${marketplaceQuery(marketplace)}
                ${tokenIdQuery(tokenId)}
                ${priceQuery(minPrice, maxPrice)}
                ${address1Query(fromAddress, toAddress)}
                ${contractQuery(contractAddress)}
                ${dateQuery(startDate, endDate)}
                ORDER BY timestamp DESC
                LIMIT ${onChainLimit}
                ${offset1 ? `OFFSET '${offset1}'` : ``}
            ) subq
        
            UNION
        
            SELECT *
            FROM (
                SELECT 
                    CASE 
                        WHEN to_address = '${userAddress}' AND from_address IS NULL THEN 'mint'
                        WHEN from_address = '${userAddress}' AND to_address IS NULL THEN 'burn'
                        WHEN from_address = '${userAddress}' THEN 'send'
                        ELSE 'receive'
                    END AS type,
                    token_id, contract_address, timestamp AS createdAt, from_address AS from_address, to_address AS to_address, transaction_hASh, quantity,'' AS marketplace, 0 AS price, '0x0000000000000000000000000000000000000000' AS payment_token
                FROM ethereum.nft_transfers

                ${type2Query(includeMint, includeBurn, includeSend, includeReceive, userAddress)}
                ${tokenIdQuery(tokenId)}            
                ${address2Query(fromAddress, toAddress)}
                ${contractQuery(contractAddress)}
                ${dateQuery(startDate, endDate)}

                ORDER BY timestamp DESC
                LIMIT ${onChainLimit}
                ${offset2 ? `OFFSET '${offset2}'` : ``}
            ) subq
        
        
        )
        SELECT
            type,
            token_id,
            contract_address,
            createdAt,
            from_address,
            to_address,
            transaction_hash,
            quantity,
            marketplace,
            CASE WHEN sales.type::text = 'mint' AND price = 0 THEN value / count / POWER(10, 18) ELSE price END AS price,
            payment_token
        FROM sales
        CROSS JOIN LATERAL (
            SELECT value
            FROM ethereum.transactions t
            WHERE t.transaction_hash = sales.transaction_hash) AS tx
        CROSS JOIN LATERAL (
            SELECT
                COUNT(transaction_hash) AS count
            FROM sales s
            WHERE s.transaction_hash = sales.transaction_hash) AS tx_count
        `;
    const onChainActivity =
      includeBurn || includeBuy || includeMint || includeReceive || includeSale || includeSend
        ? await execTranseposeAPI(SQL)
        : [];

    const { listingsData, hasMoreListings } = await getListingData(
      includeList,
      fromAddress,
      toAddress,
      userAddress,
      minPrice,
      maxPrice,
      marketplace,
      tokenId,
      contractAddress,
      startDate,
      endDate,
      listingsLimit,
      offset3
    );
    const rawActivity = [...onChainActivity, ...listingsData].sort(
      (a, b) =>
        new Date(b.createdAt ? b.createdAt : b.createdat).getTime() -
        new Date(a.createdAt ? a.createdAt : a.createdat).getTime()
    );

    let hasMoreActivity = false;
    if (onChainActivity.length > 20 || hasMoreListings) hasMoreActivity = true;

    const activity = rawActivity.splice(0, 20);

    const newOffset1 = parseInt(offset1) + activity.filter(a => a.type === "sale" || a.type === "buy").length;
    const newOffset2 =
      parseInt(offset2) +
      activity.filter(a => a.type === "mint" || a.type === "burn" || a.type === "send" || a.type === "receive").length;
    const newOffset3 = parseInt(offset3) + listingsData?.length;

    if (includeBurn || includeBuy || includeMint || includeReceive || includeSale || includeSend)
      await addTokenData(activity);

    res.status(200).json({ ok: true, activity, newOffset1, newOffset2, newOffset3, hasMoreActivity });
  } catch (e) {
    console.log(e);
    res.status(400).json({ ok: false });
  }
});

async function getListingData(
  includeList,
  fromAddress,
  toAddress,
  userAddress,
  minPrice,
  maxPrice,
  marketplace,
  tokenId,
  contractAddress,
  startDate,
  endDate,
  listingsLimit,
  offset3
) {
  try {
    let listingsData = [];
    let hasMoreListings = false;

    if (
      includeList &&
      !toAddress &&
      (!marketplace || marketplace === "opensea" || marketplace === "looksrare" || marketplace === "x2y2")
    ) {
      if (!(fromAddress && fromAddress !== userAddress)) {
        const minWeiPrice = minPrice && parseEther(minPrice, true);
        const maxWeiPrice = maxPrice && parseEther(maxPrice, true);

        const getMinMaxFilter = () => {
          if (minWeiPrice && maxWeiPrice) {
            return `&minPrice=${minWeiPrice}&maxPrice=${maxWeiPrice}`;
          } else if (minWeiPrice && !maxWeiPrice) {
            return `&minPrice=${minWeiPrice}`;
          } else if (maxWeiPrice && !minWeiPrice) {
            return `&maxPrice=${maxWeiPrice}`;
          } else {
            return ``;
          }
        };
        const getMarketplaceFilter = () => {
          return marketplace ? `&marketplace=${marketplace}` : ``;
        };
        const getTokenIdFilter = () => {
          return tokenId ? `&tokenId=${tokenId}` : ``;
        };
        const getContractFilter = () => {
          return contractAddress ? `&contractAddress=${contractAddress}` : ``;
        };
        const getDateFilter = () => {
          if (startDate) startDate = startDate / 1000;
          if (endDate) endDate = endDate / 1000;
          if (startDate && endDate) {
            return `&listedAfter=${startDate}&listedBefore=${endDate}`;
          } else if (startDate && !endDate) {
            return `&listedAfter=${startDate}`;
          } else if (endDate && !startDate) {
            return `&listedAfter=1580489577000&listedBefore=${endDate}`;
          } else {
            return `&listedAfter=1580489577000`;
          }
        };

        const minMaxFilter = getMinMaxFilter();
        const marketplaceFilter = getMarketplaceFilter();
        const tokenIdFilter = getTokenIdFilter();
        const contractFilter = getContractFilter();
        const dateFilter = getDateFilter();

        const listingsApiData = await fetch(
          `https://api.modulenft.xyz/api/v2/eth/nft/listings?active=true${dateFilter}&count=${
            listingsLimit + 1
          }&offset=${offset3}&sortDirection=timeDesc&seller=${userAddress}&withMetadata=false${minMaxFilter}${marketplaceFilter}${tokenIdFilter}${contractFilter}`,
          {
            headers: {
              "X-API-KEY": MODULE_API_KEY,
            },
          }
        );
        const listingDataResult = await listingsApiData.json();

        listingsData = listingDataResult?.data ? listingDataResult.data : [];

        if (listingsData.length > listingsLimit) hasMoreListings = true;
        else hasMoreListings = false;

        listingsData = listingsData.slice(0, listingsLimit);

        listingsData?.forEach(item => {
          item["type"] = "list";
          item["from_address"] = userAddress;
          item["price"] = parseEther(item.price, false);
          item["token_id"] = item.tokenId;
          item["tokenData"] = {
            token: {
              name: item?.tokenName || item?.metadata?.name,
              image: item?.metadata?.image,
              collection: { name: item?.collection },
            },
          };
        });
      }
    }

    return { listingsData, hasMoreListings };
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function addTokenData(activity) {
  try {
    let urlData = "";
    activity.forEach(item => {
      if (item.type === "list") return;
      const { token_id, contract_address } = item;
      const tokenId = BigInt(token_id).toString();
      const urlType = `&tokens=${contract_address}:${tokenId}`;
      urlData = urlData + urlType;
    });

    const reservoirApiData = await fetch(
      `https://api.reservoir.tools/tokens/v5?limit=20&includeAttributes=false${urlData}`,
      {
        headers: {
          "x-api-key": process.env.RESERVOIR_API_KEY,
        },
      }
    );
    const reservoirData = (await reservoirApiData.json())?.tokens;

    activity.forEach(item => {
      const { token_id, contract_address, type } = item;
      if (type === "list") return;
      const tokenData = reservoirData?.find(
        token =>
          token.token.contract.toLowerCase() === contract_address.toLowerCase() && token.token.tokenId == token_id
      );
      item["tokenData"] = tokenData;
      item["createdAt"] = item.createdat;
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = profileActivityRoute;
