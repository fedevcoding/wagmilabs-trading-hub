const express = require("express")
const User = require("../../models/userModel")
const checkAuth = require("../../middleware/checkAuth")


const updateWatchListRoute = express()

updateWatchListRoute.get('/', checkAuth, async (req, res) => {

    try {
        const { collectionAddress, method } = req.query

        const { address, signature } = req.userDetails

        if (!collectionAddress || !method) throw new Error("collection aaddress or method not provided")

        const user = await User.findOne({ address, signature })

        if (!user) throw new Error("User not found")

        if (method === "add") {
            user.watchList.collectionWatchList.push(collectionAddress.toLowerCase())
            await user.save()
            res.status(200).json({ message: `collection added to watchlist`, status: "ok" })
        }
        else if (method === "remove") {
            user.watchList.collectionWatchList.pull(collectionAddress.toLowerCase())
            await user.save()
            res.status(200).json({ message: `collection removed from watchlist`, status: "ok" })
        }
    }
    catch (e) {
        console.log(e)
        res.status(400).json({ error: e, status: "error" })
    }

})

module.exports = updateWatchListRoute
