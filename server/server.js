module.exports = { getSocket };

// libraries
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { connectDB } = require("./config/db");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const forms = multer();
const requestIp = require("request-ip");
const { initIo } = require("./socketio/socket.js");
const { getGasData } = require("./services/gasData/gasData.js");
const { CLIENT_URL, RESERVOIR_SOURCE } = require("./variables/index.js");
const { createClient } = require("@reservoir0x/reservoir-sdk");
const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY;

// reservoir client
createClient({
  source: RESERVOIR_SOURCE,
  chains: [
    {
      id: 1,
      apiKey: RESERVOIR_API_KEY,
      baseApiUrl: "https://api.reservoir.tools",
      default: true,
    },
  ],
});

// port
const port = process.env.PORT || 5001;

// http server
const app = express();
app.set("trust proxy", true);
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use(cors({ credentials: true, origin: ["https://app.wagmilabs.tools", "http://wagmilabs.tools"] }));
app.use(cookieParser());
app.use(forms.array());
app.use(requestIp.mw());
//

// socket io
const http = require("http");
const useRoutes = require("./useRoutes");
const server = new http.createServer(app);
const socketIo = initIo(server);

function getSocket() {
  return socketIo;
}
// rate limit

const limiter = rateLimit({
  windowMs: 1000,
  max: 15,
  message: "Too many requests from this IP, please try again later.",
  keyGenerator: function (req) {
    return req.connection.remoteAddress;
  },
});
app.use(limiter);

// listen server

server.listen(port, async () => {
  console.log("App is listening on port " + port);
  await connectDB();
  useRoutes(app);
  require("./websockets/sales");
  require("./websockets/listings");
  require("./websockets/floorChanges");
  await getGasData();
});
//
