const express = require("express")
const User = require("../../../models/userModel.js")
const checkAuth = require("../../../middleware/checkAuth")

const userDetailsRoute = express()

userDetailsRoute.post("/", checkAuth, async (req, res)=> {

    const address = req.userDetails.address
    const signature = req.userDetails.signature

    const user = await User.findOne({address, signature})
    if(user){
        res.json({user})
    }
    else{
        res.status(400).json({message: "no user found"})
    }

})


module.exports = userDetailsRoute