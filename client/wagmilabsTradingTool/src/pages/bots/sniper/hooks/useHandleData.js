import { useState } from "react";

export const useHandleData = () => {
  const [showNewTask, setShowNewTask] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);

  const toggleNewTask = state => {
    setShowNewTask(state);
  };

  const toggleDeleteTask = state => {
    setShowDeleteTask(state);
  };

  return { showNewTask, showDeleteTask, toggleNewTask, toggleDeleteTask };
};
