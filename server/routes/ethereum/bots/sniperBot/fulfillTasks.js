const ethers = require("ethers");
const { getClient } = require("@reservoir0x/reservoir-sdk");
const { createClient } = require("@reservoir0x/reservoir-sdk");
const { CLIENT_URL, newSnipeUpdate } = require("../../../../server");

// reservoir client
createClient({
  apiBase: "https://api.reservoir.tools",
  apiKey: "9a16bf8e-ec68-5d88-a7a5-a24044de3f38",
  source: CLIENT_URL,
});

const snipeTasks = require("../../../../services/botsCache/snipeBots/snipeTasks");
const getProvider = require("../../../../services/ethers/getProvider");

const fullfillSnipeTasks = async listing => {
  const { contractAddress, price: listingPrice } = listing;

  const collectionTasks = snipeTasks[contractAddress];

  if (!collectionTasks) return;
  console.log("found listing");

  for (const collectionTask of collectionTasks) {
    const { maxPrice } = collectionTask;
    if (maxPrice >= listingPrice) {
      fullfillOrder(listing, collectionTask);
    }
  }
};

async function fullfillOrder(listing, collectionTask) {
  try {
    const { walletAddress, taskOwner, privateKey, taskId } = collectionTask;
    console.log("sniping");

    const data = {
      type: "pending",
      taskId,
    };
    newSnipeUpdate(taskOwner, data);

    // const { price: listingPrice, protocolData } = listing;

    // const provider = getProvider();
    // const signer = new ethers.Wallet(privateKey, provider);

    // console.log(protocolData);
    // const snipe = await getClient()?.actions.buyToken({
    //   taker: walletAddress,
    //   signer,
    //   skipBalanceCheck: true,
    //   quantity: 1,
    //   normalizeRoyalties: false,
    //   allowInactiveOrderIds: false,
    //   rawOrders: [
    //     {
    //       data: {
    //         protocolData,
    //       },
    //       kind: "seaport-v1.4",
    //     },
    //   ],
    //   // expectedPrice: listingPrice,
    //   onProgress: progress => {
    //     console.log(progress);
    //   },
    // });

    // console.log(snipe);
  } catch (err) {
    // console.log(err);
    const data = {
      type: "failed",
      taskId,
    };
    newSnipeUpdate(taskOwner, data);
    console.log(err.message);
  }
}

module.exports = fullfillSnipeTasks;

// {
//   parameters: {
//     conduitKey: '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
//     consideration: [ [Object], [Object], [Object] ],
//     counter: 0,
//     endTime: '1678143600',
//     offer: [ [Object] ],
//     offerer: '0xfe697c5527ab86daa1e4c08286d2be744a0e321e',
//     orderType: 2,
//     salt: '0x2db9944fc9e7c687de8d07e04bc2bf85166e',
//     startTime: '1678113480',
//     totalOriginalConsiderationItems: 3,
//     zone: '0x004C00500000aD104D7DBd00e3ae0A5C00560C00',
//     zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000'
//   },
//   signature: '0x28d117b2f34f06832552476b6eedf35921e9fd25d90d104723f1b3bd6ba9fd2f4b9d62dd7057ee3e07d81c2efa3da2421251e603b7491b67abeeb4b22ba714c9'
// }
