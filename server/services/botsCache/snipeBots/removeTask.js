const snipeTasks = require("./snipeTasks");

function removeTask(id) {
  Object.values(snipeTasks)?.flatMap(arr =>
    arr.forEach((task, index) => {
      if (task.taskId === id) arr.splice(index, 1);
    })
  );
}

module.exports = removeTask;
