const express = require("express")
const User = require("../../../models/userModel.js")
const checkAuth = require("../../../middleware/checkAuth")

const emptyCartRoute = express()

emptyCartRoute.get("/", checkAuth, async (req, res)=> {
    const address = req.userDetails.address
    const signature = req.userDetails.signature

    const user = await User.findOne({address, signature})
    
    user.shoppingCart = []
    await user.save()

    res.json({status: "success"})
})


module.exports = emptyCartRoute