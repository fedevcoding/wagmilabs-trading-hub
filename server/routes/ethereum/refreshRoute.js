const express = require("express")
require("dotenv").config()
const JWT = require("jsonwebtoken")

const refreshRoute = express()

refreshRoute.get("/", async (req, res)=> {
    // const { refreshToken } = req.body
    const refreshToken = req.cookies.refreshJWT
    if(!refreshToken){
        return res.status(400).json({message: "No token found", authenticated: false})
    }
    try{
        const data = await JWT.verify(refreshToken, process.env.JWT_REFRESH_PRIVATE_KEY)
        const signature = data.signature
        const address = data.address   
        
        const newAccessToken = await JWT.sign({
            address,
            signature
        }, process.env.JWT_PRIVATE_KEY, {
            expiresIn: 80
        })
        res.status(200).json({message: "Token updated", token: newAccessToken, refreshToken, authenticated: true})
    }
    catch(err){
        res.status(400).json({message: "Invalid authentication", authenticated: false})
    }
})


module.exports = refreshRoute