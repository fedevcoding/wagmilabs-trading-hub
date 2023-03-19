const snipeTasks = require("./snipeTasks");
const Snipe = require("../../../models/bots/SnipeModel");

async function removeTask(id, taskOwner) {
  try {
    await Snipe.updateOne({ address: taskOwner }, { $pull: { tasks: { taskId: id } } });
    Object.values(snipeTasks)?.flatMap(arr =>
      arr.forEach((task, index) => {
        if (task.taskId === id) arr.splice(index, 1);
      })
    );
  } catch (e) {
    console.log("error: ", e);
  }
}

module.exports = removeTask;
