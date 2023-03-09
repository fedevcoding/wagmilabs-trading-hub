const ethers = require("ethers");
const { getClient } = require("@reservoir0x/reservoir-sdk");
const { createClient } = require("@reservoir0x/reservoir-sdk");
const { CLIENT_URL, newSnipeUpdate } = require("../../../../server");

// reservoir client
createClient({
  source: CLIENT_URL,
  chains: [
    {
      id: 1,
      apiKey: "9a16bf8e-ec68-5d88-a7a5-a24044de3f38",
      baseApiUrl: "https://api.reservoir.tools",
      default: true,
    },
  ],
});

const snipeTasks = require("../../../../services/botsCache/snipeBots/snipeTasks");
const getProvider = require("../../../../services/ethers/getProvider");
const updateTask = require("../../../../services/botsCache/snipeBots/updateTask");
const {
  pendingSnipes,
  addPendingSnipe,
  removePendingSnipe,
} = require("../../../../services/botsCache/snipeBots/pendingSnipes");
const { updateActivity } = require("../../../../services/botsCache/snipeBots/activityTasks");
const removeTask = require("../../../../services/botsCache/snipeBots/removeTask");

const fullfillSnipeTasks = async listing => {
  const { contractAddress, price: listingPrice } = listing;

  const collectionTasks = snipeTasks[contractAddress];

  if (!collectionTasks) return;

  for (const collectionTask of collectionTasks) {
    const { maxPrice, minPrice, remaining, taskId } = collectionTask;
    const pendingSnipesAmount = pendingSnipes[taskId] ?? 0;

    if (
      maxPrice >= listingPrice &&
      (minPrice ? minPrice <= listingPrice : true) &&
      remaining - pendingSnipesAmount > 0
    ) {
      console.log("sniping");
      // fullfillOrder(listing, collectionTask);
    }
  }
};

async function fullfillOrder(listing, collectionTask) {
  try {
    const {
      walletAddress,
      taskOwner,
      taskId,
      privateKey,
      remaining,
      collectionName,
      collectionImage,
      collectionAddress,
    } = collectionTask;
    addPendingSnipe(taskId);

    const pendingData = {
      properties: [
        {
          key: "status",
          value: "pending",
        },
      ],
      taskId,
    };
    await updateTask(taskId, pendingData, taskOwner);

    const { price: listingPrice, protocolData, tokenId } = listing;

    const provider = getProvider();
    const signer = new ethers.Wallet(privateKey, provider);

    console.log(protocolData);

    await new Promise(resolve => setTimeout(resolve, 5000));

    protocolData.parameters["orderType"] = 2;
    protocolData.parameters["kind"] = "single-token";

    await getClient()?.actions.buyToken({
      signer,
      items: [
        {
          rawOrder: {
            kind: "seaport-v1.4",
            data: protocolData.parameters,
          },
        },
      ],
      options: {
        skipBalanceCheck: true,
      },
      onProgress: progress => {
        console.log(progress);
      },
      // expectedPrice
    });

    console.log(snipe);

    const snipe = {
      transactionHash: "0x90ae89fuaef8",
      tokenId: "123",
      tokenName: "test",
      tokenImage: "test",
    };

    const { transactionHash, tokenName, tokenImage } = snipe;
    const eventTimestamp = Date.now();

    removePendingSnipe(taskId);
    const buyData = {
      properties: [
        {
          key: "status",
          value: "active",
        },
        {
          key: "remaining",
          value: remaining - 1,
        },
      ],
      taskId,
    };
    await updateTask(taskId, buyData, taskOwner);

    const activityData = {
      collectionAddress,
      collectionName,
      collectionImage,
      tokenId,
      tokenName,
      tokenImage,
      buyPrice: listingPrice,
      status: "Fulfilled",
      taskOwner,
      walletAddress,
      taskId,
      eventTimestamp,
      transactionHash,
    };
    await updateActivity(activityData);

    if (remaining === 1) {
      await removeTask(taskId, taskOwner);
    }
  } catch (err) {
    console.log(err);
    // const failedData = {
    //   property: "status",
    //   value: "failed",
    //   type: "failed",
    //   taskId,
    // };
    // await updateTask(taskId, failedData, taskOwner);
  }
}

module.exports = fullfillSnipeTasks;
