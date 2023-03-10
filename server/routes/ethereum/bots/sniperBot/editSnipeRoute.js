const express = require("express");
const checkAuth = require("../../../../middleware/checkAuth");
const Snipe = require("../../../../models/bots/SnipeModel");
const removeTask = require("../../../../services/botsCache/snipeBots/removeTask");
const addSnipe = require("../../../../services/botsCache/snipeBots/addSnipe");
const Web3 = require("web3");
const web3 = new Web3();

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
        remaining,
        taskId,
        skipFlagged,
      } = data;

      if (
        !privateKey ||
        !collectionAddress ||
        !maxPrice ||
        !walletAddress ||
        !maxAutoBuy ||
        !maxPriorityFeePerGas ||
        !taskId ||
        !remaining ||
        !skipFlagged
      )
        throw new Error("missinng data");

      const task = {
        collectionAddress,
        privateKey,
        minPrice,
        maxPrice,
        walletAddress,
        maxAutoBuy,
        remaining,
        maxPriorityFeePerGas,
        taskOwner,
        collectionName,
        collectionImage,
        taskId,
        skipFlagged,
      };

      await Snipe.updateOne({ address: taskOwner }, { $push: { tasks: task } }, { upsert: true });

      addSnipe(task, collectionAddress);

      res.status(200).json("task added");
    } else if (type === "remove") {
      const taskId = data;
      if (!taskId) throw new Error("missing data");

      await removeTask(taskId, taskOwner);

      res.status(200).json("task removed");
    } else if (type === "restart") {
      const { taskId, privateKey } = data;

      if (!taskId || !privateKey) throw new Error("missing data");

      const walletAddress = (await web3.eth.accounts.privateKeyToAccount(privateKey)).address;

      console.log(walletAddress);

      const snipe = (
        await Snipe.findOneAndUpdate(
          { address: taskOwner, "tasks.taskId": taskId },
          { $set: { "tasks.$.status": "active", "tasks.$.walletAddress": walletAddress } },
          { new: true, arrayFilters: [{ "tasks.taskId": taskId }] }
        )
      )?.tasks?.[0]?.["_doc"];

      if (!snipe) throw new Error("task not found");

      const newSnipe = { ...snipe };
      newSnipe["privateKey"] = privateKey;
      newSnipe["walletAddress"] = walletAddress;

      addSnipe(newSnipe, newSnipe.collectionAddress);
      res.status(200).json(walletAddress);
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(e.message);
  }
});

module.exports = editSnipeRoute;
