const express = require("express")
const User = require("../../../models/userModel.js")
const checkAuth = require("../../../middleware/checkAuth")

const profileImageRoute = express()

profileImageRoute.post("/", checkAuth, async (req, res) => {

    try {
        const { address } = req.userDetails

        const { image_url } = req?.body

        if (!image_url) return res.status(400).json({ error: "Image url is required" })

        const user = await User.findOne({ address })

        if (!user) return res.status(400).json({ error: "User not found" })

        await user.updateOne({ profileImage: image_url })
        res.status(200).json({ imageUrl: image_url })
    }
    catch (e) {
        res.status(500).json({ error: e })
        console.log(e)
    }
})


module.exports = profileImageRoute