import { useState } from "react";

export const useHandleData = (activeSnipes, setActiveSnipes) => {
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
      const newTasks = [data, ...activeSnipes];
      setActiveSnipes(newTasks);
    }
    if (state === "remove") {
      const newTasks = activeSnipes.filter(snipe => snipe.taskId !== data);
      setActiveSnipes(newTasks);
    }
  };

  return { showNewTask, showDeleteTask, toggleNewTaskModal, toggleDeleteTaskModal, toggleSnipe, section, setSection };
};
