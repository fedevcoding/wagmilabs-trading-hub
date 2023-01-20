const express = require("express")
const User = require("../../../models/userModel.js")
const checkAuth = require("../../../middleware/checkAuth")

const profileImageRoute = express()

profileImageRoute.post("/", checkAuth, async (req, res)=> {
    const {image_url} = req.body

    const address = req.userDetails.address
    const signature = req.userDetails.signature

    const user = await User.findOne({address, signature})
    await user.updateOne({profileImage: image_url})
    res.json({imageUrl: image_url})
})


module.exports = profileImageRoute