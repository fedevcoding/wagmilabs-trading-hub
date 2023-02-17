const express = require("express")
const checkAuth = require("../../middleware/checkAuth")
const Minting = require("../../models/MintingModel")


const mintingRoute = express()

mintingRoute.get('/:time', checkAuth, (req, res) => {

    async function getData() {

        try {
            const { time } = req.params || {}
            const userTime = parseInt(time)

            const minTime = new Date().getTime() - userTime

            let mintingCollections = await Minting.aggregate([
                {
                    $unwind: "$mints"
                },
                {
                    $match: {
                        "mints.mintTime": { $gt: minTime },
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        uniqueMinters: { $addToSet: '$mints.minterAddress' },
                        volume: { $sum: '$mints.value' },
                        firstDoc: { $first: "$$ROOT" },
                        rightMints: { $sum: '$mints.amount' }
                    },
                },
                {
                    $unset: "firstDoc.mints"
                },
                {
                    $match: { "rightMints": { "$gt": 0 } }
                },
                {
                    $addFields: {
                        "firstDoc.volume": "$volume",
                        "firstDoc.rightMints": "$rightMints",
                        "firstDoc.uniqueMinters": { $size: "$uniqueMinters" },
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: "$firstDoc"
                    }
                },
                {
                    $sort: {
                        "rightMints": -1,
                    }
                },
                {
                    $limit: 50
                }
            ])

            res.status(200).json({ mintingCollections, time })
        }
        catch (e) {
            res.status(500).json({ error: e })
        }
    }
    getData()

})

module.exports = mintingRoute