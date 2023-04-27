const CLIENT_URL = "https://app.wagmilabs.tools";
const RESERVOIR_SOURCE = "app.wagmilabs.tools";

module.exports = { newSale, newListing, newSnipeUpdate, newFloorChange, CLIENT_URL };

// routes imports

const trendingRoute = require("./routes/ethereum/trendingRoute.js");
const mintingRoute = require("./routes/ethereum/mintingRoute.js");
const rankingRoute = require("./routes/ethereum/rankingRoute.js");
const verifyRoute = require("./routes/ethereum/functionality/verifyRoute.js");
const loginRoute = require("./routes/ethereum/functionality/loginRoute.js");
const refreshRoute = require("./routes/ethereum/refreshRoute.js");
const profileImageRoute = require("./routes/ethereum/profile/profileImageRoute.js");
const updateListingSettingsRoute = require("./routes/ethereum/updateListingSettingsRoute.js");
const updateWatchListRoute = require("./routes/ethereum/updateWatchListRoute.js");
const removeRefreshTokenRoute = require("./routes/ethereum/removeRefreshTokenRoute.js");
const getWatchListRoute = require("./routes/ethereum/getWatchListRoute.js");
const profileItemsRoute = require("./routes/ethereum/profile/profileItemsRoute");
const holdingNftDistributionRoute = require("./routes/ethereum/profile/holdingNftDistribution");
const tradedDistributionRoute = require("./routes/ethereum/profile/tradedDistribution");
const collectionInfoRoute = require("./routes/ethereum/collections/collectionInfoRoute.js");
const updateUserCartRoute = require("./routes/ethereum/profile/updateUserCartRoute.js");
const emptyCartRoute = require("./routes/ethereum/profile/emptyCartRoute.js");
const searchCollectionsRoute = require("./routes/ethereum/collections/searchCollectionsRoute.js");
const updateGasSettingsRoute = require("./routes/ethereum/profile/updateGasSettingsRoute.js");
const userBalancesRoute = require("./routes/ethereum/profile/userBalancesRoute.js");
const profileStatsRoute = require("./routes/ethereum/profile/profileStatsRoute.js");
const volumesRoute = require("./routes/ethereum/volumesRoute.js");
const feedRoute = require("./routes/ethereum/feedRoute.js");
const tokenRoute = require("./routes/ethereum/collections/token/tokenRoute.js");
const profileCollectionsRoute = require("./routes/ethereum/profile/profileCollectionsRoute.js");
const collectionItemsRoute = require("./routes/ethereum/collections/collectionItemsRoute.js");
const watchlistCollectionsRoute = require("./routes/ethereum/watchlistCollectionsRoute.js");
const ownedCollectionsRoute = require("./routes/ethereum/ownedCollectionsRoute.js");
const userDetailsRoute = require("./routes/ethereum/profile/userDetailsRoute.js");
const activityChartRoute = require("./routes/ethereum/charts/activityChartRoute.js");
const collectionActivityRoute = require("./routes/ethereum/collections/collectionActivityRoute.js");
const tokenLisrPriceRoute = require("./routes/ethereum/profile/tokenLisrPriceRoute.js");
const profileActivityRoute = require("./routes/ethereum/profile/profileActivityRoute.js");
const profileTradedCollectionsRoute = require("./routes/ethereum/profile/profileTradedCollectionsRoute.js");
const collectionListingsRoute = require("./routes/ethereum/collections/collectionListingsRoute.js");
const collectionSalesRoute = require("./routes/ethereum/collections/collectionSalesRoute.js");
const dropsRoute = require("./routes/ethereum/calendars/dropsRoute.js");
const eventsRoute = require("./routes/ethereum/calendars/eventsRoute.js");
const personalRoute = require("./routes/ethereum/calendars/personalRoute.js");
const spacesRoute = require("./routes/ethereum/calendars/spacesRoute.js");
const pAndLRoute = require("./routes/ethereum/pAndLRoute.js");
const collectionHolders = require("./routes/ethereum/collections/holders.js");
const refreshCollectionRoute = require("./routes/ethereum/collections/resfreshColelctionRoute.js");
const statsRoute = require("./routes/ethereum/statsRoute.js");
const getSnipeTasksRoute = require("./routes/ethereum/bots/sniperBot/getSnipeTasksRoute.js");
const editSnipeRoute = require("./routes/ethereum/bots/sniperBot/editSnipeRoute.js");
//

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
//

// imports

require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { connectDB, client } = require("./config/db");
const cookieParser = require("cookie-parser");
const getCoinsGasData = require("./websockets/coinsGasData.js");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const forms = multer();
const requestIp = require("request-ip");
//

// http server

const app = express();

app.set("trust proxy", true);
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use(cors({ credentials: true, origin: CLIENT_URL }));
app.use(cookieParser());
app.use(forms.array());
app.use(requestIp.mw());
//

// socket io

const http = require("http");
const server = new http.createServer(app);
const socketIO = require("socket.io");
const listingChartRoute = require("./routes/ethereum/charts/listingsChartRoute.js");
const floorChartRoute = require("./routes/ethereum/charts/floorChartRoute.js");
const ownersChartRoute = require("./routes/ethereum/charts/ownersChartRoute.js");
const volumeChartRoute = require("./routes/ethereum/charts/volumeChartRoute.js");
const salesChartRoute = require("./routes/ethereum/charts/salesChartRoute.js");
const avgPriceChartRoute = require("./routes/ethereum/charts/avgPriceChartRoute.js");
const advancedFloorChartRoute = require("./routes/ethereum/charts/advancedFloorChartRoute.js");
const buyersSellersChartRoute = require("./routes/ethereum/charts/buyersSellersChartRoute.js");
const freeTrialRoute = require("./routes/ethereum/functionality/freeTrialroute.js");
const twChartRoute = require("./routes/ethereum/tradingview/twChartsRoute.js");
const ipRoute = require("./routes/ethereum/ipRoute.js");
const { insertStats } = require("./utils/utils.js");
const io = socketIO(server, {
  cors: {
    origin: CLIENT_URL,
  },
});

app.set("socketio", io);

let ethData;
async function updateGasData() {
  try {
    let currentEthData = await getCoinsGasData();
    ethData = currentEthData;
  } catch (e) {
    console.log(e);
  }
}
updateGasData();
setInterval(async () => {
  await updateGasData();
}, 10000);

let users = {};
let idIps = {};
let timeSpent = {};

io.on("connection", socket => {
  const { id } = socket;
  let userAddress;

  setInterval(() => {
    socket.emit("ethData", ethData);
  }, 10000);

  socket.on("getEthData", () => {
    socket.emit("ethData", ethData);
  });
  socket.on("disconnect", async () => {
    const date = Date.now();
    const time = date - timeSpent[id];
    delete timeSpent[id];

    const ip = idIps[id];
    if (ip) {
      users[ip] = users[ip] - 1;
      if (users[ip] === 0) {
        delete users[ip];
      }
    }

    const timestamp = Date.now();
    if (!isNaN(time)) {
      await insertStats({
        type: "usage_time",
        address: userAddress,
        ip_address: ip,
        timestamp,
        pass_type: null,
        extra_data: time,
      });
    }
  });
  socket.on("join", data => {
    const { ip, address } = data;
    userAddress = address;
    timeSpent[id] = Date.now();
    users[ip] = users[ip] ? users[ip] + 1 : 1;
    idIps[id] = ip;
  });

  socket.on("joinSales", collectionAddress => {
    const channel = `sales${collectionAddress}`;
    socket.join(channel);
  });

  socket.on("leaveSales", collectionAddress => {
    const channel = `sales${collectionAddress}`;
    socket.leave(channel);
  });
  socket.on("joinFloorChanges", collectionAddress => {
    const channel = `floorChanges-${collectionAddress}`;
    socket.join(channel);
  });

  socket.on("leaveFloorChanges", collectionAddress => {
    const channel = `floorChanges-${collectionAddress}`;
    socket.leave(channel);
  });

  socket.on("joinListings", collectionAddress => {
    const channel = `listings${collectionAddress}`;
    socket.join(channel);
  });

  socket.on("leaveListings", collectionAddress => {
    const channel = `listings${collectionAddress}`;
    socket.leave(channel);
  });

  socket.on("joinSnipeUpdates", accountAddress => {
    accountAddress = accountAddress?.toLowerCase();
    const channel = `snipeUpdates:${accountAddress}`;
    socket.join(channel);
  });

  socket.on("leaveSnipeUpdates", accountAddress => {
    accountAddress = accountAddress?.toLowerCase();
    const channel = `snipeUpdates:${accountAddress}`;
    socket.leave(channel);
  });
});

function newListing(listingData) {
  try {
    const contractAddress = listingData?.contractAddress?.toLowerCase();
    const channel = `listings${contractAddress}`;
    io.sockets.to(channel).emit("listing", listingData);
  } catch (e) {
    console.log(e);
  }
}

function newSale(saleData) {
  try {
    const { tokenAddress } = saleData;
    const contractAddress = tokenAddress?.toLowerCase();
    const channel = `sales${contractAddress}`;
    io.sockets.to(channel).emit("sale", saleData);
  } catch (e) {
    console.log(e);
  }
}

function newFloorChange(floorChangeData) {
  try {
    const { contractAddress } = floorChangeData;
    const lowerContractAddress = contractAddress?.toLowerCase();
    const channel = `floorChanges-${lowerContractAddress}`;
    io.sockets.to(channel).emit("floor_change", floorChangeData);
  } catch (e) {
    console.log(e);
  }
}

function newSnipeUpdate(accountAddress, data) {
  accountAddress = accountAddress?.toLowerCase();
  const channel = `snipeUpdates:${accountAddress}`;

  try {
    io.sockets.to(channel).emit("snipeUpdates", data);
  } catch (e) {
    console.log(e);
  }
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

// http routes

app.get("/api/v1/data/activeUsers", (req, res) => {
  const password = process.env.DATA_ACCESS_PASSWORD;
  const { accessPassword } = req.query;

  if (password !== accessPassword) {
    return res.status(401).send("Unauthorized");
  }

  res.json(users);
});

app.use("/api/v1/wagmilabs/ip_address", ipRoute);

app.use("/api/v1/wagmilabs/login", loginRoute);
app.use("/api/v1/wagmilabs/freeTrial", freeTrialRoute);
app.use("/api/v1/wagmilabs/refresh", refreshRoute);
app.use("/api/v1/wagmilabs/verify", verifyRoute);
app.use("/api/v1/wagmilabs/setUserImage", profileImageRoute);
app.use("/api/v1/wagmilabs/updateListingSettings", updateListingSettingsRoute);
app.use("/api/v1/wagmilabs/updateWatchList", updateWatchListRoute);
app.use("/api/v1/wagmilabs/removeRefreshToken", removeRefreshTokenRoute);
app.use("/api/v1/wagmilabs/updateUserCart", updateUserCartRoute);
app.use("/api/v1/wagmilabs/updateGasSettings", updateGasSettingsRoute);
app.use("/api/v1/wagmilabs/emptyCart", emptyCartRoute);
app.use("/api/v1/wagmilabs/profileStats", profileStatsRoute);
app.use("/api/v1/wagmilabs/userDetails", userDetailsRoute);
app.use("/api/v1/wagmilabs/activityChart", activityChartRoute);
app.use("/api/v1/wagmilabs/collectionActivity", collectionActivityRoute);
app.use("/api/v1/wagmilabs/tokenListPrice", tokenLisrPriceRoute);
app.use("/api/v1/wagmilabs/profileActivity", profileActivityRoute);
app.use("/api/v1/wagmilabs/profileTradedCollections", profileTradedCollectionsRoute);
app.use("/api/v1/wagmilabs/collectionListings", collectionListingsRoute);
app.use("/api/v1/wagmilabs/collectionSales", collectionSalesRoute);
app.use("/api/v1/wagmilabs/drops", dropsRoute);
app.use("/api/v1/wagmilabs/events", eventsRoute);
app.use("/api/v1/wagmilabs/personal", personalRoute);
app.use("/api/v1/wagmilabs/spaces", spacesRoute);

app.use("/api/v1/wagmilabs/userBalances", userBalancesRoute);
app.use("/api/v1/wagmilabs/search", searchCollectionsRoute);
app.use("/api/v1/wagmilabs/collectionInfo", collectionInfoRoute);
app.use("/api/v1/wagmilabs/collection", tokenRoute);
app.use("/api/v1/wagmilabs/collection", collectionHolders);

app.use("/api/v1/wagmilabs/profileItems", profileItemsRoute);
app.use("/api/v1/wagmilabs/holdingNftDistribution", holdingNftDistributionRoute);
app.use("/api/v1/wagmilabs/tradedDistribution", tradedDistributionRoute);
app.use("/api/v1/wagmilabs/profileCollections", profileCollectionsRoute);
app.use("/api/v1/wagmilabs/getWatchList", getWatchListRoute);
app.use("/api/v1/wagmilabs/trending", trendingRoute);
app.use("/api/v1/wagmilabs/minting", mintingRoute);
app.use("/api/v1/wagmilabs/ranking", rankingRoute);
app.use("/api/v1/wagmilabs/volumes", volumesRoute);
app.use("/api/v1/wagmilabs/feed", feedRoute);
app.use("/api/v1/wagmilabs/collectionItems", collectionItemsRoute);
app.use("/api/v1/wagmilabs/watchlistCollections", watchlistCollectionsRoute);
app.use("/api/v1/wagmilabs/ownedCollections", ownedCollectionsRoute);
app.use("/api/v1/wagmilabs/refreshCollection", refreshCollectionRoute);
app.use("/api/v1/wagmilabs/p-and-l", pAndLRoute);
app.use("/api/v1/wagmilabs/stats", statsRoute);

// collection charts
app.use("/api/v1/wagmilabs/collectionCharts", listingChartRoute);
app.use("/api/v1/wagmilabs/collectionCharts", floorChartRoute);
app.use("/api/v1/wagmilabs/collectionCharts", advancedFloorChartRoute);
app.use("/api/v1/wagmilabs/collectionCharts", ownersChartRoute);
app.use("/api/v1/wagmilabs/collectionCharts", volumeChartRoute);
app.use("/api/v1/wagmilabs/collectionCharts", salesChartRoute);
app.use("/api/v1/wagmilabs/collectionCharts", avgPriceChartRoute);
app.use("/api/v1/wagmilabs/collectionCharts", buyersSellersChartRoute);

// bots routes
app.use("/api/v1/wagmilabs/bots", editSnipeRoute);
app.use("/api/v1/wagmilabs/bots", getSnipeTasksRoute);

app.use("/tradingView", twChartRoute);

//

// listen server

server.listen(port, async () => {
  console.log("App is listening on port " + port);
  await connectDB();
  require("./websockets/sales");
  require("./websockets/listings");
  require("./websockets/floorChanges");
});
//
