const express = require("express");
const checkAuth = require("../../../../middleware/checkAuth");
const snipeTasks = require("../../../../services/botsCache/snipeBots/snipeTasks");
const Snipe = require("../../../../models/bots/SnipeModel");
const removeTask = require("../../../../services/botsCache/snipeBots/removeTask");

const getSnipeTasksRoute = express();

getSnipeTasksRoute.get("/sniper/getTasks", checkAuth, async (req, res) => {
  try {
    const { address } = req.userDetails;

    const dbSnipeTasks = await Snipe.findOne({ address });
    const { tasks: dbtasks, activities } = dbSnipeTasks || { tasks: [] };

    const serverTasks = Object.values(snipeTasks)?.flatMap(arr => arr.filter(task => task?.taskOwner === address));

    // remove from snipeTasks task that are in server but not in db
    serverTasks.forEach(serverTask => {
      const dbTask = dbtasks.find(dbTask => dbTask.taskId === serverTask.taskId);
      if (!dbTask) {
        removeTask(serverTask.taskId);
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

    res.status(200).json({ tasks, activities });
  } catch (e) {
    console.log(e);
    res.status(400).json(e.message);
  }
});

module.exports = getSnipeTasksRoute;
