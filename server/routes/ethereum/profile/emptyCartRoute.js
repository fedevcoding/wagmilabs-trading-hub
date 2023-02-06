const express = require("express")
const User = require("../../../models/userModel.js")
const checkAuth = require("../../../middleware/checkAuth")

const emptyCartRoute = express()

emptyCartRoute.get("/", checkAuth, async (req, res) => {

    try {
        const { address, signature } = req.userDetails

        const user = await User.findOne({ address, signature })

        if (!user) return res.status(404).json({ status: "error" })

        user.shoppingCart = []
        await user.save()

        res.json({ status: "success" })
    }
    catch (e) {
        res.status(500).json({ status: "error" })
    }
})


module.exports = emptyCartRoute