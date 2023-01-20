const express = require("express")
const User = require("../../../models/userModel.js")
const checkAuth = require("../../../middleware/checkAuth")

const userAddressRoute = express()

userAddressRoute.get("/", checkAuth, async (req, res)=> {
    const address = req.userDetails.address
    if(!address){
        return res.status(400).json({message: "no address found"})
    }
    res.status(200).json({address})
})


module.exports = userAddressRoute