const express = require("express")
const checkAuth = require("../../../middleware/checkAuth")
const WS = require("ws")
const ReconnectingWebSocket = require("reconnecting-websocket")


// const botListings = express()

// botListings.get("/", checkAuth, async (req, res)=> {

const botListings = () => {
    const options = {
        WebSocket: WS, // custom WebSocket constructor
        connectionTimeout: 1000,
        maxRetries: 10,
    };
    const rws = new ReconnectingWebSocket(`ws://localhost:6000/ws`, [], options)


    rws.addEventListener("open", () => {
        console.log("client connected to ws")
    })

    rws.addEventListener("message", ({data}) => {
        console.log(data)
    })

    return rws
    
}

// })


module.exports = botListings