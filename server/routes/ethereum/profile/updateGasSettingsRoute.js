const express = require("express")
const User = require("../../../models/userModel.js")
const checkAuth = require("../../../middleware/checkAuth")

const updateGasSettingsRoute = express()

updateGasSettingsRoute.post("/", checkAuth, async (req, res)=> {
    const newGasSettings = req.body

    const address = req.userDetails.address
    const signature = req.userDetails.signature

    const user = await User.findOne({address, signature})
    
    user.gasSettings = newGasSettings
    await user.save()

    console.log(newGasSettings)
    res.json({newGasSettings, pushStatus: "success", success: true})
})


module.exports = updateGasSettingsRoute