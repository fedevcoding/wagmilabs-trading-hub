const { WEBSOCKET_URL, LOCAL_WEBSOCKET_URL } = require("./websocketUrl");

const { newSale } = require("../server");
const WebSocket = require("ws");

const CHANNELS = {
  NFT_SALES_TOKEN: "nftSalesToken",
};

async function listenToSales() {
  console.log("listening to sales");
  const ws = new WebSocket(WEBSOCKET_URL);

  ws.on("open", () => {
    console.log("Connected to WebSocket server");
    ws.send(JSON.stringify({ channel: CHANNELS.NFT_SALES_TOKEN }));

    setInterval(() => {
      ws.send("ping");
    }, 30000);
  });

  ws.on("message", data => {
    const parsedData = JSON.parse(data.toString());
    if (parsedData === "ping") return;
    newSale(parsedData);
  });

  ws.on("close", function close() {
    console.log("Disconnected from sales WebSocket server");
    setTimeout(() => {
      console.log("trying to reconnect");
      listenToSales();
    }, 1000);
  });
  ws.on("error", function error(error) {
    ws.close();
  });
}
listenToSales();
