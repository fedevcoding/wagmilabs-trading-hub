import { useState } from "react";

export const useHandleData = (activeSnipes, setActiveSnipes) => {
  const [section, setSection] = useState("active");

  const [showNewTask, setShowNewTask] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);

  const [restartTaskModalData, setRestartTaskModalData] = useState({
    // taskId: null,
    show: false,
  });

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
    if (state === "restart") {
      console.log(data);
      const newTasks = activeSnipes.map(task => {
        if (task.taskId === data.taskId) {
          return { ...task, status: "active", walletAddress: data.walletAddress };
        }
        return { ...task };
      });
      setActiveSnipes(newTasks);
    }
  };

  const handleTaskUpdate = data => {
    const { properties, taskId } = data;

    const newTasks = activeSnipes.map(task => {
      if (task.taskId === taskId) {
        const newTask = { ...task };

        properties.forEach(property => {
          const { key, value } = property;
          newTask[key] = value;
        });

        return newTask;
      }
      return { ...task };
    });
    setActiveSnipes(newTasks);
  };

  return {
    showNewTask,
    showDeleteTask,
    toggleNewTaskModal,
    toggleDeleteTaskModal,
    toggleSnipe,
    section,
    setSection,
    handleTaskUpdate,
    restartTaskModalData,
    setRestartTaskModalData,
  };
};
