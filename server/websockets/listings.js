const { WEBSOCKET_URL, LOCAL_WEBSOCKET_URL } = require("./websocketUrl");

const { newListing } = require("../server");
const fullfillSnipeTasks = require("../routes/ethereum/bots/sniperBot/fulfillTasks");
const WebSocket = require("ws");

const CHANNELS = {
  TOKEN_LISTINGS: "tokenListings",
};

async function listenToListings() {
  console.log("listening to listings");
  const ws = new WebSocket(WEBSOCKET_URL);

  ws.on("open", () => {
    ws.send(JSON.stringify({ channel: CHANNELS.TOKEN_LISTINGS }));

    setInterval(() => {
      ws.send("ping");
    }, 30000);
  });

  ws.on("message", data => {
    const parsedData = JSON.parse(data.toString());
    if (parsedData === "ping") return;

    if (!parsedData) return;
    fullfillSnipeTasks(parsedData);
    newListing(parsedData);
  });

  ws.on("close", function close() {
    console.log("Disconnected from listings WebSocket server");

    setTimeout(() => {
      console.log("trying to reconnect listings");
      listenToListings();
    }, 1000);
  });
  ws.on("error", function error(error) {
    ws.close();
  });
}
listenToListings();
