const express = require("express")
require("dotenv").config()
const checkAuth = require("../../middleware/checkAuth.js")

const removeRefreshTokenRoute = express()

removeRefreshTokenRoute.get("/", checkAuth, async (req, res) => {

    try {
        res.status(200)
            .cookie("refreshJWT", "deletingCookie...", {
                httpOnly: true,
                maxAge: -1
            })
            .json({ message: "refreshToken deleted", ok: true })
    }
    catch (e) {
        res.status(500).json({ message: "Something went wrong", ok: false })
    }
})


module.exports = removeRefreshTokenRoute