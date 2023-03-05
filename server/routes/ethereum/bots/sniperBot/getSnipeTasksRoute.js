const express = require("express");
const checkAuth = require("../../../../middleware/checkAuth");
const snipeTasks = require("../../../../services/botsCache/snipeBots/snipeTasks");

const getSnipeTasksRoute = express();

getSnipeTasksRoute.get("/sniper/getTasks", checkAuth, async (req, res) => {
  try {
    const { address } = req.userDetails;

    const tasks = Object.values(snipeTasks).flatMap(arr => arr.filter(task => task.taskOwner === address));

    res.status(200).json(tasks);
  } catch (e) {
    console.log(e);
    res.status(400).json(e.message);
  }
});

module.exports = getSnipeTasksRoute;
