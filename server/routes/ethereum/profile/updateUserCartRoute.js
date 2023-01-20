const express = require("express")
const User = require("../../../models/userModel.js")
const checkAuth = require("../../../middleware/checkAuth")

const updateUserCartRoute = express()

updateUserCartRoute.post("/", checkAuth, async (req, res)=> {
    const {name, tokenId, price, image, contractAddress, marketplace} = req.body

    const address = req.userDetails.address
    const signature = req.userDetails.signature

    const user = await User.findOne({address, signature})
    
    user.shoppingCart = [...user.shoppingCart, {name, tokenId, price, image, contractAddress, marketplace}]
    await user.save()

    res.json({name, tokenId, price, image, contractAddress, marketplace, pushStatus: "success"})
})


module.exports = updateUserCartRoute