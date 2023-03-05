const express = require("express");
const checkAuth = require("../../../../middleware/checkAuth");
const snipeTasks = require("../../../../services/botsCache/snipeBots/snipeTasks");

const newSnipeRoute = express();

newSnipeRoute.post("/sniper/newTask", checkAuth, async (req, res) => {
  try {
    const { data, type } = req.body;
    const { address: taskOwner } = req.userDetails;

    const {
      privateKey,
      minPrice,
      maxPrice,
      walletAddress,
      maxAutoBuy,
      maxPriorityFeePerGas,
      collectionAddress,
      collectionName,
      collectionImage,
    } = data;

    if (!privateKey || !collectionAddress || !maxPrice || !walletAddress || !maxAutoBuy || !maxPriorityFeePerGas)
      throw new Error("missinng data");

    if (type === "add") {
      const task = {
        collectionAddress,
        privateKey,
        minPrice,
        maxPrice,
        walletAddress,
        maxAutoBuy,
        maxPriorityFeePerGas,
        taskOwner,
        collectionName,
        collectionImage,
      };
      snipeTasks[collectionAddress]
        ? snipeTasks[collectionAddress].push(task)
        : (snipeTasks[collectionAddress] = [task]);

      res.status(200).json("task added");
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(e.message);
  }
});

module.exports = newSnipeRoute;
