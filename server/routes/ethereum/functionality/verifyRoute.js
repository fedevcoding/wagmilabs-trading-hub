const express = require("express")
const JWT = require("jsonwebtoken")
require("dotenv").config()


const verifyRoute = express()

verifyRoute.post("/", async (req, res) => {
    const {token} = req.body

    if(!token){
        return res.status(400).json({message: "No token found", authenticated: false, verified: false})
    }

    try{
        await JWT.verify(token, process.env.JWT_PRIVATE_KEY)
        res.status(200).json({verified: true})
    } catch(err){
        res.status(400).json({verified: false})
    }
})

module.exports = verifyRoute