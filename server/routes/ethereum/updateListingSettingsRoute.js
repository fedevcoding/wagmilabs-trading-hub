const express = require("express")
const User = require("../../models/userModel.js")
const checkAuth = require("../../middleware/checkAuth")

const updateListingSettingsRoute = express()

updateListingSettingsRoute.post("/", checkAuth, async (req, res)=> {
    const {marketplace} = req.body
    const {months, days, hours, minutes} = req.body.time
    const {type, profitType, profitValue} = req.body.price

    const address = req.userDetails.address
    const signature = req.userDetails.signature

    
    const user = await User.findOne({address, signature})
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
    
    res.json({updated: true})
})


module.exports = updateListingSettingsRoute