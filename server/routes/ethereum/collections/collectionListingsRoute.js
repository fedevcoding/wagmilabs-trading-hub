const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")


const collectionListingsRoute = express()

collectionListingsRoute.get('/:address', checkAuth, (req, res) => {

    async function getListings(){
        let data = await fetch(`https://api.nftscoring.com/api/v1/listings/active/?collection_contract=${req.params.address}&marketplaces=opensea`, {
            headers: {
                Authorization: "Token 5ae6c2f470e30cb6a836a56561488f93b21e4e27",
                "Content-Type": "application/json"
            }
        })
        data = await data.json()
        data = data.data
        data.sort((a, b) => {
            const aDate = new Date(a.collection_contract).getTime()
            const bDate = new Date(b.collection_contract).getTime()
            return aDate - bDate
        })
        res.status(200).json({success: true, data})
    }
    getListings()
})

module.exports = collectionListingsRoute
