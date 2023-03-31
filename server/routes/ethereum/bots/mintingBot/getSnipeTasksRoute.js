const express = require("express");
const checkAuth = require("../../../../middleware/checkAuth");
const MintingTasks = require("../../../../models/bots/MintingModel");
const checkPro = require("../../../../middleware/checkPro");
const { findTasksByOwner, findTask, removeTaskById } = require("../../../../services/botsCache/mintingBot/taskUtils");

const getMintingTasksRoute = express();

getMintingTasksRoute.get("/minting/getTasks", checkAuth, checkPro, async (req, res) => {
  try {
    const { address } = req.userDetails;

    const dbMintTasks = await MintingTasks.findOne({ address });
    const { tasks: dbtasks, activities } = dbMintTasks || { tasks: [] };

    const serverTasks = findTasksByOwner(address);

    // remove from intTasks task that are in server but not in db
    serverTasks.forEach(serverTask => {
      const { taskId } = serverTask;
      const dbTask = findTask(taskId);
      if (!dbTask) {
        removeTaskById(taskId);
      }
    });

    // add missingData property to tasks that are in db but not in server in serverTasks array
    const tasks = dbtasks.map(dbtask => {
      const serverTask = serverTasks?.find(serverTask => serverTask.taskId === dbtask.taskId);
      const newTask = { ...dbtask["_doc"] };
      if (!serverTask) {
        newTask.status = "inactive";
      }
      return newTask;
    });

    tasks?.reverse();
    activities?.reverse();

    res.status(200).json({ tasks, activities });
  } catch (e) {
    console.log(e);
    res.status(400).json(e.message);
  }
});

module.exports = getMintingTasksRoute;
