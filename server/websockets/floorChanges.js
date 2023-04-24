const { WEBSOCKET_URL } = require("./websocketUrl");

const { newFloorChange } = require("../server");
const WebSocket = require("ws");

const CHANNELS = {
  FLOOR_CHANGES: "floorChanges",
};

async function listenToFloorChanges() {
  console.log("listening to floor changes");
  const ws = new WebSocket(WEBSOCKET_URL);

  ws.on("open", () => {
    ws.send(JSON.stringify({ channel: CHANNELS.FLOOR_CHANGES }));

    setInterval(() => {
      ws.send("ping");
    }, 30000);
  });

  ws.on("message", data => {
    const parsedData = JSON.parse(data.toString());
    if (parsedData === "ping") return;

    // console.log(parsedData);
    newFloorChange(parsedData);
  });

  ws.on("close", function close() {
    console.log("Disconnected from sales WebSocket server");
    setTimeout(() => {
      console.log("trying to reconnect");
      listenToFloorChanges();
    }, 1000);
  });
  ws.on("error", function error(error) {
    ws.close();
  });
}
listenToFloorChanges();
