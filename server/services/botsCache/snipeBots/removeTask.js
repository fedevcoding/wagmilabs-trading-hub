const snipeTasks = require("./snipeTasks");
const Snipe = require("../../../models/bots/SnipeModel");

async function removeTask(id, taskOwner) {
  await Snipe.updateOne({ address: taskOwner }, { $pull: { tasks: { taskId: id } } });
  Object.values(snipeTasks)?.flatMap(arr =>
    arr.forEach((task, index) => {
      if (task.taskId === id) arr.splice(index, 1);
    })
  );
}

module.exports = removeTask;
