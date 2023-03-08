const { newSnipeUpdate } = require("../../../server");
const Snipe = require("../../../models/bots/SnipeModel");
const snipeTasks = require("./snipeTasks");

async function updateTask(id, data, taskOwner) {
  const { property, value } = data;

  newSnipeUpdate(taskOwner, data);

  await Snipe.findOneAndUpdate(
    { address: taskOwner, "tasks.taskId": id },
    { $set: { [`tasks.$.${property}`]: value } }
  );

  Object.values(snipeTasks)?.flatMap(arr =>
    arr.forEach((task, index) => {
      console.log(task);
      if (task.taskId === id) task[property] = value;
    })
  );
}

module.exports = updateTask;
