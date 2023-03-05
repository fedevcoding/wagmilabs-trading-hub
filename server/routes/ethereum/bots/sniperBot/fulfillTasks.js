const { getClient } = require("@reservoir0x/reservoir-sdk");
const { createClient } = require("@reservoir0x/reservoir-sdk");
// reservoir client
createClient({
  apiBase: "https://api.reservoir.tools",
  apiKey: "9a16bf8e-ec68-5d88-a7a5-a24044de3f38",
  source: CLIENT_URL,
});

const snipeTasks = require("../../../../services/botsCache/snipeBots/snipeTasks");

const fullfillSnipeTasks = async listing => {
  const { tokenAdddress, listingPrice } = listing;

  const collectionTasks = snipeTasks[tokenAdddress];

  if (!collectionTasks) return;

  for (const collectionTask of collectionTasks) {
    const { minPrice, maxPrice } = collectionTask;
    if (price === listingPrice) {
      if (maxPrice >= listingPrice) {
        // execute the task
      }
    }
  }
};

async function fullfillOrder(order) {
  try {
    const { tokenAddress, listingPrice } = order;
    const collectionTasks = snipeTasks[tokenAddress];

    // getClient()?.actions.buyToken({
    //     tokens: [{ tokenId, contract: contractAddress }],
    //     signer,
    //     options: {
    //         maxFeePerGas: `${maxFeePerGas}`,
    //         maxPriorityFeePerGas: `${maxPriorityFeePerGas}`,
    //         // skipBalanceCheck
    //     },
    //     expectedPrice: listingPrice,
    //     onProgress: (steps) => {
    //     }
    // })
  } catch (err) {
    console.log(err);
  }
}

module.exports = fullfillSnipeTasks;
