const express = require("express")
const User = require("../../../models/userModel.js")
const checkAuth = require("../../../middleware/checkAuth")

const updateUserCartRoute = express()

updateUserCartRoute.post("/", checkAuth, async (req, res)=> {

    const {type} = req.body
    const {address, signature} = req.userDetails

    const user = await User.findOne({address, signature})

    if(type === "add"){
        const {name, tokenId, price, image, contractAddress, marketplace, collectionName} = req.body
        
        user.shoppingCart = [...user.shoppingCart, {name, tokenId, price, image, contractAddress, collectionName, marketplace}]
        await user.save()

        res.json({name, tokenId, price, image, contractAddress, marketplace, pushStatus: "success"})

    }
    else if(type === "remove"){

        const {contractAddress, tokenId} = req.body

        const filteredItems = user.shoppingCart.filter(item => item.contractAddress + item.tokenId !== contractAddress + tokenId)

        user.shoppingCart = filteredItems
        await user.save()

        res.json({pushStatus: "success"})


    }

})


module.exports = updateUserCartRoute