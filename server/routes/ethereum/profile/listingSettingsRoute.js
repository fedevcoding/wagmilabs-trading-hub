const express = require("express")
const User = require("../../../models/userModel.js")
const checkAuth = require("../../../middleware/checkAuth")

const listingSettingsRoute = express()

listingSettingsRoute.get("/", checkAuth, async (req, res) => {

    const { address } = req.userDetails

    const user = await User.findOne({ address })
    const listSettings = user.listSettings
    res.json({ listSettings })
})


module.exports = listingSettingsRoute