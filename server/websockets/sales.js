const WEBSOCKET_URL = 'wss://wagmilabs-websocket-server.herokuapp.com/ws'
const {newSale} = require("../server")
const WebSocket = require('ws');

const CHANNELS = {
    NFT_SALES_TOKEN: "nftSalesToken",
}


async function listenToSales(){
    console.log("listening to sales")
    const ws = new WebSocket(WEBSOCKET_URL);
    
    ws.on('open', () => {
        console.log('Connected to WebSocket server');
        ws.send(JSON.stringify({channel: CHANNELS.NFT_SALES_TOKEN}))
    });
    
    ws.on('message', (data) => {
        const parsedData = JSON.parse(data.toString())
        if(parsedData === "ping") return
        newSale(parsedData)
    });
    
    ws.on('close', function close() {
        console.log('Disconnected from WebSocket server');
    });
    ws.on('error', function error(error) {
        console.error('WebSocket error:', error);
    });
}
listenToSales()