const ethers = require("ethers");
const { getClient } = require("@reservoir0x/reservoir-sdk");
const { createClient } = require("@reservoir0x/reservoir-sdk");

// reservoir client
createClient({
  source: "app.wagmilabs.tools",
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
  const { contractAddress, price: listingPrice, isFlagged } = listing;

  const collectionTasks = snipeTasks[contractAddress];

  if (!collectionTasks) return;

  for (const collectionTask of collectionTasks) {
    const { maxPrice, minPrice, remaining, taskId, skipFlagged } = collectionTask;
    const pendingSnipesAmount = pendingSnipes[taskId] ?? 0;

    if (
      maxPrice >= listingPrice &&
      (minPrice ? minPrice <= listingPrice : true) &&
      remaining - pendingSnipesAmount > 0 &&
      !(isFlagged && skipFlagged)
    ) {
      fullfillOrder(listing, collectionTask);
    }
  }
};

async function fullfillOrder(listing, collectionTask) {
  const {
    walletAddress,
    taskOwner,
    taskId,
    privateKey,
    remaining,
    collectionName,
    collectionImage,
    collectionAddress,
    maxPriorityFeePerGas,
    maxFeePerGas,
  } = collectionTask || {};

  const { price: listingPrice, tokenId } = listing;

  try {
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

    const provider = getProvider();
    const signer = new ethers.Wallet(privateKey, provider);

    const reservoirOptions = {
      signer,
      items: [
        {
          quantity: 1,
          token: `${collectionAddress}:${tokenId}`,
        },
      ],
      options: {
        skipBalanceCheck: true,
      },
      expectedPrice: listingPrice,
      onProgress: progress => {
        // console.log(progress);
      },
    };

    if (maxFeePerGas) reservoirOptions.options["maxFeePerGas"] = (maxFeePerGas * 1000000000).toString();
    if (maxPriorityFeePerGas)
      reservoirOptions.options["maxPriorityFeePerGas"] = (maxPriorityFeePerGas * 1000000000).toString();
    // restart server
    // wait 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));

    await getClient()?.actions.buyToken(reservoirOptions);
    removePendingSnipe(taskId);

    const snipe = {
      transactionHash: "",
      tokenName: "",
      tokenImage: "",
    };

    const { transactionHash, tokenName, tokenImage } = snipe;
    const eventTimestamp = Date.now();

    const activityData = {
      collectionAddress,
      collectionName,
      collectionImage,
      tokenId,
      tokenName,
      tokenImage,
      buyPrice: listingPrice,
      gasPrice: 0,
      status: "Fulfilled",
      taskOwner,
      walletAddress,
      taskId,
      eventTimestamp,
      transactionHash,
    };
    await updateActivity("success", activityData);

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
      remaining,
    };
    await updateTask(taskId, buyData, taskOwner);
  } catch (err) {
    removePendingSnipe(taskId);

    const failedData = {
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
      remaining,
    };
    await updateTask(taskId, failedData, taskOwner);

    const task = {
      collectionAddress,
      collectionName,
      collectionImage,
      tokenId,
      tokenName: "",
      tokenImage: "",
      buyPrice: listingPrice,
      gasPrice: 0,
      status: "Failed",
      taskOwner,
      walletAddress,
      taskId,
      eventTimestamp: Date.now(),
      transactionHash: "",
    };

    await updateActivity("failed", task);
  } finally {
    if (remaining === 1) {
      await removeTask(taskId, taskOwner);
    }
  }
}

module.exports = fullfillSnipeTasks;
