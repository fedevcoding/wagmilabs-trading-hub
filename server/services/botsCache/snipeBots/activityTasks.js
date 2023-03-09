const Snipes = require("../../../models/bots/SnipeModel");

const updateActivity = async task => {
  const { taskOwner } = task;
  await Snipes.updateOne({ address: taskOwner }, { $push: { activities: task } });
};

module.exports = { updateActivity };
