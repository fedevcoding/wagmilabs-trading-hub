const express = require("express")
const checkAuth = require("../../middleware/checkAuth")
const Ranking = require("../../models/RankingModel")


const trendingRoute = express()

trendingRoute.get('/:time', checkAuth, (req, res) => {
    
    async function getData(){

        try{
            const {time} = req.params
            const userTime = parseInt(time)

            const rightTime = new Date().getTime() - userTime
        
            const trendingCollections = await Ranking.aggregate([
                {
                    $unwind:"$sales"
                },
                {
                    $match:{
                        "sales.saleTime":{$gt: rightTime},
                        "sales.value":{$gt:0}
                    }
                },
                {
                    $group:{
                        _id:"$_id",
                        volume:{$sum:'$sales.value'},
                        firstDoc: { $first: "$$ROOT" },
                        rightSales:{$sum:1},
                    }
                },
                {
                    $match: {"rightSales": {"$gt": 0}}
                },
                {
                    $addFields: {
                        "firstDoc.volume": "$volume",
                        "firstDoc.rightSales": "$rightSales",
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

            res.status(200).json({trendingCollections, time})
        }
        catch(e){
            res.status(500).json({error: e})
        }
    }
    getData()

})

module.exports = trendingRoute
// module.exports = getData