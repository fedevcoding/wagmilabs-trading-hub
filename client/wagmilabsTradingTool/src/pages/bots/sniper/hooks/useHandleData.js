import { useState, useCallback } from "react";

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

  const toggleSnipe = useCallback(
    (state, data) => {
      if (state === "add") {
        const newTasks = [data, ...activeSnipes];
        setActiveSnipes(newTasks);
      }
      if (state === "remove") {
        console.log("removing");
        const newTasks = activeSnipes.filter(snipe => snipe.taskId !== data);
        setActiveSnipes(newTasks);
      }
      if (state === "restart") {
        const newTasks = activeSnipes.map(task => {
          if (task.taskId === data.taskId) {
            return { ...task, status: "active", walletAddress: data.walletAddress };
          }
          return { ...task };
        });
        setActiveSnipes(newTasks);
      }
    },
    [activeSnipes, setActiveSnipes]
  );

  const handleTaskUpdate = useCallback(
    data => {
      const { properties, taskId, remaining } = data;

      if (remaining === 1) {
        toggleSnipe("remove", taskId);
      } else {
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
      }
    },
    [activeSnipes, setActiveSnipes, toggleSnipe]
  );

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
