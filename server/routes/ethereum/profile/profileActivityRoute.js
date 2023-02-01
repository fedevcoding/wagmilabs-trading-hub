const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose")


const profileActivityRoute = express()



function toBool(value) {
    if (value === 'true') {
        return true
    } else if (value === 'false') {
        return false
    } else {
        return false
    }
}
const type1Query = (includeSale, includeBuy, userAddress) => {
    if (includeSale && includeBuy) {
        return `WHERE (buyer_address = '${userAddress}' OR seller_address = '${userAddress}')`
    } else if (includeSale && !includeBuy) {
        return `WHERE (seller_address = '${userAddress}')`
    } else if (!includeSale && includeBuy) {
        return `WHERE (buyer_address = '${userAddress}')`
    } else {
        return `WHERE (buyer_address = '')`
    }
}
const type2Query = (includeMint, includeBurn, includeSend, includeReceive, userAddress) => {
    if (includeMint && includeBurn && includeSend && includeReceive) {
        return `WHERE ((to_address = '${userAddress}' AND from_address IS NULL) OR (from_address = '${userAddress}' AND to_address IS NULL) OR (from_address = '${userAddress}' OR to_address = '${userAddress}'))`
    } else if (includeMint && includeBurn && includeSend && !includeReceive) {
        return `WHERE ((to_address = '${userAddress}' AND from_address IS NULL) OR (from_address = '${userAddress}' AND to_address IS NULL) OR (from_address = '${userAddress}'))`
    } else if (includeMint && includeBurn && !includeSend && includeReceive) {
        return `WHERE ((to_address = '${userAddress}' AND from_address IS NULL) OR (from_address = '${userAddress}' AND to_address IS NULL) OR (to_address = '${userAddress}'))`
    } else if (includeMint && !includeBurn && includeSend && includeReceive) {
        return `WHERE ((to_address = '${userAddress}' AND from_address IS NULL) OR (from_address = '${userAddress}' OR to_address = '${userAddress}'))`
    } else if (!includeMint && includeBurn && includeSend && includeReceive) {
        return `WHERE ((from_address = '${userAddress}' AND to_address IS NULL) OR (from_address = '${userAddress}' OR to_address = '${userAddress}'))`
    } else if (includeMint && includeBurn && !includeSend && !includeReceive) {
        return `WHERE ((to_address = '${userAddress}' AND from_address IS NULL) OR (from_address = '${userAddress}' AND to_address IS NULL))`
    } else if (includeMint && !includeBurn && includeSend && !includeReceive) {
        return `WHERE ((to_address = '${userAddress}' AND from_address IS NULL) OR (from_address = '${userAddress}'))`
    } else if (includeMint && !includeBurn && !includeSend && includeReceive) {
        return `WHERE ((to_address = '${userAddress}' AND from_address IS NULL) OR (to_address = '${userAddress}'))`
    } else if (!includeMint && includeBurn && includeSend && !includeReceive) {
        return `WHERE ((from_address = '${userAddress}' AND to_address IS NULL) OR (from_address = '${userAddress}'))`
    } else if (!includeMint && includeBurn && !includeSend && includeReceive) {
        return `WHERE ((from_address = '${userAddress}' AND to_address IS NULL) OR (to_address = '${userAddress}'))`
    } else if (!includeMint && !includeBurn && includeSend && includeReceive) {
        return `WHERE (from_address = '${userAddress}' OR to_address = '${userAddress}')`
    } else if (includeMint && !includeBurn && !includeSend && !includeReceive) {
        return `WHERE (to_address = '${userAddress}' AND from_address IS NULL)`
    } else if (!includeMint && includeBurn && !includeSend && !includeReceive) {
        return `WHERE (from_address = '${userAddress}' AND to_address IS NULL)`
    } else if (!includeMint && !includeBurn && includeSend && !includeReceive) {
        return `WHERE (from_address = '${userAddress}')`
    } else if (!includeMint && !includeBurn && !includeSend && includeReceive) {
        return `WHERE (to_address = '${userAddress}' AND from_address IS NOT NULL)`
    } else {
        return `WHERE to_address = ''`
    }
}
const address1Query = (fromAddress, toAddress) => {
    if (fromAddress && toAddress) {
        return `AND (buyer_address = '${fromAddress}' OR seller_address = '${toAddress}')`
    } else if (fromAddress && !toAddress) {
        return `AND buyer_address = '${fromAddress}'`
    } else if (!fromAddress && toAddress) {
        return `AND seller_address = '${toAddress}'`
    } else {
        return ``
    }
}
const address2Query = (fromAddress, toAddress) => {
    if (fromAddress && toAddress) {
        return `AND (from_address = '${fromAddress}' OR to_address = '${toAddress}')`
    } else if (fromAddress && !toAddress) {
        return `AND from_address = '${fromAddress}'`
    } else if (!fromAddress && toAddress) {
        return `AND to_address = '${toAddress}'`
    } else {
        return ``
    }
}
const priceQuery = (minPrice, maxPrice) => {
    if (minPrice && maxPrice) {
        return `AND (eth_price >= '${minPrice}' AND eth_price <= '${maxPrice}')`
    } else if (minPrice && !maxPrice) {
        return `AND (eth_price >= '${minPrice}')`
    } else if (!minPrice && maxPrice) {
        return `AND (eth_price <= '${maxPrice}')`
    } else {
        return ``
    }
}
const marketplaceQuery = (marketplace) => {
    if (marketplace) {
        return `AND exchange_name = '${marketplace}'`
    } else {
        return ``
    }
}
const tokenIdQuery = (tokenId) => {
    if (tokenId) {
        return `AND token_id = '${tokenId}'`
    }
    else {
        return ``
    }
}
const contractQuery = (contractAddress) => {
    if (contractAddress) {
        return `AND contract_address = '${contractAddress}'`
    }
    else {
        return ``
    }
}
const limitQuery = (includeMint, includeBurn, includeSend, includeReceive, includeBuy, includeSale) => {
    if((includeBuy || includeSale) && (includeMint || includeBurn || includeSend || includeReceive)) {
        return `LIMIT 10`
    }
    else{
        return `LIMIT 20`
    }
}
const dateQuery = (startDate, endDate) => {
    if(startDate) startDate = new Date(parseInt(startDate)).toISOString()
    if(endDate) endDate = new Date(parseInt(endDate)).toISOString()

    if (startDate && endDate) {
        return `AND (timestamp >= '${startDate}' AND timestamp <= '${endDate}')`
    } else if (startDate && !endDate) {
        return `AND (timestamp >= '${startDate}')`
    } else if (!startDate && endDate) {
        return `AND (timestamp <= '${endDate}')`
    } else {
        return ``
    }
}



profileActivityRoute.get("/", checkAuth, async (req, res)=> {

    try{
        const userAddress = req.userDetails.address
        let {includeMint, includeBurn, includeSend, includeReceive, includeBuy, includeSale, includeList, fromAddress, toAddress, minPrice, maxPrice, marketplace, tokenId, contractAddress, startDate, endDate} = req.query || {}

        includeMint = toBool(includeMint)
        includeBurn = toBool(includeBurn)
        includeSend = toBool(includeSend)
        includeReceive = toBool(includeReceive)
        includeBuy = toBool(includeBuy)
        includeSale = toBool(includeSale)
        includeList = toBool(includeList)


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
                ${limitQuery(includeMint, includeBurn, includeSend, includeReceive, includeBuy, includeSale)}
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
                ${limitQuery(includeMint, includeBurn, includeSend, includeReceive, includeBuy, includeSale)}
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
        `

        console.log(dateQuery(startDate, endDate))
        const onChainActivity = await execTranseposeAPI(SQL)

        await addTokenData(onChainActivity)

        const listingsData = await getListingData(includeList, fromAddress, toAddress, userAddress, minPrice, maxPrice, marketplace, tokenId, contractAddress, startDate, endDate)

        const activity = [...onChainActivity, ...listingsData].sort((a, b) => (new Date(b.createdAt).getTime()) - (new Date(a.createdAt).getTime()))

        res.json({ok: true, activity})
    }
    catch(e){
        console.log(e)
        res.status(400).json({ok: false})
    }
})



async function getListingData(includeList, fromAddress, toAddress, userAddress, minPrice, maxPrice, marketplace, tokenId, contractAddress, startDate, endDate){
    let listingsData = []

    if((includeList && !toAddress) && (!marketplace || marketplace === "opensea" || marketplace === "looksrare" || marketplace === "x2y2")){
        if(!(fromAddress && fromAddress !== userAddress)){
            const minWeiPrice = minPrice && (minPrice * 1000000000000000000).toString()
            const maxWeiPrice = maxPrice && (maxPrice * 1000000000000000000).toString()

            const getMinMaxFilter = () => {
                if(minWeiPrice && maxWeiPrice){
                    return `&minPrice=${minWeiPrice}&maxPrice=${maxWeiPrice}`
                } else if(minWeiPrice && !maxWeiPrice){
                    return `&minPrice=${minWeiPrice}`
                } else if(maxWeiPrice && !minWeiPrice){
                    return `&maxPrice=${maxWeiPrice}`
                } else {
                    return ``
                }
            }
            const getMarketplaceFilter = () => {
                return marketplace ? `&marketplace=${marketplace}` : ``
            }
            const getTokenIdFilter = () => {
                return tokenId ? `&tokenId=${tokenId}` : ``
            }
            const getContractFilter = () => {
                return contractAddress ? `&contractAddress=${contractAddress}` : ``
            }
            const getDateFilter = () => {
                if(startDate) startDate = startDate / 1000
                if(endDate) endDate = endDate / 1000
                if(startDate && endDate){
                    return `&listedAfter=${startDate}&listedBefore=${endDate}`
                } else if(startDate && !endDate){
                    return `&listedAfter=${startDate}`
                } else if(endDate && !startDate){
                    return `&listedAfter=1580489577000&listedBefore=${endDate}`
                } else {
                    return `&listedAfter=1580489577000`
                }
            }

            const minMaxFilter = getMinMaxFilter()
            const marketplaceFilter = getMarketplaceFilter()
            const tokenIdFilter = getTokenIdFilter()
            const contractFilter = getContractFilter()
            const dateFilter = getDateFilter()

            const listingsApiData = await fetch(`https://api.modulenft.xyz/api/v2/eth/nft/listings?active=true${dateFilter}&count=20&offset=0&sortDirection=timeDesc&seller=${userAddress}&withMetadata=false${minMaxFilter}${marketplaceFilter}${tokenIdFilter}${contractFilter}`, {
                headers: {
                    "X-API-KEY": "2183af1a-3d8e-4f24-b8a0-47fba900a366"
                }
            })
            const listingDataResult = await listingsApiData.json()
            listingsData = listingDataResult?.data ? listingDataResult.data : []

            listingsData?.forEach(item => {
                item["type"] = "list"
                item["from_address"] = userAddress
                item["price"] = item.price / 1000000000000000000
                item["token_id"] = item.tokenId
                item["tokenData"] = {token: {name: item?.tokenName || item?.metadata?.name, image: item?.metadata?.image, collection: {name: item?.collection}}}
            })
        }
    }

    return listingsData
}


async function addTokenData(onChainActivity){
    let urlData = ""
    onChainActivity.forEach(item => {
        const {token_id, contract_address} = item
        const urlType = `&tokens=${contract_address}:${token_id}`
        urlData = urlData + urlType
    })

    const reservoirApiData = await fetch(`https://api.reservoir.tools/tokens/v5?limit=20&includeAttributes=false${urlData}`, {
        headers: {
            "x-api-key": process.env.RESERVOIR_API_KEY
        }
    })
    const reservoirData = (await reservoirApiData.json())?.tokens


    onChainActivity.forEach(item => {
        const {token_id, contract_address} = item
        const tokenData = reservoirData?.find(token => token.token.contract.toLowerCase() === contract_address.toLowerCase() && token.token.tokenId == token_id)
        item["tokenData"] = tokenData
        item["createdAt"] = item.createdat
    })
}


module.exports = profileActivityRoute