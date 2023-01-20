const express = require("express")
const checkAuth = require("../../middleware/checkAuth")
const Ranking = require("../../models/RankingModel")


const trendingRoute = express()

trendingRoute.get('/:time', checkAuth, (req, res) => {

    async function getData(){
            const userTime = parseInt(req.params.time)
            let time = new Date().getTime() - userTime
        
            let data = await Ranking.aggregate([
                {
                    $unwind:"$sales"
                },
                {
                    $match:{
                        "sales.saleTime":{$gt: time},
                        "sales.value":{$gt:0}
                    }
                },
                // {
                //     $addFields: {
                //         "currentPendingTxs": {$size: '$pendingTxs'},
                //     }
                // },
                {
                    $group:{
                        _id:"$_id",
                        volume:{$sum:'$sales.value'},
                        firstDoc: { $first: "$$ROOT" },
                        rightSales:{$sum:1},
                    }
                },
                // {
                //     $unset: ["firstDoc.sales", "firstDoc.pendingTxs"]
                // },
                {
                    $match: {"rightSales": {"$gt": 0}}
                },
                {
                    $addFields: {
                        "firstDoc.volume": "$volume",
                        "firstDoc.rightSales": "$rightSales",
                        // "firstDoc.currentPending": "$currentPendingTxs"
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: "$firstDoc"
                    }
                },
                {
                    $sort: {
                        "rightSales": -1,
                        "volume": -1,
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

module.exports = trendingRoute
// module.exports = getData