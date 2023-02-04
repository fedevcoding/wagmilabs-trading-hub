const express = require("express")
const checkAuth = require("../../middleware/checkAuth")
const Ranking = require("../../models/RankingModel")


const rankingRoute = express()

rankingRoute.get('/:time', checkAuth, (req, res) => {

    async function getData(){
        try{
            const {time} = req.params || {}
            const userTime = parseInt(time)


            const rightTime = new Date().getTime() - userTime
        
            const rankingCollections = await Ranking.aggregate([
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
                        rightSales:{$sum:1}
                    }
                },
                {
                    $unset: "firstDoc.sales"
                },
                {
                    $match: {"rightSales": {"$gt": 0}}
                },
                {
                    $addFields: {
                        "firstDoc.volume": "$volume",
                        "firstDoc.rightSales": "$rightSales"
                    }
                },                {
                    $replaceRoot: {
                        newRoot: "$firstDoc"
                    }
                },
                {
                    $sort: {
                        "volume": -1,
                    }
                },
                {
                    $limit: 50
                }
            ])

            res.status(200).json({rankingCollections})
        }
        catch(e){
            console.log(e)
            res.status(500).json({error: e})
        }
    }
    getData()

})

module.exports = rankingRoute