import { useState } from "react";

export const useHandleData = activeSnipes => {
  const [section, setSection] = useState("active");

  const [showNewTask, setShowNewTask] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);

  const toggleNewTaskModal = state => {
    setShowNewTask(state);
  };

  const toggleDeleteTaskModal = state => {
    setShowDeleteTask(state);
  };

  const toggleSnipe = (state, data) => {
    if (state === "add") {
      activeSnipes.push(data);
    }
  };

  return { showNewTask, showDeleteTask, toggleNewTaskModal, toggleDeleteTaskModal, toggleSnipe, section, setSection };
};
