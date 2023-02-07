const express = require("express")
const User = require("../../../models/userModel.js")
const checkAuth = require("../../../middleware/checkAuth")

const userDetailsRoute = express()

userDetailsRoute.get("/", checkAuth, async (req, res) => {
    try {
        const { address } = req.userDetails

        const user = await User.findOne({ address })

        if (!user) res.status(400).json({ message: "no user found" })

        res.status(200).json(user)
    }
    catch (e) {
        res.status(400).json({ error: e })
    }

})


module.exports = userDetailsRoute