const express = require("express")
const checkAuth = require("../../middleware/checkAuth")
const Minting = require("../../models/MintingModel")


const mintingRoute = express()

mintingRoute.get('/:time', checkAuth, (req, res) => {

    async function getData(){
            const userTime = parseInt(req.params.time)

            const minTime = new Date().getTime() - userTime
            const currentTime = new Date().getTime()

            const differenceTime = currentTime - minTime

            const range1 = differenceTime / 5 * 1
            const range2 = differenceTime / 5 * 2
            const range3 = differenceTime / 5 * 3
            const range4 = differenceTime / 5 * 4
            const range5 = differenceTime / 5 * 5
        
            let data = await Minting.aggregate([
                {
                    $unwind:"$mints"
                },
                {
                    $match:{
                        "mints.mintTime": {$gt: minTime},
                    }
                },
                {
                    $group:{
                        _id:"$_id",
                        uniqueMinters: {$addToSet: '$mints.minterAddress'},
                        volume: {$sum:'$mints.value'},
                        firstDoc: { $first: "$$ROOT" },
                        rightMints: {$sum: '$mints.amount'}
                    },
                },
                {
                    $unset: "firstDoc.mints"
                },
                {
                    $match: {"rightMints": {"$gt": 0}}
                },
                {
                    $addFields: {
                        "firstDoc.volume": "$volume",
                        "firstDoc.rightMints": "$rightMints",
                        "firstDoc.uniqueMinters": {$size: "$uniqueMinters"},
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

            res.status(200).json({data})
    }
    getData()

})

module.exports = mintingRoute