const express = require("express")
const User = require("../../../models/userModel.js")
const checkAuth = require("../../../middleware/checkAuth")

const updateGasSettingsRoute = express()

updateGasSettingsRoute.post("/", checkAuth, async (req, res) => {

    try {
        const newGasSettings = req.body

        const { address } = req.userDetails

        const user = await User.findOne({ address })

        if (!user) return res.status(404).json({ success: false })

        user.gasSettings = newGasSettings
        await user.save()

        res.json({ success: true })
    }
    catch (e) {
        res.status(500).json({ success: false })
    }
})


module.exports = updateGasSettingsRoute