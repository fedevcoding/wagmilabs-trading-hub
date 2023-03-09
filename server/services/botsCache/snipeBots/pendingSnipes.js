const pendingSnipes = {};

const addPendingSnipe = id => {
  const currentValue = pendingSnipes[id];
  pendingSnipes[id] = currentValue ? currentValue + 1 : 1;
};

const removePendingSnipe = id => {
  const currentValue = pendingSnipes[id];
  if (currentValue) pendingSnipes[id] = currentValue - 1;
};

module.exports = { pendingSnipes, addPendingSnipe, removePendingSnipe };
