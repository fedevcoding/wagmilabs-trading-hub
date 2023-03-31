const mintTasks = require("./mintTasks");

const findTask = targetTaskId => {
  for (const topLevelKey in mintTasks) {
    if (!mintTasks.hasOwnProperty(topLevelKey)) continue;

    const contractAddresses = mintTasks[topLevelKey];

    // Iterate through contract addresses
    for (const contractAddress in contractAddresses) {
      if (!contractAddresses.hasOwnProperty(contractAddress)) continue;

      const contractCallers = contractAddresses[contractAddress];

      // Iterate through contract callers
      for (const contractCaller in contractCallers) {
        if (!contractCallers.hasOwnProperty(contractCaller)) continue;

        const methodIds = contractCallers[contractCaller];

        // Iterate through method IDs
        for (const methodId in methodIds) {
          if (!methodIds.hasOwnProperty(methodId)) continue;

          const taskArray = methodIds[methodId];

          // Find the required task by taskId
          const foundTask = taskArray.find(task => task.taskId === targetTaskId);
          if (foundTask) {
            return foundTask;
          }
        }
      }
    }
  }

  // If the task is not found, return null
  return null;
};

const findTasksByOwner = ownerAddress => {
  const results = [];

  // Iterate through the top level keys (e.g. 'stateChange', 'timeChange')
  for (const topLevelKey in mintTasks) {
    if (!mintTasks.hasOwnProperty(topLevelKey)) continue;

    const contractAddresses = mintTasks[topLevelKey];

    // Iterate through contract addresses
    for (const contractAddress in contractAddresses) {
      if (!contractAddresses.hasOwnProperty(contractAddress)) continue;

      const contractCallers = contractAddresses[contractAddress];

      // Iterate through contract callers
      for (const contractCaller in contractCallers) {
        if (!contractCallers.hasOwnProperty(contractCaller)) continue;

        const methodIds = contractCallers[contractCaller];

        // Iterate through method IDs
        for (const methodId in methodIds) {
          if (!methodIds.hasOwnProperty(methodId)) continue;

          const taskArray = methodIds[methodId];

          // Filter tasks based on the given owner and add them to the results array
          results.push(...taskArray.filter(task => task?.taskOwner?.toLowerCase() === ownerAddress.toLowerCase()));
        }
      }
    }
  }

  return results;
};

const removeTaskById = targetTaskId => {
  // Iterate through the top level keys (e.g. 'stateChange', 'timeChange')
  for (const topLevelKey in mintTasks) {
    if (!mintTasks.hasOwnProperty(topLevelKey)) continue;

    const contractAddresses = mintTasks[topLevelKey];

    // Iterate through contract addresses
    for (const contractAddress in contractAddresses) {
      if (!contractAddresses.hasOwnProperty(contractAddress)) continue;

      const contractCallers = contractAddresses[contractAddress];

      // Iterate through contract callers
      for (const contractCaller in contractCallers) {
        if (!contractCallers.hasOwnProperty(contractCaller)) continue;

        const methodIds = contractCallers[contractCaller];

        // Iterate through method IDs
        for (const methodId in methodIds) {
          if (!methodIds.hasOwnProperty(methodId)) continue;

          const taskArray = methodIds[methodId];

          // Find the index of the task with the target taskId
          const taskIndex = taskArray.findIndex(task => task.taskId === targetTaskId);

          // If the task is found, remove it from the array and return true
          if (taskIndex !== -1) {
            taskArray.splice(taskIndex, 1);
            return true;
          }
        }
      }
    }
  }

  // If the task is not found, return false
  return false;
};

module.exports = { findTask, findTasksByOwner, removeTaskById };
