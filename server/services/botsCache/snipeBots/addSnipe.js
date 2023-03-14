const snipeTasks = require("./snipeTasks");

function addSnipe(task, collectionAddress) {
  snipeTasks[collectionAddress] ? snipeTasks[collectionAddress].push(task) : (snipeTasks[collectionAddress] = [task]);
}

module.exports = addSnipe;
