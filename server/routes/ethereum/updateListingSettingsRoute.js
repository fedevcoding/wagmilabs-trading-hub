const express = require("express")
const User = require("../../models/userModel.js")
const checkAuth = require("../../middleware/checkAuth")

const updateListingSettingsRoute = express()

updateListingSettingsRoute.post("/", checkAuth, async (req, res) => {



    try {
        const { marketplace } = req.body || {}
        const { months, days, hours, minutes } = req.body.time || {}
        const { type, profitType, profitValue } = req.body.price || {}

        const { address, signature } = req.userDetails

        console.log(marketplace, months, days, hours, minutes, type, profitType, profitValue)

        if (!marketplace || !type || !profitType || !profitValue) return res.json({ updated: false, error: "Missing data" })


        const user = await User.findOne({ address, signature })

        if (!user) return res.json({ updated: false, error: "User not found" })

        user.listSettings = {
            price: {
                type,
                profitType,
                profitValue
            },
            time: {
                months,
                days,
                hours,
                minutes
            },
            marketplace
        }
        await user.save()

        res.status(200).json({ updated: true })
    }
    catch (e) {

        res.status(500).json({ updated: false, error: e.message })
    }
})


module.exports = updateListingSettingsRoute