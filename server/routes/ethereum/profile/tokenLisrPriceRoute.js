const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")
const { execTranseposeAPI } = require("../../../services/externalAPI/transpose")

const tokenLisrPriceRoute = express()


const royaltieMapping = {
    "opensea": 2.5,
    "x2y2": 0.5,
    "looksrare": 2,
}



tokenLisrPriceRoute.get("/", checkAuth, async (req, res)=> {

    const {address} = req.userDetails
    const {tokenId, contractAddress, marketplace, listingType, ethPrice} = req.query

    

    if(!address){
        res.status(400).json({message: "There was a problem fetching the data", ok: false})
    }
    else{

        const query = `
WITH last_tx AS (
    SELECT
        *
    FROM ethereum.nft_transfers
    WHERE to_address = '${address}'
      AND contract_address = '${contractAddress}'
      AND token_id = '${tokenId}'
    ORDER BY block_number DESC
    LIMIT 1
)
SELECT
    last_tx.*,
    CASE
        WHEN category = 'mint' THEN (
                     value / mint_count
            )
        ELSE (
            SELECT
                price / POWER(10, 18)
            FROM ethereum.nft_sales n
            WHERE n.transaction_hash = last_tx.transaction_hash
              AND last_tx.contract_address = n.contract_address
              AND last_tx.token_id = n.token_id
              AND n.buyer_address = last_tx.to_address
        )
        END AS price,
    transaction_fee AS transaction_fee
FROM last_tx
CROSS JOIN LATERAL (
    SELECT
        transaction_fee / POWER(10, 18) AS transaction_fee,
        value / POWER(10, 18) AS value
    FROM ethereum.transactions
    WHERE transaction_hash = last_tx.transaction_hash
    ) AS fee
CROSS JOIN LATERAL (
    SELECT
        count(*) AS mint_count
    FROM ethereum.nft_transfers n
    WHERE n.transaction_hash = last_tx.transaction_hash
      AND n.contract_address = last_tx.contract_address
      AND n.category = 'mint'
    ) AS mint_count;
        `

        const buyData = await execTranseposeAPI(query)

        const defaultCreatorFee = 0
        const  royaltiesDataApi = await fetch(`https://api.gomu.co/rest/overview/contract?contractAddress=${contractAddress}&skipTraits=true`, {
            headers: {
                "gomu-api-key": "wO563s12FAkjYXoyqkrZ4rl03Rg9FZ7T"
            }
        })

        const royaltiesData = (await royaltiesDataApi.json())?.data?.royalty
        const creatorRoyalties = royaltiesData[marketplace]?.percentage || royaltiesData["opensea"]?.percentage || defaultCreatorFee
        const royalties = royaltieMapping[marketplace]


        const buyPrice = buyData?.[0]?.price
        const buyTransactionFee = buyData?.[0]?.transaction_fee


        const listingPrice = getListPrice(buyPrice, buyTransactionFee, creatorRoyalties, royalties, listingType, ethPrice)

        res.json({listingPrice})
    }

})





function getListPrice(buyPrice, buyTransactionFee, creatorRoyalties, royalties, listingType, ethPrice){

    if(listingType.includes("profit")){
        const listingArr = listingType.split("-")

        const value = Number(listingArr[1])
        const type = listingArr[2]

        switch(type){
            case "%":
                const calculationPerc = roundCalculations((((buyPrice + buyTransactionFee + ((value * buyPrice) + (buyTransactionFee))) * 100) / (100 - (royalties + creatorRoyalties))))
                return calculationPerc
            case "eth":
                const calculationEth = roundCalculations((((buyPrice + buyTransactionFee + value) * 100) / (100 - (royalties + creatorRoyalties))))
                return calculationEth
            case "usd":
                const calculationUsd = roundCalculations((((buyPrice  + buyTransactionFee + (value / ethPrice)) * 100) / (100 - (royalties + creatorRoyalties))))
                return calculationUsd
        }
    }
    else if(listingType === "break-even"){
        const calculation = roundCalculations((((buyPrice + buyTransactionFee) * 100) / (100 - (royalties + creatorRoyalties))))
        return calculation
    }
}




const roundCalculations = (calculation) => {
    return Math.ceil(calculation * 100000) / 100000.00000;
}


module.exports = tokenLisrPriceRoute