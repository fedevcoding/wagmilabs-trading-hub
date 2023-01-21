const {WEBSOCKET_URL, LOCAL_WEBSOCKET_URL} = require("./websocketUrl")


const {newListing} = require("../server")
const WebSocket = require('ws');

const CHANNELS = {
    TOKEN_LISTINGS: "tokenListings",
}


async function listenToSales(){
    console.log("listening to listings")
    const ws = new WebSocket(WEBSOCKET_URL);
    
    ws.on('open', () => {
        console.log('Connected to WebSocket server');
        ws.send(JSON.stringify({channel: CHANNELS.TOKEN_LISTINGS}))
    });
    
    ws.on('message', (data) => {
        const parsedData = JSON.parse(data.toString()).order
        newListing(parsedData)
    });
    
    ws.on('close', function close() {
        console.log('Disconnected from WebSocket server');
    });
    ws.on('error', function error(error) {
        console.error('WebSocket error:', error);
    });
}
listenToSales()