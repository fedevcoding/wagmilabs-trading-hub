const Snipe = require("../../../models/bots/SnipeModel");
const { newSnipeUpdate } = require("../../../socketio/handlers/newSnipeUpdate");
const snipeTasks = require("./snipeTasks");

async function updateTask(id, data, taskOwner) {
  const { properties } = data;

  newSnipeUpdate(taskOwner, data);

  const updateQuery = {};
  properties.forEach(property => {
    const { key, value } = property;
    updateQuery[`tasks.$.${key}`] = value;
  });

  await Snipe.updateOne({ address: taskOwner, "tasks.taskId": id }, { $set: updateQuery });

  Object.values(snipeTasks)?.flatMap(arr =>
    arr.forEach(task => {
      if (task.taskId === id) {
        properties.forEach(property => {
          const { key, value } = property;
          task[key] = value;
        });
      }
    })
  );
}

module.exports = updateTask;
