const express = require("express")
require("dotenv").config()
const checkAuth = require("../../middleware/checkAuth.js")

const removeRefreshTokenRoute = express()

removeRefreshTokenRoute.get("/", checkAuth, async (req, res)=> {

    res.status(200)
    .cookie("refreshJWT", "deletingCookie...", {
        httpOnly: true,
        maxAge: -1
    })
    .json({message: "refreshToken deleted", ok: true})

})


module.exports = removeRefreshTokenRoute