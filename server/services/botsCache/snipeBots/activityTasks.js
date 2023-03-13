const Snipes = require("../../../models/bots/SnipeModel");

const updateActivity = async (status, task) => {
  const { taskOwner } = task;
  if (status === "success") {
    await Snipes.updateOne({ address: taskOwner }, { $push: { activities: task } });
  } else {
    await Snipes.updateOne({ address: taskOwner }, { $push: { activities: task } });
  }
};

module.exports = { updateActivity };
