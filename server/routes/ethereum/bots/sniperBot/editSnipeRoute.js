const express = require("express");
const checkAuth = require("../../../../middleware/checkAuth");
const snipeTasks = require("../../../../services/botsCache/snipeBots/snipeTasks");
const Snipe = require("../../../../models/bots/SnipeModel");
const removeTask = require("../../../../services/botsCache/snipeBots/removeTask");

const editSnipeRoute = express();

editSnipeRoute.post("/sniper/editTask", checkAuth, async (req, res) => {
  try {
    const { data, type } = req.body;
    const { address: taskOwner } = req.userDetails;

    if (type === "add") {
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
        taskId,
      } = data;

      if (
        !privateKey ||
        !collectionAddress ||
        !maxPrice ||
        !walletAddress ||
        !maxAutoBuy ||
        !maxPriorityFeePerGas ||
        !taskId
      )
        throw new Error("missinng data");

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
        taskId,
      };

      await Snipe.findOneAndUpdate({ address: taskOwner }, { $push: { tasks: task } }, { upsert: true });

      snipeTasks[collectionAddress]
        ? snipeTasks[collectionAddress].push(task)
        : (snipeTasks[collectionAddress] = [task]);

      res.status(200).json("task added");
    } else if (type === "remove") {
      const taskId = data;
      if (!taskId) throw new Error("missing data");

      await Snipe.updateOne({ address: taskOwner }, { $pull: { tasks: { taskId } } });
      removeTask(taskId);

      res.status(200).json("task removed");
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(e.message);
  }
});

module.exports = editSnipeRoute;
