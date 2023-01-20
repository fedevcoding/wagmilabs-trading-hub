const express = require("express")
require("dotenv").config()
const JWT = require("jsonwebtoken")
const checkOwnership = require("../../../middleware/checkOwnership.js")
const User = require("../../../models/userModel.js")
const fallbackPfp = require("../../../images/userPfp.svg")


const loginRoute = express()


const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
const JWT_REFRESH_PRIVATE_KEY = process.env.JWT_REFRESH_PRIVATE_KEY
const REFRESH_JWT_DAYS = 1
const ACCESS_JWT_SECONDS = 80


loginRoute.post("/", checkOwnership, async (req, res)=> {

    try{
        const { address, signature } = req?.body || {}
    
    
        if(!address || !signature){
            res.status(403).json({authenticated: false, message: "Missing query fields."})
        }
        else{
            const accessToken = JWT.sign({
                address,
                signature
            },
            JWT_PRIVATE_KEY,
            {
                expiresIn: ACCESS_JWT_SECONDS
            })
        
            const refreshToken = await JWT.sign({
                address,
                signature
            }, 
            JWT_REFRESH_PRIVATE_KEY, 
            {
                expiresIn: (60 * 60) * REFRESH_JWT_DAYS
            })
        
            const user = await User.findOne({address, signature})
            
            if(user){
                res.status(200).cookie("refreshJWT", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                }).json({message: "User authenticated", token: accessToken, refreshToken, authenticated: true})
            }
        
            else{
                const profileImage = await getProfileImage(address)
    
                User.create({
                    address,
                    signature,
                    profileImage,
                    listSettings: {
                        price: {
                            type: "break-even",
                        },
                        time: {
                            months: 0,
                            days: 1,
                            hours: 0,
                            minutes: 0
                        },
                        marketplace: "opensea"
                    },
                    shoppingCart: [],
                    gasSettings: {
                        label: "Fast",
                        value: "fast",
                        maxPriorityFeePerGas: 0,
                        maxFeePerGas: 0,
                        custom: {
                            maxPriorityFeePerGas: 0,
                            maxFeePerGas: 0,
                        }
                    }
                })
                res.status(200).cookie("refreshJWT", refreshToken, {
                    httpOnly: true,
                }).json({message: "User authenticated", token: accessToken, refreshToken, authenticated: true})
            }
        }
    }

    catch(e){
        res.status(400).json({authenticated: false, message: "Something went wrong while trying to login."})
    }



})
module.exports = loginRoute



async function getProfileImage(address){
    try{
        pfp = await fetch(`https://api.opensea.io/api/v1/account/${address}`)
        pfp = await pfp.json()
        pfp = pfp?.data?.profile_img_url || fallbackPfp

        return pfp
    }
    catch(err){
        console.error(err)
    }
}

